import { apiClient } from "../../../../core/api/apiClient";
import { TdsCustomerIncomeFormData } from "../types/customerIncome.types";
import { TdsChecklistItem } from "../types/checklist.types";
import { TaxCalculationBreakdown } from "../types/estimate.types";
import { parsePositiveNumber } from "../utils/tdsValidation";
import { tdsCalculationService } from "./tdsCalculationService";

export interface BackendApplicationResponse {
  applicationId: string;
  fullName: string;
  pan: string;
  mobileNumber: string;
  email: string;
  bankName: string;
  maskedAccountNumber: string;
  assessmentYear: string;
  grossTotalIncome: number;
  taxableIncome: number;
  estimatedTaxLiability: number;
  totalTaxCredits: number;
  estimatedRefund: number;
  isAdditionalTaxPayable: boolean;
  status: string;
  isPaid: boolean;
  paymentId?: string;
  totalPaid?: number;
  createdAt: string;
  paidAt?: string;
}

export const tdsApiService = {
  calculateTax: async (formData: TdsCustomerIncomeFormData): Promise<TaxCalculationBreakdown> => {
    try {
      const payload = {
        assessmentYear: formData.income.assessmentYear,
        financialYear: formData.income.financialYear,
        taxRegime: formData.income.taxRegime,
        salaryIncome: parsePositiveNumber(formData.income.salaryIncome),
        otherIncome: parsePositiveNumber(formData.income.otherIncome),
        interestIncome: parsePositiveNumber(formData.income.interestIncome),
        rentalIncome: formData.income.hasRentalIncome ? parsePositiveNumber(formData.income.rentalIncome) : 0,
        capitalGainsIncome: formData.income.hasCapitalGains
          ? parsePositiveNumber(formData.income.shortTermCapitalGains) + parsePositiveNumber(formData.income.longTermCapitalGains)
          : 0,
        businessIncome: formData.income.hasBusinessIncome ? parsePositiveNumber(formData.income.netBusinessProfit) : 0,
        deductions80C: formData.income.hasDeductions ? parsePositiveNumber(formData.income.deductions80C) : 0,
        deductions80D: formData.income.hasDeductions ? parsePositiveNumber(formData.income.deductions80D) : 0,
        homeLoanInterest: formData.income.hasHomeLoan ? parsePositiveNumber(formData.income.homeLoanInterestSec24b) : 0,
        otherDeductions: formData.income.hasDeductions ? parsePositiveNumber(formData.income.otherDeductions) : 0,
        totalTdsDeducted: parsePositiveNumber(formData.income.totalTdsDeducted),
        tcsAmount: parsePositiveNumber(formData.income.tcsAmount),
        advanceTaxPaid: parsePositiveNumber(formData.income.advanceTaxPaid),
        selfAssessmentTaxPaid: parsePositiveNumber(formData.income.selfAssessmentTaxPaid),
      };

      const response = await apiClient.post<TaxCalculationBreakdown>("/tds-refund/calculate", payload);
      if (response && response.grossTotalIncome !== undefined) {
        return response;
      }
    } catch (err) {
      console.warn("Backend tax calculation endpoint unavailable, using local calculation service:", err);
    }
    // Fallback to local pure calculation engine
    return tdsCalculationService.calculate(formData);
  },

  submitApplicationDraft: async (
    formData: TdsCustomerIncomeFormData,
    documents: TdsChecklistItem[],
    calculation: TaxCalculationBreakdown,
    existingAppId?: string
  ): Promise<BackendApplicationResponse> => {
    const payload = {
      applicationId: existingAppId,
      fullName: formData.personal.fullName,
      pan: formData.personal.pan,
      aadhaar: formData.personal.aadhaar,
      dob: formData.personal.dob,
      mobileNumber: formData.personal.mobileNumber,
      email: formData.personal.email,
      address: formData.personal.residentialAddress,
      city: formData.personal.city,
      state: formData.personal.state,
      pinCode: formData.personal.pinCode,

      accountHolderName: formData.bank.accountHolderName,
      accountNumber: formData.bank.accountNumber,
      ifscCode: formData.bank.ifscCode,
      bankName: formData.bank.bankName,
      branchName: formData.bank.branchName,
      accountType: formData.bank.accountType,

      assessmentYear: formData.income.assessmentYear,
      financialYear: formData.income.financialYear,
      taxRegime: formData.income.taxRegime,

      salaryIncome: parsePositiveNumber(formData.income.salaryIncome),
      otherIncome: parsePositiveNumber(formData.income.otherIncome),
      interestIncome: parsePositiveNumber(formData.income.interestIncome),
      rentalIncome: parsePositiveNumber(formData.income.rentalIncome),
      capitalGainsIncome:
        parsePositiveNumber(formData.income.shortTermCapitalGains) +
        parsePositiveNumber(formData.income.longTermCapitalGains),
      businessIncome: parsePositiveNumber(formData.income.netBusinessProfit),

      totalTdsDeducted: parsePositiveNumber(formData.income.totalTdsDeducted),
      tcsAmount: parsePositiveNumber(formData.income.tcsAmount),
      advanceTaxPaid: parsePositiveNumber(formData.income.advanceTaxPaid),
      selfAssessmentTaxPaid: parsePositiveNumber(formData.income.selfAssessmentTaxPaid),
      carryForwardLoss: parsePositiveNumber(formData.income.carryForwardLossAmount),

      deductions80C: parsePositiveNumber(formData.income.deductions80C),
      deductions80D: parsePositiveNumber(formData.income.deductions80D),
      homeLoanInterest: parsePositiveNumber(formData.income.homeLoanInterestSec24b),
      otherDeductions: parsePositiveNumber(formData.income.otherDeductions),

      grossTotalIncome: calculation.grossTotalIncome,
      totalDeductions: calculation.totalEligibleDeductions,
      taxableIncome: calculation.taxableIncome,
      estimatedTaxLiability: calculation.estimatedTaxLiability,
      totalTaxCredits: calculation.totalTaxCredits,
      estimatedRefund: calculation.estimatedRefund,
      isAdditionalTaxPayable: calculation.isAdditionalTaxPayable,

      documentsJson: JSON.stringify(
        documents
          .filter((d) => d.status === "uploaded" && d.fileUri)
          .map((d) => ({
            id: d.id,
            title: d.title,
            fileName: d.fileName,
            fileSize: d.fileSize,
            fileUri: d.fileUri,
            mimeType: d.mimeType,
            uploadedAt: d.uploadedAt,
          }))
      ),
    };

    return await apiClient.post<BackendApplicationResponse>("/tds-refund/apply", payload);
  },

  payAndConfirm: async (
    applicationId: string,
    paymentMethod: string,
    amount: number
  ): Promise<BackendApplicationResponse> => {
    const payload = {
      applicationId,
      paymentMethod,
      amount,
    };
    return await apiClient.post<BackendApplicationResponse>("/tds-refund/pay", payload);
  },

  fetchStatus: async (applicationId: string): Promise<BackendApplicationResponse> => {
    return await apiClient.get<BackendApplicationResponse>(`/tds-refund/status/${applicationId}`);
  },
};

export default tdsApiService;
