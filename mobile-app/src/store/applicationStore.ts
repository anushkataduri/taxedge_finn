import { create } from "zustand";

import { mockApplications } from "../data/applications";
import { notificationService } from "../modules/notifications/services/notificationService";
import type {
  Application,
  ApplicationDocument,
  ApplicationFormData,
  ChatMessage,
  ChatSender,
  PaymentStatus,
  ServiceCategoryId,
} from "../types/domain";

export interface GstRegistrationDraft {
  id: string;
  stepIndex: number;
  personalData: Record<string, string>;
  businessData: Record<string, string>;
  documents: Array<{
    id: string;
    name: string;
    subtitle: string;
    required: boolean;
    iconName: string;
    iconBg: string;
    iconColor: string;
    category: string;
    fileUri?: string;
    fileName?: string;
    fileSize?: string;
    uploadedAt?: string;
  }>;
  updatedAt: string;
}

export interface GstFilingDraft {
  id: string;
  stepIndex: number;
  periodData: {
    periodType: string;
    financialYear?: string;
    filingMonth: string;
    filingPeriod?: string;
    gstin: string;
    filingType: string;
  };
  documents: Array<{
    id: string;
    name: string;
    subtitle: string;
    required: boolean;
    iconName: string;
    iconBg: string;
    iconColor: string;
    category: string;
    fileUri?: string;
    fileName?: string;
    fileSize?: string;
    uploadedAt?: string;
  }>;
  updatedAt: string;
}

export interface ApplicationState {
  applications: Application[];
  selectedApplicationId: string | null;
  gstDraft: GstRegistrationDraft | null;
  gstFilingDraft: GstFilingDraft | null;
  setSelectedApplicationId: (id: string | null) => void;
  saveGstDraft: (draft: GstRegistrationDraft) => void;
  clearGstDraft: () => void;
  saveGstFilingDraft: (draft: GstFilingDraft) => void;
  clearGstFilingDraft: () => void;
  /** Creates an application and returns its generated id. */
  createApplication: (
    serviceId: string,
    serviceName: string,
    category: ServiceCategoryId,
    formData: ApplicationFormData,
    requiredDocs: (string | ApplicationDocument)[],
    paymentAmount: number,
    initialPaymentStatus?: PaymentStatus,
    skipNotification?: boolean,
  ) => string;
  uploadDocument: (appId: string, docName: string, fileUri: string) => void;
  addChatMessage: (appId: string, sender: ChatSender, text: string) => void;
  payApplication: (appId: string) => void;
}

