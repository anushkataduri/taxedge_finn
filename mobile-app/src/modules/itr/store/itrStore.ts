import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/authStore";
import { useApplicationStore } from "@/store/applicationStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { addDraftToIndex, removeDraftFromIndex } from "@/shared/hooks/useServiceDraft";
import {
  ItrFilingFormData,
  ItrPersonalInfo,
  ItrBankDetails,
  ItrSelectableBank,
  ItrPriorFilingAndNotice,
  IncomeSalaryData,
  IncomeHousePropertyData,
  IncomeBusinessData,
  IncomeCapitalGainsData,
  IncomeOtherSourcesData,
  ItrStructuredDeductions,
  TaxesPaidDetails,
  TaxRegimeType,
  ItrDocumentItem,
  GstReconciliationSummary,
  ItrCategoryType,
  IncomeSourcesState,
} from "../itr-filing/types/itrFiling.types";
import { determineApplicableItrForm } from "../itr-filing/engine/itrFormEngine";
import { calculateItrTax } from "../itr-filing/engine/itrTaxCalculator";
import { generateDynamicDocumentChecklist } from "../itr-filing/engine/itrDocumentEngine";
import { getCurrentAssessmentYear } from "../taxRules";

export interface ItrDraftState {
  id: string;
  stepIndex: number;
  formData: ItrFilingFormData;
  updatedAt: string;
}

interface ITRState {
  currentStep: number;
  setStep: (step: number) => void;

  formData: ItrFilingFormData;

  // Specific Step updaters
  setCategory: (category: ItrCategoryType) => void;
  setPersonalInfo: (info: Partial<ItrPersonalInfo>) => void;
  selectRefundBank: (bankId: string) => void;
  addBankAccount: (bank: ItrSelectableBank) => void;
  setBankDetails: (details: Partial<ItrBankDetails>) => void;
  setPriorItrNotice: (data: Partial<ItrPriorFilingAndNotice>) => void;
  importPriorItrData: (selectedKeys: {
    income?: boolean;
    deductions?: boolean;
    losses?: boolean;
    bank?: boolean;
    filing?: boolean;
  }) => void;
  setIncomeSalary: (data: Partial<IncomeSalaryData>) => void;
  setIncomeHouseProperty: (data: Partial<IncomeHousePropertyData>) => void;
  setIncomeBusiness: (data: Partial<IncomeBusinessData>) => void;
  setIncomeCapitalGains: (data: Partial<IncomeCapitalGainsData>) => void;
  setIncomeOtherSources: (data: Partial<IncomeOtherSourcesData>) => void;
  setRegime: (regime: TaxRegimeType) => void;
  setDeductions: (deductions: Partial<ItrStructuredDeductions>) => void;
  setTaxesPaid: (taxes: Partial<TaxesPaidDetails>) => void;
  setDeclarationAccepted: (accepted: boolean) => void;
  updateDocument: (docId: string, fileInfo: any) => void;
  updateGstReconciliation: (data: Partial<GstReconciliationSummary>) => void;

  // Draft handling
  itrDraft: ItrDraftState | null;
  saveItrDraft: () => void;
  restoreItrDraft: () => Promise<boolean>;
  clearItrDraft: () => void;
  resetForm: () => void;
  fetchAndPopulateUserProfile: () => Promise<void>;
}

