import { Alert } from "react-native";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
} from "../../types/loans.types";
import { validateGstin } from "../../../../shared/validators/indianTaxValidators";
import { getMissingRequiredDocuments } from "../../documents/loanDocumentEngine";

export const initialLoanDetails: LoanDetailsFormData = {
  loanType: "Machinery Loan",
  requiredAmount: "",
  purpose: "",
  preferredTenureMonths: "",
  hasExistingLoans: false,
  existingEmi: "",
  monthlyIncomeOrTurnover: "",
  employmentType: "Business Owner",
};

export const initialBusinessDetails: LoanBusinessFormData = {
  businessName: "",
  businessType: "",
  businessVintageYears: "",
  annualTurnover: "",
  isGstRegistered: false,
  gstin: "",
  netProfit: "",
};

export const initialBankingDetails: LoanBankingFormData = {
  primaryBankName: "",
  accountNumber: "",
  ifscCode: "",
};

export interface ValidateMachineryStepParams {
  stepIndex: number;
  loanDetails: LoanDetailsFormData;
  businessDetails: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
}

export function validateMachineryStep({
  stepIndex,
  loanDetails,
  businessDetails,
  bankingDetails,
  documents,
}: ValidateMachineryStepParams): { isValid: boolean; errors: Record<string, string> } {
  const newErrors: Record<string, string> = {};

  if (stepIndex === 0) {
    if (!loanDetails.requiredAmount) {
      newErrors.requiredAmount = "Select required loan amount";
    }
    if (!loanDetails.purpose) {
      newErrors.purpose = "Select equipment type";
    } else if (
      loanDetails.purpose === "Other" &&
      (!loanDetails.customEquipmentType || !loanDetails.customEquipmentType.trim())
    ) {
      newErrors.customEquipmentType = "Specify machinery/equipment details";
    }
    if (!loanDetails.preferredTenureMonths) {
      newErrors.preferredTenureMonths = "Select repayment tenure";
    }

    if (!businessDetails.businessName || !businessDetails.businessName.trim()) {
      newErrors.businessName = "Enter business name";
    }
    if (!businessDetails.businessType) {
      newErrors.businessType = "Select business type";
    }
    if (!businessDetails.businessVintageYears) {
      newErrors.businessVintageYears = "Select business vintage";
    }
    if (!businessDetails.annualTurnover || !businessDetails.annualTurnover.trim()) {
      newErrors.annualTurnover = "Enter annual turnover";
    }
    if (businessDetails.isGstRegistered) {
      if (!businessDetails.gstin || !businessDetails.gstin.trim()) {
        newErrors.gstin = "GSTIN is required for GST registered business";
      } else if (!validateGstin(businessDetails.gstin.trim())) {
        newErrors.gstin = "Enter valid 15-character GSTIN";
      }
    }
  }

  if (stepIndex === 1) {
    if (!bankingDetails.primaryBankName || !bankingDetails.primaryBankName.trim()) {
      newErrors.primaryBankName = "Enter bank name";
    }
    const acc = (bankingDetails.accountNumber || "").trim();
    if (!acc || !/^\d{9,18}$/.test(acc)) {
      newErrors.accountNumber = "Enter valid current account number (9-18 digits)";
    }
    const ifsc = (bankingDetails.ifscCode || "").trim().toUpperCase();
    if (!ifsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      newErrors.ifscCode = "Enter valid 11-character IFSC code";
    }
  }

  if (stepIndex === 2) {
    const missingRequired = getMissingRequiredDocuments(documents);
    if (missingRequired.length > 0) {
      Alert.alert(
        "Required Documents Missing",
        `Please upload mandatory files:\n\n• ${missingRequired.map((d) => d.name).join("\n• ")}`
      );
      return { isValid: false, errors: {} };
    }
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
}
