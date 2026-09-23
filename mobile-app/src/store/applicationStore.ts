import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { applicationService } from "../modules/applications/services/applicationService";
import { notificationService } from "../modules/notifications/services/notificationService";
import { useAuthStore } from "../modules/authentication/store/authStore";
import { getCustomerDrafts, addDraftToIndex, removeDraftFromIndex } from "../shared/hooks/useServiceDraft";
import type {
  Application,
  ApplicationDocument,
  ApplicationFormData,
  ChatMessage,
  ChatSender,
  PaymentStatus,
  ServiceCategoryId,
} from "../types/domain";

function getActiveCustomerMobile(): string {
  const authState = useAuthStore.getState();
  const mobile =
    authState.customer?.mobile ||
    authState.authenticatedUser?.mobileNumber ||
    authState.mobileNumber;
  return mobile ? String(mobile).replace(/\D/g, "") : "";
}

async function getPersistedApplications(cleanMobile: string): Promise<Application[]> {
  if (!cleanMobile) return [];
  try {
    const raw = await AsyncStorage.getItem(`@taxedge_apps_${cleanMobile}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function savePersistedApplications(cleanMobile: string, apps: Application[]): Promise<void> {
  if (!cleanMobile) return;
  try {
    const realApps = apps.filter((a) => a.status !== "Draft" && !a.id.startsWith("DRAFT-"));
    await AsyncStorage.setItem(`@taxedge_apps_${cleanMobile}`, JSON.stringify(realApps));
  } catch (err) {
    console.warn("Failed to persist applications to AsyncStorage:", err);
  }
}

function normalizeDraftStep(step: unknown): number {
  if (typeof step === "number" && Number.isFinite(step)) return step;
  if (typeof step !== "string") return 0;

  const stepMap: Record<string, number> = {
    FORM: 0,
    DETAILS: 0,
    UPLOAD: 1,
    DOCUMENTS: 1,
    SUMMARY: 2,
    REVIEW: 3,
    ESTIMATE: 2,
    PAYMENT: 3,
  };

  return stepMap[step.toUpperCase()] ?? 0;
}

function getDraftResumeRoute(serviceKey: string, step: unknown): string {
  if (serviceKey === "tds-refund") {
    const routeMap: Record<string, string> = {
      DOCUMENTS: "/service/tds-checklist",
      ESTIMATE: "/service/tds-estimate",
      PAYMENT: "/service/tds-payment",
    };
    return routeMap[String(step || "").toUpperCase()] || "/service/tds-form";
  }

  const routeMap: Record<string, string> = {
    "tax-notice": "/service/tax-notice-assistance",
    "previous-year-itr": "/service/previous-year-itr",
    "revised-itr": "/service/revised-itr",
  };

  return routeMap[serviceKey] || `/service/${serviceKey}`;
}

function normalizeDraftDocuments(draft: any): ApplicationDocument[] {
  const docs = Array.isArray(draft.documents)
    ? draft.documents
    : Array.isArray(draft.formData?.documents)
      ? draft.formData.documents
      : [];

  return docs.map((doc: any) => ({
    name: doc.name || doc.title || doc.id || "Required Document",
    status:
      String(doc.status || "").toLowerCase() === "uploaded" || Boolean(doc.fileUri)
        ? "Uploaded"
        : "Pending",
    fileUri: doc.fileUri || doc.uri,
  }));
}

function draftToApplication(draft: any, cleanMobile: string): Application {
  const sid = draft.serviceKey || draft.serviceId || "service";
  const cat: ServiceCategoryId =
    draft.category || (sid.startsWith("gst") ? "GST" : "ITR");
  const serviceName =
    draft.serviceName ||
    sid
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const rawStep = draft.step ?? draft.stepIndex ?? draft.savedStep;
  const stepNum = normalizeDraftStep(rawStep);
  const documents = normalizeDraftDocuments(draft);
  const updatedAt = draft.updatedAt || new Date().toISOString();

  return {
    id: draft.id || `DRAFT-${sid.toUpperCase()}-${cleanMobile.slice(-4) || "USER"}`,
    serviceId: sid,
    serviceName,
    category: cat,
    status: "Draft",
    progress: Math.min(95, Math.max(5, Math.round(((stepNum + 1) / 5) * 100))),
    assignedExecutive: "",
    paymentAmount: 0,
    paymentStatus: "Pending" as const,
    createdAt: updatedAt,
    formData: {
      ...(draft.formData || {}),
      isDraft: true,
      savedStep: rawStep,
      resumeRoute: getDraftResumeRoute(sid, rawStep),
    },
    documents,
    timeline: [],
    chatHistory: [],
  };
}

export interface GstRegistrationDraft {
  id: string;
  stepIndex: number;
  createdGstId?: string;
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
  createdFilingId?: string;
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

export interface ItrRegistrationDraft {
  id: string;
  stepIndex: number;
  category: string;
  categoryTitle: string;
  formType: string;
  assessmentYear: string;
  incomeAmount: string;
  regime: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    confirmAccountNumber?: string;
    ifscCode: string;
    accountType: string;
  };
  deductions: {
    sec80c: string;
    sec80d: string;
    homeLoan24b: string;
    educationLoan80e: string;
    otherDeductions: string;
  };
  previousFilingOption: string;
  previousAckNumber: string;
  documents: Array<{
    id: string;
    name: string;
    subtitle: string;
    required: boolean;
    fileUri?: string;
    fileName?: string;
    fileSize?: string;
    uploadedAt?: string;
  }>;
  updatedAt: string;
}

export interface TdsDraftDocument {
  id: string;
  status: "not_uploaded" | "uploaded";
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  fileTypeLabel?: string;
}

export interface TdsDraft {
  id?: string;
  formData?: Record<string, any>;
  documents?: TdsDraftDocument[];
  step?: "FORM" | "DOCUMENTS" | string;
  updatedAt?: string;
}

export interface TaxNoticeDraftDocument {
  id: string;
  title: string;
  status: "not_uploaded" | "uploaded";
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
}

export interface TaxNoticeDraft {
  id?: string;
  formData?: Record<string, any>;
  documents?: TaxNoticeDraftDocument[];
  step?: "DETAILS" | "UPLOAD" | "DOCUMENTS" | string;
  remarks?: string;
  updatedAt?: string;
}

export interface ApplicationState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  selectedApplicationId: string | null;
  gstDraft: GstRegistrationDraft | null;
  gstFilingDraft: GstFilingDraft | null;
  itrDraft: ItrRegistrationDraft | null;
  tdsDraft: TdsDraft | null;
  taxNoticeDraft: TaxNoticeDraft | null;
  previousYearDraft: any | null;
  revisedItrDraft: any | null;
  gstComplianceDraft: any | null;
  gstCancellationDraft: any | null;
  gstAmendmentDraft: any | null;
  gstCertificateDraft: any | null;
  setSelectedApplicationId: (id: string | null) => void;
  setApplications: (apps: Application[]) => void;
  loadApplications: () => Promise<void>;
  saveGstDraft: (draft: GstRegistrationDraft) => void;
  clearGstDraft: () => void;
  saveGstFilingDraft: (draft: GstFilingDraft) => void;
  clearGstFilingDraft: () => void;
  saveItrDraft: (draft: ItrRegistrationDraft) => void;
  clearItrDraft: () => void;
  saveTdsDraft: (draft: Partial<TdsDraft>) => void;
  clearTdsDraft: () => void;
  saveTaxNoticeDraft: (draft: Partial<TaxNoticeDraft>) => void;
  clearTaxNoticeDraft: () => void;
  savePreviousYearDraft: (draft: any) => void;
  clearPreviousYearDraft: () => void;
  saveRevisedItrDraft: (draft: any) => void;
  clearRevisedItrDraft: () => void;
  saveGstComplianceDraft: (draft: any) => void;
  clearGstComplianceDraft: () => void;
  saveGstCancellationDraft: (draft: any) => void;
  clearGstCancellationDraft: () => void;
  saveGstAmendmentDraft: (draft: any) => void;
  clearGstAmendmentDraft: () => void;
  saveGstCertificateDraft: (draft: any) => void;
  clearGstCertificateDraft: () => void;
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
  deleteApplication: (appId: string) => void;
  resetStore: () => void;
}

const timeStamp = (): string =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  isLoading: false,
  error: null,
  selectedApplicationId: null,
  gstDraft: null,
  gstFilingDraft: null,
  itrDraft: null,
  tdsDraft: null,
  taxNoticeDraft: null,
  previousYearDraft: null,
  revisedItrDraft: null,
  gstComplianceDraft: null,
  gstCancellationDraft: null,
  gstAmendmentDraft: null,
  gstCertificateDraft: null,
  resetStore: () =>
    set({
      applications: [],
      selectedApplicationId: null,
      error: null,
      gstDraft: null,
      gstFilingDraft: null,
      itrDraft: null,
      tdsDraft: null,
      taxNoticeDraft: null,
      previousYearDraft: null,
      revisedItrDraft: null,
      gstComplianceDraft: null,
      gstCancellationDraft: null,
      gstAmendmentDraft: null,
      gstCertificateDraft: null,
    }),
  setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
  setApplications: (apps) => {
    set({ applications: apps });
    savePersistedApplications(getActiveCustomerMobile(), apps);
  },
  loadApplications: async () => {
    set({ isLoading: true, error: null });
    const cleanMobile = getActiveCustomerMobile();
    try {
      // 1. Fetch remote applications if available
      const remoteApps = await applicationService.getApplications();
      // 2. Load locally persisted applications for this customer
      const localApps = await getPersistedApplications(cleanMobile);

      // Merge remote and local (remote takes precedence by id)
      const mergedMap = new Map<string, Application>();
      localApps.forEach((app) => mergedMap.set(app.id, app));
      remoteApps.forEach((app) => mergedMap.set(app.id, app));

      // 3. Load active drafts for this authenticated customer
      const customerDrafts = await getCustomerDrafts(cleanMobile);
      const draftApplications: Application[] = customerDrafts.map((draft) =>
        draftToApplication(draft, cleanMobile),
      );

      const combinedApps = [...Array.from(mergedMap.values()), ...draftApplications];
      set({ applications: combinedApps, isLoading: false, error: null });
    } catch (err: any) {
      const localApps = await getPersistedApplications(cleanMobile);
      const customerDrafts = await getCustomerDrafts(cleanMobile);
      const draftApplications = customerDrafts.map((draft) =>
        draftToApplication(draft, cleanMobile),
      );
      const fallbackApps = [...localApps, ...draftApplications];
      set({
        applications: fallbackApps,
        isLoading: false,
        error: fallbackApps.length > 0 ? null : err?.message || "Failed to load applications. Please try again.",
      });
    }
  },
  saveGstDraft: (draft) => {
    set({ gstDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "gst-registration");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_gst-registration`, JSON.stringify({
      serviceKey: "gst-registration",
      serviceName: "GST Registration",
      category: "GST",
      step: draft.stepIndex,
      formData: draft.businessData,
      documents: draft.documents,
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearGstDraft: () => {
    set({ gstDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "gst-registration");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_gst-registration`).catch(() => {});
  },
  saveGstFilingDraft: (draft) => {
    set({ gstFilingDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "gst-filing");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_gst-filing`, JSON.stringify({
      serviceKey: "gst-filing",
      serviceName: "GST Filing",
      category: "GST",
      step: (draft as any).currentStep ?? draft.stepIndex,
      formData: draft.periodData,
      documents: draft.documents,
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearGstFilingDraft: () => {
    set({ gstFilingDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "gst-filing");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_gst-filing`).catch(() => {});
  },
  saveItrDraft: (draft) => {
    set({ itrDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "itr-filing");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_itr-filing`, JSON.stringify({
      serviceKey: "itr-filing",
      serviceName: "ITR Filing",
      category: "ITR",
      step: draft.stepIndex,
      formData: (draft as any).filingData || draft,
      documents: draft.documents,
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearItrDraft: () => {
    set({ itrDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "itr-filing");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_itr-filing`).catch(() => {});
  },
  saveTdsDraft: (draft) =>
    set((state) => {
      const updatedTds = state.tdsDraft
        ? {
            ...state.tdsDraft,
            ...draft,
            formData: draft.formData
              ? { ...(state.tdsDraft.formData || {}), ...draft.formData }
              : state.tdsDraft.formData,
            documents: draft.documents ?? state.tdsDraft.documents,
          }
        : {
            formData: draft.formData || {},
            documents: draft.documents || [],
            step: draft.step,
            updatedAt: draft.updatedAt,
          };
      const clean = getActiveCustomerMobile();
      addDraftToIndex(clean, "tds-refund");
      AsyncStorage.setItem(`@taxedge_draft_${clean}_tds-refund`, JSON.stringify({
        serviceKey: "tds-refund",
        serviceName: "TDS Refund",
        category: "ITR",
        step: updatedTds.step,
        formData: updatedTds.formData,
        documents: updatedTds.documents,
        updatedAt: updatedTds.updatedAt || new Date().toISOString().split("T")[0],
      })).catch(() => {});
      return { tdsDraft: updatedTds };
    }),
  clearTdsDraft: () => {
    set({ tdsDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "tds-refund");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_tds-refund`).catch(() => {});
  },
  saveTaxNoticeDraft: (draft) =>
    set((state) => {
      const updatedNotice = state.taxNoticeDraft
        ? {
            ...state.taxNoticeDraft,
            ...draft,
            formData: draft.formData
              ? { ...(state.taxNoticeDraft.formData || {}), ...draft.formData }
              : state.taxNoticeDraft.formData,
            documents: draft.documents ?? state.taxNoticeDraft.documents,
          }
        : {
            formData: draft.formData || {},
            documents: draft.documents || [],
            step: draft.step || "DETAILS",
            remarks: draft.remarks || "",
            updatedAt:
              draft.updatedAt ||
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
          };
      const clean = getActiveCustomerMobile();
      addDraftToIndex(clean, "tax-notice");
      AsyncStorage.setItem(`@taxedge_draft_${clean}_tax-notice`, JSON.stringify({
        serviceKey: "tax-notice",
        serviceName: "Tax Notice Assistance",
        category: "ITR",
        step: updatedNotice.step,
        formData: updatedNotice.formData,
        documents: updatedNotice.documents,
        updatedAt: updatedNotice.updatedAt || new Date().toISOString().split("T")[0],
      })).catch(() => {});
      return { taxNoticeDraft: updatedNotice };
    }),
  clearTaxNoticeDraft: () => {
    set({ taxNoticeDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "tax-notice");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_tax-notice`).catch(() => {});
  },
  savePreviousYearDraft: (draft) => {
    set({ previousYearDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "previous-year-itr");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_previous-year-itr`, JSON.stringify({
      serviceKey: "previous-year-itr",
      serviceName: "Previous Year ITR",
      category: "ITR",
      step: draft.step ?? 0,
      formData: draft.formData || draft,
      documents: draft.documents || [],
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearPreviousYearDraft: () => {
    set({ previousYearDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "previous-year-itr");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_previous-year-itr`).catch(() => {});
  },
  saveRevisedItrDraft: (draft) => {
    set({ revisedItrDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "revised-itr");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_revised-itr`, JSON.stringify({
      serviceKey: "revised-itr",
      serviceName: "Revised ITR",
      category: "ITR",
      step: draft.step ?? 0,
      formData: draft.formData || draft,
      documents: draft.documents || [],
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearRevisedItrDraft: () => {
    set({ revisedItrDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "revised-itr");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_revised-itr`).catch(() => {});
  },
  saveGstComplianceDraft: (draft) => {
    set({ gstComplianceDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "gst-compliance");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_gst-compliance`, JSON.stringify({
      serviceKey: "gst-compliance",
      serviceName: "GST Compliance",
      category: "GST",
      step: draft.step ?? 0,
      formData: draft.formData || draft,
      documents: draft.documents || [],
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearGstComplianceDraft: () => {
    set({ gstComplianceDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "gst-compliance");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_gst-compliance`).catch(() => {});
  },
  saveGstCancellationDraft: (draft) => {
    set({ gstCancellationDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "gst-cancellation");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_gst-cancellation`, JSON.stringify({
      serviceKey: "gst-cancellation",
      serviceName: "GST Cancellation",
      category: "GST",
      step: draft.step ?? 0,
      formData: draft.formData || draft,
      documents: draft.documents || [],
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearGstCancellationDraft: () => {
    set({ gstCancellationDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "gst-cancellation");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_gst-cancellation`).catch(() => {});
  },
  saveGstAmendmentDraft: (draft) => {
    set({ gstAmendmentDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "gst-amendment");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_gst-amendment`, JSON.stringify({
      serviceKey: "gst-amendment",
      serviceName: "GST Amendment",
      category: "GST",
      step: draft.step ?? 0,
      formData: draft.formData || draft,
      documents: draft.documents || [],
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearGstAmendmentDraft: () => {
    set({ gstAmendmentDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "gst-amendment");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_gst-amendment`).catch(() => {});
  },
  saveGstCertificateDraft: (draft) => {
    set({ gstCertificateDraft: draft });
    const clean = getActiveCustomerMobile();
    addDraftToIndex(clean, "gst-certificate");
    AsyncStorage.setItem(`@taxedge_draft_${clean}_gst-certificate`, JSON.stringify({
      serviceKey: "gst-certificate",
      serviceName: "GST Certificate",
      category: "GST",
      step: draft.step ?? 0,
      formData: draft.formData || draft,
      documents: draft.documents || [],
      updatedAt: draft.updatedAt || new Date().toISOString().split("T")[0],
    })).catch(() => {});
  },
  clearGstCertificateDraft: () => {
    set({ gstCertificateDraft: null });
    const clean = getActiveCustomerMobile();
    removeDraftFromIndex(clean, "gst-certificate");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_gst-certificate`).catch(() => {});
  },
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
    const assignedExecutive = "";

    const newApp: Application = {
      id: appId,
      serviceId,
      serviceName,
      category,
      status: "Submitted",
      progress: 20,
      assignedExecutive,
      paymentAmount,
      paymentStatus:
        initialPaymentStatus || (paymentAmount > 0 ? "Pending" : "Paid"),
      createdAt: new Date().toISOString().split("T")[0],
      formData,
      documents: requiredDocs.map((doc) =>
        typeof doc === "string"
          ? { name: doc, status: "Pending" }
          : {
              name: doc.name,
              status: doc.status || "Pending",
              fileUri: doc.fileUri,
            },
      ),
      timeline:
        serviceId === "gst-filing"
          ? [
              {
                title: "Customer Request",
                description: "Filing request initiated",
                status: "completed",
                date: "Today",
              },
              {
                title: "Document Upload",
                description: "Sales & purchase records submitted",
                status: "completed",
                date: "Today",
              },
              {
                title: "Staff Verification",
                description: "CA reviewing invoices & reconciliation",
                status: "current",
                date: "Today",
              },
              {
                title: "Data Preparation",
                description: "Accounting integration & ledger extraction",
                status: "pending",
              },
              {
                title: "Return Preparation",
                description: "Tax computation & ITC calculation",
                status: "pending",
              },
              {
                title: "Customer Review",
                description: "Return draft shared with customer",
                status: "pending",
              },
              {
                title: "Customer Approval",
                description: "Sign-off received from business",
                status: "pending",
              },
              {
                title: "GST Filing",
                description: "Submission to GST portal",
                status: "pending",
              },
              {
                title: "Acknowledgement Receipt",
                description: "ARN generated & filed copy delivered",
                status: "pending",
              },
              {
                title: "Completed",
                description: "Filing process closed",
                status: "pending",
              },
            ]
          : serviceId === "itr-filing"
            ? [
                {
                  title: "Application Submitted",
                  description: "Return information & documents received",
                  status: "completed",
                  date: "Today",
                },
                {
                  title: "Staff Verification",
                  description:
                    "Tax Executive verifying documents & Form 26AS/AIS",
                  status: "current",
                  date: "Today",
                },
                {
                  title: "ITR Preparation & Tax Calculation",
                  description: "Tax computation & dual-regime optimization",
                  status: "pending",
                },
                {
                  title: "Internal Tax Review",
                  description: "Senior CA verification & quality audit",
                  status: "pending",
                },
                {
                  title: "Customer Review & Approval",
                  description: "Customer signs off on final computation",
                  status: "pending",
                },
                {
                  title: "ITR Submission",
                  description: "Filing return with Income Tax e-Filing portal",
                  status: "pending",
                },
                {
                  title: "E-Verification",
                  description: "Aadhaar OTP / EVC verification pending",
                  status: "pending",
                },
                {
                  title: "Income Tax Department Processing",
                  description:
                    "Central Processing Center (CPC) return processing & refund/tax closure",
                  status: "pending",
                },
              ]
            : serviceId === "tds-refund"
              ? [
                  {
                    title: "New Request Received",
                    description: "TDS refund claim initiated",
                    status: "completed",
                    date: "Today",
                  },
                  {
                    title: "Documents Received",
                    description: "All documents uploaded",
                    status: "completed",
                    date: "Today",
                  },
                  {
                    title: "Under Verification",
                    description: "Documents being verified by CA",
                    status: "current",
                    date: "Today",
                  },
                  {
                    title: "ITR Preparation",
                    description: "Return computation by CA",
                    status: "pending",
                  },
                  {
                    title: "Customer Approval",
                    description: "Review and approve the return",
                    status: "pending",
                  },
                  {
                    title: "ITR Filed",
                    description: "Submitted on IT Department portal",
                    status: "pending",
                  },
                  {
                    title: "E-Verification Pending",
                    description: "Verify using Aadhaar OTP / DSC",
                    status: "pending",
                  },
                  {
                    title: "Processing by IT Dept.",
                    description: "Department processing",
                    status: "pending",
                  },
                  {
                    title: "Refund / Tax Payable",
                    description: "Final status communicated",
                    status: "pending",
                  },
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
      chatHistory: [],
    };

    set((state) => {
      const remainingApps = state.applications.filter(
        (a) => !(a.status === "Draft" && a.serviceId === serviceId) && a.id !== appId,
      );
      const nextApps = [newApp, ...remainingApps];
      savePersistedApplications(getActiveCustomerMobile(), nextApps);
      return { applications: nextApps };
    });

    const cleanMobile = getActiveCustomerMobile();
    if (cleanMobile) {
      AsyncStorage.removeItem(`@taxedge_draft_${cleanMobile}_${serviceId}`).catch(() => {});
      removeDraftFromIndex(cleanMobile, serviceId).catch(() => {});
    }

    // Asynchronously persist to backend database
    applicationService.createApplication(newApp).catch((err) => {
      console.warn("Backend application persistence error:", err);
    });

    if (!skipNotification) {
      notificationService.notifyApplicationSubmitted(serviceName, appId);
    }

    return appId;
  },
  uploadDocument: (appId, docName, fileUri) =>
    set((state) => {
      const updatedApplications = state.applications.map((app) => {
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
        const updated = {
          ...app,
          documents: newDocs,
          progress,
          status:
            uploadedCount === totalDocs
              ? "Verification"
              : "Document Collection",
        };
        applicationService.updateApplication(updated).catch(() => {});
        return updated;
      });
      savePersistedApplications(getActiveCustomerMobile(), updatedApplications);
      return { applications: updatedApplications };
    }),
  addChatMessage: (appId, sender, text) => {
    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newMessage: ChatMessage = {
      id: messageId,
      sender,
      text,
      timestamp: timeStamp(),
    };

    set((state) => {
      const updatedApps = state.applications.map((app) => {
        if (app.id !== appId) return app;
        const updated = {
          ...app,
          chatHistory: [...(app.chatHistory || []), newMessage],
        };
        applicationService.updateApplication(updated).catch(() => {});
        return updated;
      });
      savePersistedApplications(getActiveCustomerMobile(), updatedApps);
      return { applications: updatedApps };
    });
  },
  payApplication: (appId) => {
    let paidAmount = 0;
    let paidServiceName = "";

    set((state) => {
      const updatedApps = state.applications.map((app) => {
        if (app.id !== appId) return app;
        paidAmount = app.paymentAmount;
        paidServiceName = app.serviceName;
        const newTimeline = app.timeline.map((step) =>
          step.title === "Verification"
            ? { ...step, status: "completed" as const }
            : step,
        );

        const updated = {
          ...app,
          paymentStatus: "Paid" as const,
          progress: Math.min(100, app.progress + 15),
          timeline: newTimeline,
        };
        applicationService.updateApplication(updated).catch(() => {});
        return updated;
      });
      savePersistedApplications(getActiveCustomerMobile(), updatedApps);
      return { applications: updatedApps };
    });

    if (paidAmount > 0 || paidServiceName) {
      notificationService.notifyPaymentSuccessful(paidAmount, paidServiceName);
    }
  },
  deleteApplication: (appId) => {
    if (appId.startsWith("DRAFT-")) {
      const cleanMobile = getActiveCustomerMobile();
      const serviceKey = appId.replace("DRAFT-", "").toLowerCase();
      removeDraftFromIndex(cleanMobile, serviceKey).catch(() => {});
      AsyncStorage.removeItem(`@taxedge_draft_${cleanMobile}_${serviceKey}`).catch(() => {});
    }
    set((state) => {
      const targetApp = state.applications.find((a) => a.id === appId);
      if (targetApp && (targetApp.status === "Draft" || targetApp.id.startsWith("DRAFT-"))) {
        const cleanMobile = getActiveCustomerMobile();
        const serviceKey = targetApp.serviceId || appId.replace("DRAFT-", "").toLowerCase();
        removeDraftFromIndex(cleanMobile, serviceKey).catch(() => {});
        AsyncStorage.removeItem(`@taxedge_draft_${cleanMobile}_${serviceKey}`).catch(() => {});
      }
      const remainingApps = state.applications.filter((a) => a.id !== appId);
      savePersistedApplications(getActiveCustomerMobile(), remainingApps);
      return {
        applications: remainingApps,
        selectedApplicationId:
          state.selectedApplicationId === appId
            ? null
            : state.selectedApplicationId,
      };
    });
  },
}));
