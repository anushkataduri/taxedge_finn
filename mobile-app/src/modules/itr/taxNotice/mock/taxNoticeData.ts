import {
  TaxNoticeSummaryData,
  TaxNoticeSupportingDoc,
  NoticeTrackingStep,
  NoticeStatusDetails,
} from "../types/taxNotice.types";

export const MOCK_NOTICE_SUMMARY: TaxNoticeSummaryData = {
  noticeType: "Proposed Adjustment",
  section: "143(1)(a)",
  issuedDate: "18 Aug 2026",
  responseDueDate: "17 Sep 2026",
  daysLeft: 15,
  riskLevel: "Low",
  whatItMeans:
    "The department's records show ₹42,000 of interest income that does not appear on your return. They are proposing to add it to your taxable income and have given you an opportunity to respond.",
  actionRequired:
    "You need to confirm whether the income was already reported, agree with the adjustment, or provide an explanation with supporting documents.",
};

export const MOCK_SUPPORTING_DOCS: TaxNoticeSupportingDoc[] = [
  {
    id: "doc-ais",
    title: "AIS for AY 2025–26",
    subtitle: "PDF, JPG or PNG • Up to 10 MB",
    isMandatory: true,
    status: "not_uploaded",
  },
  {
    id: "doc-26as",
    title: "Form 26AS",
    subtitle: "PDF, JPG or PNG • Up to 10 MB",
    isMandatory: true,
    status: "not_uploaded",
  },
  {
    id: "doc-bank",
    title: "Bank Statement",
    subtitle: "PDF, JPG or PNG • Up to 10 MB",
    isMandatory: true,
    status: "not_uploaded",
  },
  {
    id: "doc-interest",
    title: "Interest Certificate",
    subtitle: "PDF, JPG or PNG • Up to 10 MB",
    isMandatory: true,
    status: "not_uploaded",
  },
  {
    id: "doc-proof",
    title: "Supporting Proof",
    subtitle: "PDF, JPG or PNG • Up to 10 MB",
    isMandatory: true,
    status: "not_uploaded",
  },
  {
    id: "doc-additional",
    title: "Additional Document\n(Optional)",
    subtitle: "PDF, JPG or PNG • Up to 10 MB",
    isMandatory: false,
    status: "not_uploaded",
  },
];

export const generateNoticeDraftResponse = (params: {
  name?: string;
  pan?: string;
  noticeNumber?: string;
  noticeDate?: string;
  assessmentYear?: string;
  section?: string;
}): string => {
  const assesseeName = params.name?.trim() || "Assessee";
  const panStr = params.pan?.trim() ? ` (PAN ${params.pan.trim()})` : "";
  const nNumber = params.noticeNumber?.trim() || "CPC/ITD/NOTICE";
  const nDate = params.noticeDate?.trim() || "the notice";
  const ay = params.assessmentYear?.trim() || "AY 2025–26";
  const sec = params.section?.trim() || "143(1)(a)";

  return `Respected Sir/Madam,

With reference to the notice under section ${sec} bearing reference number ${nNumber} dated ${nDate}, we respectfully submit this response on behalf of ${assesseeName}${panStr} for Assessment Year ${ay}.

The assessee has reviewed the particulars stated in the notice. The reconciliation of income and taxes paid has been verified with Form 26AS, AIS, and underlying financial statements. 

Supporting documents and explanations are attached herewith for your kind perusal. We request that the assessment/intimation be finalized taking these records into account.

Yours faithfully,
For TaxEdge Fin Solutions
Tax Compliance Division`;
};

export const MOCK_DRAFT_RESPONSE_TEXT = generateNoticeDraftResponse({});

export const MOCK_TRACKING_STEPS: NoticeTrackingStep[] = [
  {
    id: "step-1",
    title: "Received",
    date: "Notice Uploaded",
    description: "Notice received and indexed in system",
    status: "completed",
  },
  {
    id: "step-2",
    title: "Under Review",
    date: "Active",
    description: "Tax Executive reviewing notice and supporting documents",
    status: "completed",
  },
  {
    id: "step-3",
    title: "Response Submitted",
    date: "Submitted",
    description: "Response submitted to Income Tax Department",
    status: "completed",
  },
  {
    id: "step-4",
    title: "Resolved",
    date: "Pending",
    description: "Awaiting IT Department acknowledgment and closure",
    status: "pending",
  },
];

export const MOCK_NOTICE_STATUS_DETAILS: NoticeStatusDetails = {
  noticeNumber: "",
  section: "143(1)(a)",
  submittedOn: "Today",
  acknowledgementNo: "",
  assignedTaxExecutive: "Tax Executive",
  currentStatus: "Response Submitted",
};
