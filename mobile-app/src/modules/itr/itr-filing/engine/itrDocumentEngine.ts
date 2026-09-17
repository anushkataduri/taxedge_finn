import {
  IncomeSourcesState,
  ItrPriorFilingAndNotice,
  ItrStructuredDeductions,
  TaxesPaidDetails,
  TaxRegimeType,
  ItrDocumentItem,
  DocumentRequirementTier,
  ItrPersonalInfo,
} from "../types/itrFiling.types";

export function generateDynamicDocumentChecklist(
  sources: IncomeSourcesState,
  priorNotice: ItrPriorFilingAndNotice,
  deductions: ItrStructuredDeductions,
  taxesPaid: TaxesPaidDetails,
  regime: TaxRegimeType,
  personalInfo?: ItrPersonalInfo,
  existingDocs: ItrDocumentItem[] = []
): ItrDocumentItem[] {
  const existingMap = new Map(existingDocs.map((d) => [d.id, d]));

  const makeDoc = (
    id: string,
    name: string,
    subtitle: string,
    tier: DocumentRequirementTier,
    docGroup: "common" | "income" | "conditional",
    iconName: string = "document-text-outline",
    isProfileVerified: boolean = false,
    profileVerifiedLabel?: string
  ): ItrDocumentItem => {
    const existing = existingMap.get(id);
    return {
      id,
      name,
      subtitle,
      tier,
      required: tier === "REQUIRED",
      docGroup,
      iconName,
      fileUri: existing?.fileUri,
      fileName: existing?.fileName,
      fileSize: existing?.fileSize,
      mimeType: existing?.mimeType,
      uploadedAt: existing?.uploadedAt,
      isProfileVerified,
      profileVerifiedLabel,
    };
  };

  const hasSalary = sources.salary.enabled;
  const hasBusiness = sources.business.enabled;
  const hasCapitalGains = sources.capitalGains.enabled;
  const isOldRegime = regime === "old";
  const has80D = isOldRegime && (Number(deductions.sec80d.selfSpouseChildren || 0) > 0 || Number(deductions.sec80d.parents || 0) > 0);
  const hasHomeLoan = Number(deductions.sec24b || 0) > 0 || (sources.houseProperty.enabled && Number(sources.houseProperty.homeLoanInterest || 0) > 0);
  const hasTaxPaid = Number(taxesPaid.advanceTax || 0) > 0 || Number(taxesPaid.selfAssessmentTax || 0) > 0;

  const panVerified = personalInfo?.isAutoVerified || Boolean(personalInfo?.pan);
  const panLabel = personalInfo?.pan ? `PAN Verified (${personalInfo.pan}) — No upload required` : "Verified from profile — No upload required";

  const aadhaarVerified = Boolean(personalInfo?.aadhaar);
  const maskedAadhaar = personalInfo?.aadhaar ? `•••• •••• ${personalInfo.aadhaar.slice(-4)}` : "•••• •••• 1098";
  const aadhaarLabel = `Aadhaar Verified (${maskedAadhaar}) — No upload required`;

  const allCandidates: ItrDocumentItem[] = [
    // --- 1. Common Documents ---
    makeDoc(
      "doc-bank",
      "Bank Account Statement",
      "Past 12 months for primary savings or current account",
      "RECOMMENDED",
      "common",
      "wallet-outline"
    ),
    makeDoc(
      "doc-ais-tis",
      "AIS / TIS Statement",
      "Annual Information Statement for TDS, dividends and SFT",
      "RECOMMENDED",
      "common",
      "document-attach-outline"
    ),
    makeDoc(
      "doc-26as",
      "Form 26AS Tax Credit Statement",
      "Used by CA to reconcile all tax deductions and TDS credits",
      "RECOMMENDED",
      "common",
      "receipt-outline"
    ),

    // --- 2. Income Specific Documents ---
    makeDoc(
      "doc-form-16",
      "Form 16 (Part A & B)",
      hasSalary
        ? "Issued by your employer showing salary breakup & TDS"
        : "Not required (no salary income declared)",
      hasSalary ? "REQUIRED" : "NOT_REQUIRED",
      "income",
      "briefcase-outline"
    ),
    makeDoc(
      "doc-salary-slips",
      "Salary Payslips",
      hasSalary
        ? "Latest 3 months salary slips for allowance verification"
        : "Not required (no salary income declared)",
      hasSalary ? "RECOMMENDED" : "NOT_REQUIRED",
      "income",
      "newspaper-outline"
    ),
    makeDoc(
      "doc-capital-gains",
      "Capital Gains Statement / P&L",
      hasCapitalGains
        ? "Consolidated statement from Zerodha, Groww, CAMS, or Karvy"
        : "Not required (no capital gains declared)",
      hasCapitalGains ? "REQUIRED" : "NOT_REQUIRED",
      "income",
      "trending-up-outline"
    ),
    makeDoc(
      "doc-business-turnover",
      "Business Turnover & GST Filings",
      hasBusiness
        ? "GSTR-1, GSTR-3B filings or annual sales register"
        : "Not required (no business income declared)",
      hasBusiness ? "REQUIRED" : "NOT_REQUIRED",
      "income",
      "storefront-outline"
    ),

    // --- 3. Conditional / Deduction Documents ---
    makeDoc(
      "doc-80d",
      "Health Insurance Premium Receipt (80D)",
      has80D
        ? "Required to support Section 80D medical insurance claim"
        : "Not required (no 80D deduction claimed)",
      has80D ? "REQUIRED" : "NOT_REQUIRED",
      "conditional",
      "medical-outline"
    ),
    makeDoc(
      "doc-home-loan",
      "Home Loan Interest Certificate (Sec 24b)",
      hasHomeLoan
        ? "Annual interest certificate issued by your lending bank"
        : "Not required (no home loan deduction claimed)",
      hasHomeLoan ? "REQUIRED" : "NOT_REQUIRED",
      "conditional",
      "home-outline"
    ),
    makeDoc(
      "doc-prev-itr",
      "Previous Year ITR-V Acknowledgment",
      priorNotice.hasPreviousItr
        ? "Used to verify carried-forward losses and filing history"
        : "Not required (first-time filer)",
      priorNotice.hasPreviousItr ? "RECOMMENDED" : "NOT_REQUIRED",
      "conditional",
      "time-outline"
    ),
    makeDoc(
      "doc-tax-notice",
      "Income Tax Notice Copy",
      priorNotice.hasTaxNotice
        ? "Copy of departmental notice received u/s 143(1), 139(9), or 148"
        : "Not required (no notice received)",
      priorNotice.hasTaxNotice ? "REQUIRED" : "NOT_REQUIRED",
      "conditional",
      "alert-circle-outline"
    ),
    makeDoc(
      "doc-challan",
      "Advance / Self-Assessment Tax Challan",
      hasTaxPaid
        ? "Challan receipt (ITNS 280 / BSR code copy) for taxes paid"
        : "Not required (no manual tax payment declared)",
      hasTaxPaid ? "REQUIRED" : "NOT_REQUIRED",
      "conditional",
      "card-outline"
    ),
  ];

  return allCandidates.filter((doc) => doc.tier !== "NOT_REQUIRED");
}
