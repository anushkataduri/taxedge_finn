import { TdsTimelineStepItem, TdsApplicationSummary } from "../types/tdsStatus.types";

/**
 * Exact 9-step timeline matching user application tracker screenshot
 */
export const DEFAULT_TDS_TIMELINE_STEPS: TdsTimelineStepItem[] = [
  {
    id: "step-1",
    stepNumber: 1,
    title: "New Request Received",
    subtitle: "10 Aug 2026, 2:15 PM",
    status: "completed",
    timestamp: "10 Aug 2026, 2:15 PM",
  },
  {
    id: "step-2",
    stepNumber: 2,
    title: "Documents Received",
    subtitle: "All documents uploaded",
    status: "completed",
  },
  {
    id: "step-3",
    stepNumber: 3,
    title: "Under Verification",
    subtitle: "Documents being verified by CA",
    status: "active",
  },
  {
    id: "step-4",
    stepNumber: 4,
    title: "ITR Preparation",
    subtitle: "Return computation by CA",
    status: "pending",
  },
  {
    id: "step-5",
    stepNumber: 5,
    title: "Customer Approval",
    subtitle: "Review and approve the return",
    status: "pending",
  },
  {
    id: "step-6",
    stepNumber: 6,
    title: "ITR Filed",
    subtitle: "Submitted on IT Department portal",
    status: "pending",
  },
  {
    id: "step-7",
    stepNumber: 7,
    title: "E-Verification Pending",
    subtitle: "Verify using Aadhaar OTP / DSC",
    status: "pending",
  },
  {
    id: "step-8",
    stepNumber: 8,
    title: "Processing by IT Dept.",
    subtitle: "Department processing",
    status: "pending",
  },
  {
    id: "step-9",
    stepNumber: 9,
    title: "Refund / Tax Payable",
    subtitle: "Final status communicated",
    status: "pending",
  },
];

/**
 * Default Application Summary matching user screenshot
 */
export const DEFAULT_APPLICATION_SUMMARY: TdsApplicationSummary = {
  applicationId: "ITR-2026-00001",
  statusBadge: {
    label: "Processing",
    textColor: "#7C3AED",
    bgColor: "#EDE9FE",
    dotColor: "#7C3AED",
  },
  service: "ITR Filing",
  assessmentYear: "2025-26",
  appliedDate: "10 Aug 2026",
  progressPercent: 30,
};

/**
 * Helper to build dynamic application summary functionally (zero loops)
 */
export const createApplicationSummary = (
  params?: {
    applicationId?: string;
    serviceName?: string;
    assessmentYear?: string;
    appliedDate?: string;
  },
  draftData?: Record<string, any>
): TdsApplicationSummary => {
  const formattedToday = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return {
    applicationId:
      params?.applicationId ||
      draftData?.applicationId ||
      DEFAULT_APPLICATION_SUMMARY.applicationId,
    statusBadge: DEFAULT_APPLICATION_SUMMARY.statusBadge,
    service:
      params?.serviceName ||
      (draftData?.serviceName ? String(draftData.serviceName) : "ITR Filing"),
    assessmentYear:
      params?.assessmentYear ||
      draftData?.assessmentYear ||
      DEFAULT_APPLICATION_SUMMARY.assessmentYear,
    appliedDate:
      params?.appliedDate ||
      DEFAULT_APPLICATION_SUMMARY.appliedDate ||
      formattedToday,
    progressPercent: 30,
  };
};
