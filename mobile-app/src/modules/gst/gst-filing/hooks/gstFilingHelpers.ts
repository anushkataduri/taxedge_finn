/**
 * Pure utility functions and data mappers for GST Filing.
 * Implements defensive parsing, strict TypeScript types, and safe fallbacks.
 */

import { tokenManager, JwtUtils } from "@/core/authentication/tokenManager";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { FilingDocItem } from "@/modules/gst/gst-filing/config/gstFilingDocumentsConfig";
import { GstFilingPeriodData } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingPeriodStep";

export interface GstFilingBackendDto {
  gstfilingId?: string;
  id?: string;
  gstin?: string;
  customerId?: string;
  financialYear?: string;
  filingPeriod?: string;
  filingFrequency?: "MONTHLY" | "QUARTERLY" | "ANNUAL_FINANCIAL_YEAR" | string;
  returnType?: "GSTR_1" | "GSTR_3B" | string;
  filingType?: "REGULAR" | "NIL_RETURN" | string;
  taxCalculationMethod?: "ESTIMATION_FIGURES" | "TAXEDGE_CA_CALCULATION" | string;
  estimatedTaxableSales?: number | null;
  estimatedTaxablePurchases?: number | null;
  estimatedEligibleItc?: number | null;
  salesInvoice?: string;
  creditNotes?: string;
  debitNotes?: string;
  eInvoiceData?: string;
  eWayBillData?: string;
  purchaseInvoices?: string;
  gstr2bItcStatement?: string;
  expenseInvoicesAndVouchers?: string;
  bankStatement?: string;
  previousGstReturns?: string;
  previousFilingAcknowledgement?: string;
  otherSupportingDocuments?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface GstFilingPayload {
  gstin: string;
  customerId: string;
  financialYear: string;
  filingPeriod: string;
  filingFrequency: "MONTHLY" | "QUARTERLY" | "ANNUAL_FINANCIAL_YEAR";
  returnType: "GSTR_1" | "GSTR_3B";
  filingType: "NIL_RETURN" | "REGULAR";
  taxCalculationMethod: "ESTIMATION_FIGURES" | "TAXEDGE_CA_CALCULATION";
  estimatedTaxableSales: number | null;
  estimatedTaxablePurchases: number | null;
  estimatedEligibleItc: number | null;
}

/**
 * Safely resolves customer ID from JWT token or cached auth sessions.
 */
export async function getResolvedCustomerId(): Promise<string> {
  // 1. Try store first (fast and accurately hydrated with customerId / custId)
  try {
    const authState = useAuthStore.getState();
    const custId =
      authState.customer?.customerId ||
      authState.authenticatedUser?.customerId ||
      (authState.authenticatedUser as unknown as Record<string, unknown>)?.custId ||
      (authState.customer as unknown as Record<string, unknown>)?.custId ||
      "";
    if (custId && String(custId).trim() && String(custId).trim() !== "undefined") {
      return String(custId).trim();
    }
  } catch (err) {
    console.debug("[Auth] Failed to resolve customerId from store:", err);
  }

  // 2. Try auth storage
  try {
    const u = authStorage.getUser();
    const s = authStorage.getSession();
    const custId =
      u?.customerId ||
      (u as unknown as Record<string, unknown>)?.custId ||
      (s as unknown as Record<string, unknown>)?.activeCustId ||
      "";
    if (custId && String(custId).trim() && String(custId).trim() !== "undefined") {
      return String(custId).trim();
    }
  } catch (err) {
    console.debug("[Auth] Failed to resolve customerId from storage:", err);
  }

  // 3. Try JWT token
  try {
    const token = await tokenManager.getAccessToken();
    if (token) {
      const payload = JwtUtils.decodePayload(token);
      if (payload?.sub && typeof payload.sub === "string" && payload.sub.trim() && payload.sub.trim() !== "undefined") {
        return payload.sub.trim();
      }
    }
  } catch (err) {
    console.debug("[Auth] Failed to resolve sub from token:", err);
  }

  return "";
}

/**
 * Parses numeric inputs with comma/currency stripping and zero-fallback.
 */
export function parseFilingNumber(val: unknown): number {
  if (typeof val === "number") return isNaN(val) ? 0 : Math.round(val);
  if (typeof val === "string") {
    const cleaned = val.replace(/[^\d.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.round(parsed);
  }
  return 0;
}

/**
 * Constructs the typed REST payload for GST filing creation and updates.
 */
export function buildFilingPayload(
  periodData: Partial<GstFilingPeriodData>,
  customerId?: string,
  isManualEstimatesOnly = false,
): GstFilingPayload {
  const rawFreq = (periodData.periodType || "Quarterly").toUpperCase().replace(/\s+/g, "_");
  let filingFrequency: "MONTHLY" | "QUARTERLY" | "ANNUAL_FINANCIAL_YEAR" = "QUARTERLY";
  if (rawFreq.includes("ANNUAL")) filingFrequency = "ANNUAL_FINANCIAL_YEAR";
  else if (rawFreq.includes("MONTH")) filingFrequency = "MONTHLY";
  else filingFrequency = "QUARTERLY";

  const rawReturn = String(periodData.filingType || "GSTR-1").toUpperCase();
  const returnType: "GSTR_1" | "GSTR_3B" =
    rawReturn.includes("3B") || rawReturn.includes("3_B") ? "GSTR_3B" : "GSTR_1";

  const isNil = periodData.filingNature === "Nil Return";
  const isEstimates =
    isManualEstimatesOnly || periodData.calculationMethod === "manual_estimates";

  const financialYear = (periodData.financialYear || "2025-26").replace(/^FY\s*/i, "").trim();
  const filingPeriod = periodData.filingPeriod || periodData.filingMonth || "Q3 (Oct-Dec 2025)";

  let resolvedCustId = "";
  if (customerId && typeof customerId === "string" && customerId.trim() && customerId.trim() !== "undefined") {
    resolvedCustId = customerId.trim();
  } else if (
    (periodData as Record<string, unknown>)?.customerId &&
    String((periodData as Record<string, unknown>).customerId).trim() &&
    String((periodData as Record<string, unknown>).customerId).trim() !== "undefined"
  ) {
    resolvedCustId = String((periodData as Record<string, unknown>).customerId).trim();
  }

  return {
    gstin: periodData.gstin ? periodData.gstin.trim() : "",
    customerId: resolvedCustId,
    financialYear,
    filingPeriod,
    filingFrequency,
    returnType,
    filingType: isNil ? "NIL_RETURN" : "REGULAR",
    taxCalculationMethod: isEstimates
      ? "ESTIMATION_FIGURES"
      : "TAXEDGE_CA_CALCULATION",
    estimatedTaxableSales: isEstimates
      ? parseFilingNumber(periodData.taxableSales || periodData.turnover)
      : null,
    estimatedTaxablePurchases: isEstimates
      ? parseFilingNumber(periodData.taxablePurchases)
      : null,
    estimatedEligibleItc: isEstimates
      ? parseFilingNumber(periodData.eligibleItc)
      : null,
  };
}

/**
 * Maps backend filing DTO to frontend Period step state.
 */
export function mapDtoToPeriodData(
  dto?: Partial<GstFilingBackendDto> | null,
): Partial<GstFilingPeriodData> {
  if (!dto) return {};

  const freq =
    dto.filingFrequency === "MONTHLY"
      ? "Monthly"
      : dto.filingFrequency === "ANNUAL_FINANCIAL_YEAR"
        ? "Annual"
        : "Quarterly";

  const retType =
    dto.returnType === "GSTR_3B"
      ? "GSTR-3B (Monthly Summary Return)"
      : "GSTR-1 (Outward Supplies Return)";

  const filNature =
    dto.filingType === "NIL_RETURN" ? "Nil Return" : "Regular Return";

  const calcMethod =
    dto.taxCalculationMethod === "ESTIMATION_FIGURES"
      ? "manual_estimates"
      : "ca_assisted";

  const fy = dto.financialYear
    ? String(dto.financialYear).startsWith("FY")
      ? String(dto.financialYear)
      : `FY ${dto.financialYear}`
    : undefined;

  return {
    gstin: dto.gstin || undefined,
    financialYear: fy,
    filingPeriod: dto.filingPeriod || undefined,
    filingMonth: dto.filingPeriod || undefined,
    periodType: freq,
    filingType: retType,
    filingNature: filNature as "Regular Return" | "Nil Return",
    calculationMethod: calcMethod as "ca_assisted" | "manual_estimates",
    taxableSales:
      dto.estimatedTaxableSales !== null && dto.estimatedTaxableSales !== undefined
        ? String(dto.estimatedTaxableSales)
        : undefined,
    turnover:
      dto.estimatedTaxableSales !== null && dto.estimatedTaxableSales !== undefined
        ? String(dto.estimatedTaxableSales)
        : undefined,
    taxablePurchases:
      dto.estimatedTaxablePurchases !== null && dto.estimatedTaxablePurchases !== undefined
        ? String(dto.estimatedTaxablePurchases)
        : undefined,
    eligibleItc:
      dto.estimatedEligibleItc !== null && dto.estimatedEligibleItc !== undefined
        ? String(dto.estimatedEligibleItc)
        : undefined,
  };
}

/**
 * Maps backend document URLs back to the local document list state.
 */
export function mapDtoToFilingDocuments(
  dto: Record<string, string | undefined> | null | undefined,
  existingDocs: FilingDocItem[],
): FilingDocItem[] {
  if (!dto) return existingDocs;

  const fieldMap: Record<string, string | undefined> = {
    "sales-invoices": dto.salesInvoice,
    salesInvoice: dto.salesInvoice,
    "credit-notes": dto.creditNotes,
    creditNotes: dto.creditNotes,
    "debit-notes": dto.debitNotes,
    debitNotes: dto.debitNotes,
    "e-invoice": dto.eInvoiceData,
    eInvoiceData: dto.eInvoiceData,
    "e-way-bill": dto.eWayBillData,
    eWayBillData: dto.eWayBillData,
    "purchase-invoices": dto.purchaseInvoices,
    purchaseInvoices: dto.purchaseInvoices,
    "gstr-2b": dto.gstr2bItcStatement,
    gstr2bItcStatement: dto.gstr2bItcStatement,
    "expense-vouchers": dto.expenseInvoicesAndVouchers,
    expenseInvoicesAndVouchers: dto.expenseInvoicesAndVouchers,
    "bank-statement": dto.bankStatement,
    bankStatement: dto.bankStatement,
    "previous-returns": dto.previousGstReturns,
    previousGstReturns: dto.previousGstReturns,
    "filing-ack": dto.previousFilingAcknowledgement,
    previousFilingAcknowledgement: dto.previousFilingAcknowledgement,
    "other-docs": dto.otherSupportingDocuments,
    otherSupportingDocuments: dto.otherSupportingDocuments,
  };

  return existingDocs.map((doc) => {
    if (doc.fileUri && (doc as unknown as Record<string, unknown>).uploadedToBackend) {
      return doc;
    }
    const val = fieldMap[doc.id] || fieldMap[doc.name];
    if (val && typeof val === "string" && val.trim() !== "") {
      const fileName = val.includes("/") ? val.split("/").pop() || val : val;
      return {
        ...doc,
        fileUri: doc.fileUri || val,
        fileName: doc.fileName || fileName,
        uploadedAt: doc.uploadedAt || "Uploaded to Server",
      };
    }
    return doc;
  });
}

/**
 * Deduplicates and resolves target filing ID across routes, drafts, and store records.
 */
export function resolveTargetFilingId(
  candidates: (string | null | undefined)[],
  applications?: readonly { serviceId?: string; id?: string; formData?: Record<string, unknown> }[],
  currentGstin?: string,
): string {
  for (const c of candidates) {
    if (c && typeof c === "string" && c.trim() && c.trim() !== "undefined") {
      return c.trim();
    }
  }

  if (applications && applications.length > 0 && currentGstin && currentGstin.trim()) {
    const cleanGstin = currentGstin.trim().toUpperCase();
    const existingApp = applications.find(
      (a) =>
        a.serviceId === "gst-filing" &&
        ((a.formData?.gstin && String(a.formData.gstin).trim().toUpperCase() === cleanGstin) ||
         (a.formData?.businessGstin && String(a.formData.businessGstin).trim().toUpperCase() === cleanGstin)) &&
        (Boolean(a.formData?.filingId) || (Boolean(a.id) && String(a.id).startsWith("FIL"))),
    );
    if (existingApp) {
      const idFromForm = existingApp.formData?.filingId as string | undefined;
      if (idFromForm && idFromForm.trim() && idFromForm.trim() !== "undefined") return idFromForm.trim();
      if (existingApp.id && existingApp.id.startsWith("FIL")) return existingApp.id;
    }
  }

  return "";
}

/**
 * Synchronizes documents from previous application storage into current doc items.
 */
export function syncPreviousAppDocuments(
  docs: readonly FilingDocItem[],
  appDocs: readonly { name?: string; id?: string; status?: string; fileUri?: string }[],
): FilingDocItem[] {
  return docs.map((initDoc) => {
    const matched = appDocs.find(
      (d) =>
        d.name?.toLowerCase() === initDoc.name?.toLowerCase() ||
        d.id === initDoc.id,
    );
    if (matched && matched.status === "Uploaded") {
      return {
        ...initDoc,
        fileUri: matched.fileUri || `https://taxedge.in/docs/${initDoc.id}`,
        fileName: matched.name,
      };
    }
    return initDoc;
  });
}

/**
 * Extracts uploaded file names for application store submission.
 */
export function extractUploadedDocumentNames(docs: readonly FilingDocItem[]): string[] {
  return docs.filter((d) => Boolean(d.fileUri)).map((d) => d.name);
}