const getInitialFormData = (): ItrFilingFormData => {
  // 1. Pull user profile from authStore
  const authState = useAuthStore.getState();
  const customer = authState.customer;
  const user = authState.authenticatedUser;

  // 2. Pull GST draft data if available from applicationStore
  const gstDraft = useApplicationStore.getState().gstDraft;
  const gstBusiness = gstDraft?.businessData || {};

  const personalInfo: ItrPersonalInfo = {
    pan: customer?.pan || (user as any)?.pan || "",
    aadhaar: customer?.aadhaar || (user as any)?.aadhaar || "",
    name: customer?.name || user?.name || "",
    dob: customer?.dob || (user as any)?.dob || "",
    gender: customer?.gender || (user as any)?.gender || "Male",
    fatherSpouseName: customer?.fatherSpouseName || "",
    address: customer?.address || customer?.addressLine1 || (user as any)?.address || "",
    city: customer?.city || (user as any)?.city || "",
    state: customer?.state || (user as any)?.state || "",
    pincode: customer?.pincode || (user as any)?.pincode || "",
    mobile: customer?.mobile || user?.mobileNumber || "",
    email: customer?.email || user?.email || "",
    residentialStatus: "Resident",
    residentialStatusConfirmed: true,
    assessmentYear: getCurrentAssessmentYear(),
    filingType: "139_1_original",
    filingTypeSuggested: "139_1_original",
    isAutoVerified: Boolean(customer?.pan || (user as any)?.pan),
  };

  const initialBankAccounts: ItrSelectableBank[] = [];

  const bankDetails: ItrBankDetails = {
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    accountType: "Savings",
    isPrimaryRefund: false,
    validationStatus: "Pending",
  };

  const priorItrNotice: ItrPriorFilingAndNotice = {
    hasPreviousItr: false,
    previousAckNumber: "",
    previousAssessmentYear: "",
    previousItrForm: undefined,
    previousFiledDate: "",
    importedIncomeDetails: false,
    importedDeductions: false,
    importedLosses: false,
    importedBankDetails: false,
    importedFilingDetails: false,
    hasCarriedForwardLosses: false,
    carriedForwardLossesDetails: "",
    hasTaxNotice: false,
    noticeSection: "",
    noticeDetails: "",
  };

  const hasGst = Boolean(gstBusiness.gstin || gstBusiness.businessName);

  const gstReconciliation: GstReconciliationSummary = {
    gstin: gstBusiness.gstin || "",
    legalName: gstBusiness.businessName || "",
    tradeName: gstBusiness.tradeName || "",
    businessActivity: "",
    registrationDate: "",
    gstr1Turnover: Number(gstBusiness.annualTurnover || 0),
    gstr3bTurnover: Number(gstBusiness.annualTurnover || 0),
    booksTurnover: Number(gstBusiness.annualTurnover || 0),
    proposedItrTurnover: Number(gstBusiness.annualTurnover || 0),
    variance: 0,
    hasVariance: false,
    varianceExplanation: "",
  };

  const registeredAccountType = customer?.customerType || "Individual";
  const isCorporate =
    registeredAccountType === "Private Limited" ||
    registeredAccountType === "Public Limited" ||
    registeredAccountType === "LLP" ||
    registeredAccountType === "Partnership";
  let initialCategory: ItrCategoryType = (isCorporate ? "business" : "salaried") as ItrCategoryType;

  const incomeSources = {
    salary: {
      enabled: initialCategory === "salaried",
      employerName: "",
      grossSalary: "",
      allowances: "",
      tdsDeducted: "",
      source: "USER_DECLARED" as const,
      isVerified: false,
    },
    houseProperty: {
      enabled: initialCategory === "rental",
      propertyType: "self_occupied" as const,
      annualRentReceived: "",
      municipalTaxesPaid: "",
      homeLoanInterest: "",
      source: "USER_DECLARED" as const,
    },
    business: {
      enabled: initialCategory === "business" || initialCategory === "professional" || initialCategory === "freelancer",
      businessType: "presumptive_44ad" as const,
      businessName: gstBusiness.businessName || "",
      gstin: gstBusiness.gstin || "",
      businessActivity: "",
      grossTurnover: gstBusiness.annualTurnover ? String(gstBusiness.annualTurnover) : "",
      declaredProfit: "",
      source: hasGst ? ("GST_FILING" as const) : ("USER_DECLARED" as const),
      hasGstActivity: hasGst,
      gstr1Turnover: "",
      gstr3bTurnover: "",
      gstReconciliationRequired: false,
    },
    capitalGains: {
      enabled: initialCategory === "capital_gains" || initialCategory === "trader_investor",
      hasEquityMf: false,
      hasFnoIntraday: initialCategory === "trader_investor",
      hasPropertyAssets: false,
      hasCryptoVda: false,
      shortTermGains: "",
      longTermGains: "",
      brokerName: "",
      totalTransactions: 0,
      source: "USER_DECLARED" as const,
      statementUploaded: false,
    },
    otherSources: {
      enabled: false,
      savingsInterest: "",
      fdInterest: "",
      dividendIncome: "",
      familyPension: "",
      otherIncome: "",
      source: "USER_DECLARED" as const,
    },
  };

  const deductions: ItrStructuredDeductions = {
    sec80c: {
      epf: "",
      ppf: "",
      lic: "",
      elss: "",
      tuitionFees: "",
      housingPrincipal: "",
      other80c: "",
    },
    sec80d: {
      selfSpouseChildren: "",
      parents: "",
      isParentSeniorCitizen: false,
    },
    sec24b: "",
    sec80e: "",
    otherDeductionsList: [],
  };

  const taxesPaid: TaxesPaidDetails = {
    advanceTax: "",
    advanceTaxChallanBsr: "",
    advanceTaxDate: "",
    selfAssessmentTax: "",
  };

  const calculation = calculateItrTax(
    incomeSources,
    deductions,
    taxesPaid,
    "new",
    personalInfo.assessmentYear
  );

  const determinedForm = determineApplicableItrForm(
    incomeSources,
    personalInfo.residentialStatus,
    calculation.grossTotalIncome,
    personalInfo.assessmentYear
  );

  const documents = generateDynamicDocumentChecklist(
    incomeSources,
    priorItrNotice,
    deductions,
    taxesPaid,
    "new",
    personalInfo
  );

  return {
    personalInfo,
    bankDetails,
    bankAccountsList: initialBankAccounts,
    priorItrNotice,
    incomeSources,
    determinedForm,
    regime: "new",
    deductions,
    taxesPaid,
    documents,
    calculation,
    gstReconciliation,
    declarationAccepted: false,
    category: initialCategory,
    accountType: registeredAccountType,
  };
};