const timeStamp = (): string =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: mockApplications,
  selectedApplicationId: null,
  gstDraft: null,
  gstFilingDraft: null,
  setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
  saveGstDraft: (draft) => set({ gstDraft: draft }),
  clearGstDraft: () => set({ gstDraft: null }),
  saveGstFilingDraft: (draft) => set({ gstFilingDraft: draft }),
  clearGstFilingDraft: () => set({ gstFilingDraft: null }),
  createApplication: (
    serviceId,
    serviceName,
    category,
    formData,
    requiredDocs,
    paymentAmount,
    initialPaymentStatus,
    skipNotification,
  ) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const prefix = category.substring(0, 4).toUpperCase();
    const appId = `${prefix}-2026-${randomNum}`;

    const newApp: Application = {
      id: appId,
      serviceId,
      serviceName,
      category,
      status: "Verification",
      progress: 20,
      assignedExecutive: ["Rahul", "Sneha", "Vikram", "Karan"][
        Math.floor(Math.random() * 4)
      ],
      paymentAmount,
      paymentStatus: initialPaymentStatus || (paymentAmount > 0 ? "Pending" : "Paid"),
      createdAt: new Date().toISOString().split("T")[0],
      formData,
      documents: requiredDocs.map((doc) =>
        typeof doc === "string"
          ? { name: doc, status: "Pending" }
          : { name: doc.name, status: doc.status || "Pending", fileUri: doc.fileUri }
      ),
      timeline: serviceId === "gst-filing"
        ? [
            { title: "Customer Request", description: "Filing request initiated", status: "completed", date: "Today" },
            { title: "Document Upload", description: "Sales & purchase records submitted", status: "completed", date: "Today" },
            { title: "Staff Verification", description: "CA reviewing invoices & reconciliation", status: "current", date: "Today" },
            { title: "Data Preparation", description: "Accounting integration & ledger extraction", status: "pending" },
            { title: "Return Preparation", description: "Tax computation & ITC calculation", status: "pending" },
            { title: "Customer Review", description: "Return draft shared with customer", status: "pending" },
            { title: "Customer Approval", description: "Sign-off received from business", status: "pending" },
            { title: "GST Filing", description: "Submission to GST portal", status: "pending" },
            { title: "Acknowledgement Receipt", description: "ARN generated & filed copy delivered", status: "pending" },
            { title: "Completed", description: "Filing process closed", status: "pending" },
          ]
        : [
            {
              title: "Application Submitted",
              description: "Application filed online",
              status: "completed",
              date: "Today",
            },
            {
              title: "Document Collection",
              description: "Checking uploaded and pending files",
              status: "current",
              date: "Today",
            },
            {
              title: "Verification",
              description: "Verification by executive",
              status: "pending",
            },
            {
              title: "Completed",
              description: "Filing/Approval confirmation",
              status: "pending",
            },
          ],
      chatHistory: [
        {
          id: "1",
          sender: "staff",
          text: `Hello! I have been assigned as your service representative. Let me know if you have any questions about this request.`,
          timestamp: "Just now",
        },
      ],
    };

    set((state) => ({
      applications: [newApp, ...state.applications],
    }));

    if (!skipNotification) {
      notificationService.notifyApplicationSubmitted(serviceName, appId);
    }

    return appId;
  },
  uploadDocument: (appId, docName, fileUri) =>
    set((state) => {
      return {
        applications: state.applications.map((app) => {
          if (app.id !== appId) return app;
          const newDocs = app.documents.map((doc) =>
            doc.name === docName
              ? { ...doc, status: "Uploaded" as const, fileUri }
              : doc,
          );
          const uploadedCount = newDocs.filter(
            (d) => d.status === "Uploaded",
          ).length;
          const totalDocs = newDocs.length;
          const progress = Math.min(
            95,
            Math.round(20 + (uploadedCount / totalDocs) * 50),
          );
          return {
            ...app,
            documents: newDocs,
            progress,
            status:
              uploadedCount === totalDocs
                ? "Verification"
                : "Document Collection",
          };
        }),
      };
    }),
  addChatMessage: (appId, sender, text) => {
    const messageId = Math.random().toString();
    const newMessage: ChatMessage = {
      id: messageId,
      sender,
      text,
      timestamp: timeStamp(),
    };

    set((state) => ({
      applications: state.applications.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          chatHistory: [...app.chatHistory, newMessage],
        };
      }),
    }));

    // If sent by user, simulate automated executive response after 1.5s
    if (sender === "user") {
      setTimeout(() => {
        const staffMessage: ChatMessage = {
          id: Math.random().toString(),
          sender: "staff",
          text: "Thank you for your message. I am looking into your application. I will review and update your document status shortly.",
          timestamp: timeStamp(),
        };
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              chatHistory: [...app.chatHistory, staffMessage],
            };
          }),
        }));
      }, 1500);
    }
  },
  payApplication: (appId) => {
    let paidAmount = 0;
    let paidServiceName = "";

    set((state) => ({
      applications: state.applications.map((app) => {
        if (app.id !== appId) return app;
        paidAmount = app.paymentAmount;
        paidServiceName = app.serviceName;
        const newTimeline = app.timeline.map((step) =>
          step.title === "Verification"
            ? { ...step, status: "completed" as const }
            : step,
        );

        return {
          ...app,
          paymentStatus: "Paid" as const,
          progress: Math.min(100, app.progress + 15),
          timeline: newTimeline,
        };
      }),
    }));

    if (paidAmount > 0 || paidServiceName) {
      notificationService.notifyPaymentSuccessful(paidAmount, paidServiceName);
    }
  },
}));
