import { localStorage } from "../../../../core/storage/localStorage";
import { TdsCustomerIncomeFormData } from "../types/customerIncome.types";
import { TdsChecklistItem } from "../types/checklist.types";

const STORAGE_KEY_FORM = "taxedge_tds_refund_form_draft";
const STORAGE_KEY_DOCS = "taxedge_tds_refund_docs_draft";
const STORAGE_KEY_APP_ID = "taxedge_tds_refund_app_id";

export const INITIAL_TDS_FORM_DATA: TdsCustomerIncomeFormData = {
  personal: {
    fullName: "",
    pan: "",
    aadhaar: "",
    dob: "",
    mobileNumber: "",
    email: "",
    residentialAddress: "",
    city: "",
    state: "",
    pinCode: "",
  },
  bank: {
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "savings",
    isIfscVerified: false,
  },
  income: {
    assessmentYear: "2025-26",
    financialYear: "2024-25",
    taxRegime: "NEW",
    salaryIncome: "",
    otherIncome: "",
    interestIncome: "",
    hasRentalIncome: false,
    rentalIncome: "",
    municipalTaxesPaid: "",
    hasCapitalGains: false,
    shortTermCapitalGains: "",
    longTermCapitalGains: "",
    hasBusinessIncome: false,
    grossTurnover: "",
    netBusinessProfit: "",
    hasHomeLoan: false,
    homeLoanInterestSec24b: "",
    hasDeductions: false,
    deductions80C: "",
    deductions80D: "",
    donations80G: "",
    otherDeductions: "",
    hasPreviousLoss: false,
    carryForwardLossAmount: "",
    totalTdsDeducted: "",
    tcsAmount: "",
    advanceTaxPaid: "",
    selfAssessmentTaxPaid: "",
  },
};

export const tdsDraftService = {
  saveFormDraft: async (formData: TdsCustomerIncomeFormData): Promise<void> => {
    try {
      await localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
    } catch (err) {
      console.error("Failed to save TDS form draft:", err);
    }
  },

  getFormDraft: async (): Promise<TdsCustomerIncomeFormData> => {
    try {
      const raw = await localStorage.getItem(STORAGE_KEY_FORM);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          personal: { ...INITIAL_TDS_FORM_DATA.personal, ...(parsed.personal || {}) },
          bank: { ...INITIAL_TDS_FORM_DATA.bank, ...(parsed.bank || {}) },
          income: { ...INITIAL_TDS_FORM_DATA.income, ...(parsed.income || {}) },
        };
      }
    } catch (err) {
      console.error("Failed to read TDS form draft:", err);
    }
    return INITIAL_TDS_FORM_DATA;
  },

  saveDocumentsDraft: async (documents: TdsChecklistItem[]): Promise<void> => {
    try {
      await localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(documents));
    } catch (err) {
      console.error("Failed to save TDS documents draft:", err);
    }
  },

  getDocumentsDraft: async (): Promise<TdsChecklistItem[] | null> => {
    try {
      const raw = await localStorage.getItem(STORAGE_KEY_DOCS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("Failed to read TDS documents draft:", err);
    }
    return null;
  },

  saveApplicationId: async (appId: string): Promise<void> => {
    try {
      await localStorage.setItem(STORAGE_KEY_APP_ID, appId);
    } catch (err) {
      console.error("Failed to save application ID:", err);
    }
  },

  getApplicationId: async (): Promise<string | null> => {
    try {
      return await localStorage.getItem(STORAGE_KEY_APP_ID);
    } catch {
      return null;
    }
  },

  clearDraft: async (): Promise<void> => {
    try {
      await localStorage.removeItem(STORAGE_KEY_FORM);
      await localStorage.removeItem(STORAGE_KEY_DOCS);
    } catch {}
  },
};

export default tdsDraftService;