export const useITRStore = create<ITRState>((set, get) => ({
  currentStep: 0,
  setStep: (currentStep) => set({ currentStep }),

  formData: getInitialFormData(),

  setCategory: (category: ItrCategoryType) =>
    set((state) => {
      const prevSources = state.formData.incomeSources;
      let newSources: IncomeSourcesState = {
        salary: { ...prevSources.salary, enabled: false },
        houseProperty: { ...prevSources.houseProperty, enabled: false },
        business: { ...prevSources.business, enabled: false },
        capitalGains: { ...prevSources.capitalGains, enabled: false },
        otherSources: { ...prevSources.otherSources, enabled: false },
      };

      if (category === "salaried") {
        newSources.salary = {
          ...newSources.salary,
          enabled: true,
        };
      } else if (category === "business") {
        newSources.business = {
          ...newSources.business,
          enabled: true,
          businessType: "presumptive_44ad",
        };
      } else if (category === "professional") {
        newSources.business = {
          ...newSources.business,
          enabled: true,
          businessType: "presumptive_44ada",
        };
      } else if (category === "freelancer") {
        newSources.business = {
          ...newSources.business,
          enabled: true,
          businessType: "presumptive_44ada",
        };
      } else if (category === "trader_investor") {
        newSources.capitalGains = {
          ...newSources.capitalGains,
          enabled: true,
          hasFnoIntraday: true,
        };
      } else if (category === "rental") {
        newSources.houseProperty = {
          ...newSources.houseProperty,
          enabled: true,
          propertyType: "let_out",
        };
      } else if (category === "capital_gains") {
        newSources.capitalGains = {
          ...newSources.capitalGains,
          enabled: true,
        };
      } else if (category === "multiple") {
        newSources = {
          ...prevSources,
          salary: { ...prevSources.salary, enabled: true },
          business: { ...prevSources.business, enabled: true },
        };
      }

      const ay = state.formData.personalInfo.assessmentYear;
      const calculation = calculateItrTax(
        newSources,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );

      const determinedForm = determineApplicableItrForm(
        newSources,
        state.formData.personalInfo.residentialStatus,
        calculation.grossTotalIncome,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        newSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          category,
          incomeSources: newSources,
          calculation,
          determinedForm,
          documents,
        },
      };
    }),

  setPersonalInfo: (info) =>
    set((state) => {
      const personalInfo = { ...state.formData.personalInfo, ...info };
      const ay = personalInfo.assessmentYear;

      const calculation = calculateItrTax(
        state.formData.incomeSources,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );

      const determinedForm = determineApplicableItrForm(
        state.formData.incomeSources,
        personalInfo.residentialStatus,
        calculation.grossTotalIncome,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        state.formData.incomeSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          personalInfo,
          determinedForm,
          calculation,
          documents,
        },
      };
    }),

  selectRefundBank: (bankId) =>
    set((state) => {
      const updatedAccounts = state.formData.bankAccountsList.map((bank) => ({
        ...bank,
        isPrimaryRefund: bank.id === bankId,
      }));

      const selected = updatedAccounts.find((b) => b.id === bankId);
      if (!selected) return state;

      return {
        formData: {
          ...state.formData,
          bankAccountsList: updatedAccounts,
          bankDetails: {
            bankName: selected.bankName,
            accountNumber: selected.accountNumber,
            confirmAccountNumber: selected.accountNumber,
            ifscCode: selected.ifscCode,
            accountType: selected.accountType,
            isPrimaryRefund: true,
            validationStatus: selected.validationStatus,
          },
        },
      };
    }),

  addBankAccount: (newBank) =>
    set((state) => {
      const updatedList = [...state.formData.bankAccountsList, newBank];
      return {
        formData: {
          ...state.formData,
          bankAccountsList: updatedList,
        },
      };
    }),

  setBankDetails: (details) =>
    set((state) => ({
      formData: {
        ...state.formData,
        bankDetails: { ...state.formData.bankDetails, ...details },
      },
    })),

  setPriorItrNotice: (data) =>
    set((state) => {
      const priorItrNotice = { ...state.formData.priorItrNotice, ...data };
      const documents = generateDynamicDocumentChecklist(
        state.formData.incomeSources,
        priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );
      return {
        formData: {
          ...state.formData,
          priorItrNotice,
          documents,
        },
      };
    }),

  importPriorItrData: (selectedKeys) =>
    set((state) => {
      const prior = state.formData.priorItrNotice;
      return {
        formData: {
          ...state.formData,
          priorItrNotice: {
            ...prior,
            importedIncomeDetails: selectedKeys.income ?? prior.importedIncomeDetails,
            importedDeductions: selectedKeys.deductions ?? prior.importedDeductions,
            importedLosses: selectedKeys.losses ?? prior.importedLosses,
            importedBankDetails: selectedKeys.bank ?? prior.importedBankDetails,
            importedFilingDetails: selectedKeys.filing ?? prior.importedFilingDetails,
          },
        },
      };
    }),

  setIncomeSalary: (data) =>
    set((state) => {
      const salary = { ...state.formData.incomeSources.salary, ...data };
      const incomeSources = { ...state.formData.incomeSources, salary };
      const ay = state.formData.personalInfo.assessmentYear;

      const calculation = calculateItrTax(
        incomeSources,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );

      const determinedForm = determineApplicableItrForm(
        incomeSources,
        state.formData.personalInfo.residentialStatus,
        calculation.grossTotalIncome,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        incomeSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          incomeSources,
          calculation,
          determinedForm,
          documents,
        },
      };
    }),

  setIncomeHouseProperty: (data) =>
    set((state) => {
      const houseProperty = {
        ...state.formData.incomeSources.houseProperty,
        ...data,
      };
      const incomeSources = { ...state.formData.incomeSources, houseProperty };
      const ay = state.formData.personalInfo.assessmentYear;

      const calculation = calculateItrTax(
        incomeSources,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );

      const determinedForm = determineApplicableItrForm(
        incomeSources,
        state.formData.personalInfo.residentialStatus,
        calculation.grossTotalIncome,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        incomeSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          incomeSources,
          calculation,
          determinedForm,
          documents,
        },
      };
    }),

  setIncomeBusiness: (data) =>
    set((state) => {
      const business = { ...state.formData.incomeSources.business, ...data };
      const incomeSources = { ...state.formData.incomeSources, business };
      const ay = state.formData.personalInfo.assessmentYear;

      const calculation = calculateItrTax(
        incomeSources,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );

      const determinedForm = determineApplicableItrForm(
        incomeSources,
        state.formData.personalInfo.residentialStatus,
        calculation.grossTotalIncome,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        incomeSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          incomeSources,
          calculation,
          determinedForm,
          documents,
        },
      };
    }),

  setIncomeCapitalGains: (data) =>
    set((state) => {
      const capitalGains = {
        ...state.formData.incomeSources.capitalGains,
        ...data,
      };
      const incomeSources = { ...state.formData.incomeSources, capitalGains };
      const ay = state.formData.personalInfo.assessmentYear;

      const calculation = calculateItrTax(
        incomeSources,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );

      const determinedForm = determineApplicableItrForm(
        incomeSources,
        state.formData.personalInfo.residentialStatus,
        calculation.grossTotalIncome,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        incomeSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          incomeSources,
          calculation,
          determinedForm,
          documents,
        },
      };
    }),

  setIncomeOtherSources: (data) =>
    set((state) => {
      const otherSources = {
        ...state.formData.incomeSources.otherSources,
        ...data,
      };
      const incomeSources = { ...state.formData.incomeSources, otherSources };
      const ay = state.formData.personalInfo.assessmentYear;

      const calculation = calculateItrTax(
        incomeSources,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );

      const determinedForm = determineApplicableItrForm(
        incomeSources,
        state.formData.personalInfo.residentialStatus,
        calculation.grossTotalIncome,
        ay
      );

      return {
        formData: {
          ...state.formData,
          incomeSources,
          calculation,
          determinedForm,
        },
      };
    }),

  setRegime: (regime) =>
    set((state) => {
      const ay = state.formData.personalInfo.assessmentYear;
      const calculation = calculateItrTax(
        state.formData.incomeSources,
        state.formData.deductions,
        state.formData.taxesPaid,
        regime,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        state.formData.incomeSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        regime,
        state.formData.personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          regime,
          calculation,
          documents,
        },
      };
    }),

  setDeductions: (deductionsPartial) =>
    set((state) => {
      const deductions = {
        ...state.formData.deductions,
        ...deductionsPartial,
      };
      const ay = state.formData.personalInfo.assessmentYear;

      const calculation = calculateItrTax(
        state.formData.incomeSources,
        deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        state.formData.incomeSources,
        state.formData.priorItrNotice,
        deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          deductions,
          calculation,
          documents,
        },
      };
    }),

  setTaxesPaid: (taxesPartial) =>
    set((state) => {
      const taxesPaid = { ...state.formData.taxesPaid, ...taxesPartial };
      const ay = state.formData.personalInfo.assessmentYear;

      const calculation = calculateItrTax(
        state.formData.incomeSources,
        state.formData.deductions,
        taxesPaid,
        state.formData.regime,
        ay
      );

      const documents = generateDynamicDocumentChecklist(
        state.formData.incomeSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );

      return {
        formData: {
          ...state.formData,
          taxesPaid,
          calculation,
          documents,
        },
      };
    }),

  setDeclarationAccepted: (declarationAccepted) =>
    set((state) => ({
      formData: { ...state.formData, declarationAccepted },
    })),

  updateDocument: (docId, fileInfo) =>
    set((state) => {
      const updatedDocs = state.formData.documents.map((doc) => {
        if (doc.id !== docId) return doc;
        if (!fileInfo) {
          return {
            ...doc,
            fileUri: undefined,
            fileName: undefined,
            fileSize: undefined,
            mimeType: undefined,
            uploadedAt: undefined,
          };
        }
        return {
          ...doc,
          fileUri: fileInfo.uri,
          fileName: fileInfo.name,
          fileSize: fileInfo.size,
          mimeType: fileInfo.type,
          uploadedAt: new Date().toISOString(),
        };
      });

      return {
        formData: {
          ...state.formData,
          documents: updatedDocs,
        },
      };
    }),

  updateGstReconciliation: (gstData) =>
    set((state) => {
      const existing = state.formData.gstReconciliation;
      if (!existing) return state;
      return {
        formData: {
          ...state.formData,
          gstReconciliation: {
            ...existing,
            ...gstData,
          },
        },
      };
    }),

  itrDraft: null,

  saveItrDraft: () => {
    const { currentStep, formData } = get();
    const draft: ItrDraftState = {
      id: `itr-draft-${Date.now()}`,
      stepIndex: currentStep,
      formData,
      updatedAt: new Date().toISOString(),
    };
    set({ itrDraft: draft });

    const authState = useAuthStore.getState();
    const mobile =
      authState.customer?.mobile ||
      authState.authenticatedUser?.mobileNumber ||
      authState.mobileNumber ||
      "user";
    const clean = String(mobile).replace(/\D/g, "") || "user";
    addDraftToIndex(clean, "itr-filing");
    AsyncStorage.setItem(
      `@taxedge_draft_${clean}_itr-filing`,
      JSON.stringify({
        serviceKey: "itr-filing",
        serviceName: "ITR Filing",
        category: "ITR",
        step: currentStep,
        stepIndex: currentStep,
        formData,
        documents: formData.documents,
        updatedAt: draft.updatedAt,
      })
    ).catch(() => {});
  },

  restoreItrDraft: async () => {
    try {
      const authState = useAuthStore.getState();
      const mobile =
        authState.customer?.mobile ||
        authState.authenticatedUser?.mobileNumber ||
        authState.mobileNumber ||
        "user";
      const clean = String(mobile).replace(/\D/g, "") || "user";
      const raw = await AsyncStorage.getItem(`@taxedge_draft_${clean}_itr-filing`);

      let draftData: any = null;
      if (raw) {
        draftData = JSON.parse(raw);
      } else {
        draftData = get().itrDraft;
      }

      if (!draftData) return false;

      const restoredStep =
        typeof draftData.stepIndex === "number"
          ? draftData.stepIndex
          : typeof draftData.step === "number"
            ? draftData.step
            : 0;

      const restoredFormData = draftData.formData || draftData.filingData;
      if (restoredFormData) {
        set({
          currentStep: restoredStep,
          formData: {
            ...getInitialFormData(),
            ...restoredFormData,
          },
          itrDraft: {
            id: draftData.id || `itr-draft-${Date.now()}`,
            stepIndex: restoredStep,
            formData: restoredFormData,
            updatedAt: draftData.updatedAt || new Date().toISOString(),
          },
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  clearItrDraft: () => {
    set({ itrDraft: null });
    const authState = useAuthStore.getState();
    const mobile =
      authState.customer?.mobile ||
      authState.authenticatedUser?.mobileNumber ||
      authState.mobileNumber ||
      "user";
    const clean = String(mobile).replace(/\D/g, "") || "user";
    removeDraftFromIndex(clean, "itr-filing");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_itr-filing`).catch(() => {});
  },

  resetForm: () =>
    set({
      currentStep: 0,
      formData: getInitialFormData(),
      itrDraft: null,
    }),

  fetchAndPopulateUserProfile: async () => {
    try {
      const profile = authStorage.getUser() as any;
      if (profile) {
        const pan = profile.pan || profile.panNumber || "";
        const aadhaar = profile.aadhaar || profile.aadhaarNumber || "";
        const name = profile.name || profile.fullName || "";
        const dob = profile.dob || profile.dateOfBirth || "";
        const mobile = profile.mobileNumber || profile.mobile || "";
        const email = profile.email || "";
        const address = profile.address || profile.addressLine1 || "";
        const city = profile.city || "";
        const userState = profile.state || "";
        const pincode = profile.pincode || profile.pinCode || "";

        set((prev) => ({
          formData: {
            ...prev.formData,
            personalInfo: {
              ...prev.formData.personalInfo,
              pan: pan || prev.formData.personalInfo.pan,
              aadhaar: aadhaar || prev.formData.personalInfo.aadhaar,
              name: name || prev.formData.personalInfo.name,
              dob: dob || prev.formData.personalInfo.dob,
              mobile: mobile || prev.formData.personalInfo.mobile,
              email: email || prev.formData.personalInfo.email,
              address: address || prev.formData.personalInfo.address,
              city: city || prev.formData.personalInfo.city,
              state: userState || prev.formData.personalInfo.state,
              pincode: pincode || prev.formData.personalInfo.pincode,
              isAutoVerified: Boolean(pan || prev.formData.personalInfo.pan),
            },
          },
        }));
      }
    } catch {
      // Graceful fallback to existing state
    }
  },
}));
