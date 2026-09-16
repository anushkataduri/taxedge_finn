import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";
import { useApplicationStore } from "@/store/applicationStore";
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
  restoreItrDraft: () => boolean;
  clearItrDraft: () => void;
  resetForm: () => void;
}

const getInitialFormData = (): ItrFilingFormData => {
  // 1. Pull user profile from authStore
  const customer = useAuthStore.getState().customer;

  // 2. Pull GST draft data if available from applicationStore
  const gstDraft = useApplicationStore.getState().gstDraft;
  const gstBusiness = gstDraft?.businessData || {};

  const personalInfo: ItrPersonalInfo = {
    pan: customer?.pan || "ABCDE1234F",
    aadhaar: customer?.aadhaar || "987654321098",
    name: customer?.name || "Client Name",
    dob: customer?.dob || "1990-01-01",
    gender: customer?.gender || "Male",
    fatherSpouseName: customer?.fatherSpouseName || "",
    address: customer?.address || customer?.addressLine1 || "123 Business Parkway",
    city: customer?.city || "Bangalore",
    state: customer?.state || "Karnataka",
    pincode: customer?.pincode || "560001",
    mobile: customer?.mobile || "9876543210",
    email: customer?.email || "taxpayer@taxedge.in",
    residentialStatus: "",
    residentialStatusConfirmed: false,
    assessmentYear: getCurrentAssessmentYear(),
    filingType: "",
    filingTypeSuggested: "",
    isAutoVerified: true,
  };

  const initialBankAccounts: ItrSelectableBank[] = [
    {
      id: "bank-1",
      bankName: "HDFC Bank",
      accountNumber: "50100234891234",
      maskedAccountNumber: "•••• •••• 1234",
      ifscCode: "HDFC0001234",
      accountType: "Savings",
      isPrimaryRefund: false,
      validationStatus: "Validated",
    },
    {
      id: "bank-2",
      bankName: "ICICI Bank",
      accountNumber: "00240156789056",
      maskedAccountNumber: "•••• •••• 9056",
      ifscCode: "ICIC0000024",
      accountType: "Current",
      isPrimaryRefund: false,
      validationStatus: "Validated",
    },
  ];

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
    hasPreviousItr: true,
    previousAckNumber: "84729104928104",
    previousAssessmentYear: "2024-2025",
    previousItrForm: "ITR-2",
    previousFiledDate: "28-Jul-2025",
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
  const gstTurnoverNum = Number(gstBusiness.annualTurnover || 2480000);

  const gstReconciliation: GstReconciliationSummary = {
    gstin: gstBusiness.gstin || "29ABCDE1234F1Z5",
    legalName: gstBusiness.businessName || "ABC Enterprises",
    tradeName: gstBusiness.tradeName || "ABC Traders",
    businessActivity: "Trading & Outward Supplies",
    registrationDate: "15-Apr-2021",
    gstr1Turnover: 2480000,
    gstr3bTurnover: 2475000,
    booksTurnover: 2460000,
    proposedItrTurnover: 2460000,
    variance: 20000,
    hasVariance: true,
    varianceExplanation: "Difference of ₹20,000 between GSTR-1 outward supplies (₹24.8L) and financial books (₹24.6L) due to credit notes issued in Q4.",
  };

  const registeredAccountType = customer?.customerType || "Individual";
  const isCorporate =
    registeredAccountType === "Private Limited" ||
    registeredAccountType === "Public Limited" ||
    registeredAccountType === "LLP" ||
    registeredAccountType === "Partnership";
  const initialCategory: ItrCategoryType = isCorporate ? "business" : "salaried";

  const incomeSources = {
    salary: {
      enabled: initialCategory === "salaried",
      employerName: initialCategory === "salaried" ? "Acme Corporation India" : "",
      grossSalary: initialCategory === "salaried" ? "850000" : "",
      allowances: "",
      tdsDeducted: "",
      source: "USER_DECLARED" as const,
      isVerified: false,
    },
    houseProperty: {
      enabled: false,
      propertyType: "self_occupied" as const,
      annualRentReceived: "",
      municipalTaxesPaid: "",
      homeLoanInterest: "",
      source: "USER_DECLARED" as const,
    },
    business: {
      enabled: initialCategory === "business",
      businessType: "presumptive_44ad" as const,
      businessName: gstBusiness.businessName || "ABC Enterprises",
      gstin: gstBusiness.gstin || "29ABCDE1234F1Z5",
      businessActivity: "Trading",
      grossTurnover: String(gstReconciliation.proposedItrTurnover),
      declaredProfit: initialCategory === "business" ? "200000" : "",
      source: "GST_FILING" as const,
      hasGstActivity: true,
      gstr1Turnover: "2480000",
      gstr3bTurnover: "2475000",
      gstReconciliationRequired: true,
    },
    capitalGains: {
      enabled: false,
      hasEquityMf: false,
      hasFnoIntraday: false,
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
          grossSalary: newSources.salary.grossSalary || "850000",
          employerName: newSources.salary.employerName || "Acme Corporation India",
        };
        newSources.business = {
          ...newSources.business,
          declaredProfit: "",
          grossTurnover: "",
        };
      } else if (category === "business") {
        newSources.business = {
          ...newSources.business,
          enabled: true,
          businessType: "presumptive_44ad",
          grossTurnover: newSources.business.grossTurnover || "2460000",
          declaredProfit: newSources.business.declaredProfit || "200000",
        };
      } else if (category === "professional") {
        newSources.business = {
          ...newSources.business,
          enabled: true,
          businessType: "presumptive_44ada",
          grossTurnover: newSources.business.grossTurnover || "1500000",
          declaredProfit: newSources.business.declaredProfit || "750000",
        };
      } else if (category === "freelancer") {
        newSources.business = {
          ...newSources.business,
          enabled: true,
          businessType: "presumptive_44ada",
          grossTurnover: newSources.business.grossTurnover || "1200000",
          declaredProfit: newSources.business.declaredProfit || "600000",
        };
      } else if (category === "trader_investor") {
        newSources.capitalGains = {
          ...newSources.capitalGains,
          enabled: true,
          hasFnoIntraday: true,
          hasEquityMf: true,
          shortTermGains: newSources.capitalGains.shortTermGains || "150000",
          longTermGains: newSources.capitalGains.longTermGains || "80000",
        };
      } else if (category === "rental") {
        newSources.houseProperty = {
          ...newSources.houseProperty,
          enabled: true,
          propertyType: "let_out",
          annualRentReceived: newSources.houseProperty.annualRentReceived || "360000",
          municipalTaxesPaid: newSources.houseProperty.municipalTaxesPaid || "20000",
        };
      } else if (category === "capital_gains") {
        newSources.capitalGains = {
          ...newSources.capitalGains,
          enabled: true,
          hasEquityMf: true,
          shortTermGains: newSources.capitalGains.shortTermGains || "120000",
          longTermGains: newSources.capitalGains.longTermGains || "250000",
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
  },

  restoreItrDraft: () => {
    const { itrDraft } = get();
    if (!itrDraft) return false;
    set({
      currentStep: itrDraft.stepIndex,
      formData: itrDraft.formData,
    });
    return true;
  },

  clearItrDraft: () => set({ itrDraft: null }),

  resetForm: () =>
    set({
      currentStep: 0,
      formData: getInitialFormData(),
      itrDraft: null,
    }),
}));
