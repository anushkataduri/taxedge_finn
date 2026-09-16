import { TdsCustomerIncomeFormData } from "../types/customerIncome.types";
import { TaxCalculationBreakdown } from "../types/estimate.types";
import { parsePositiveNumber } from "../utils/tdsValidation";

export const CA_DISCLAIMER_TEXT =
  "Preliminary estimate based on the information provided. Final refund/tax payable will be determined after CA verification, ITR filing and Income Tax Department processing.";

export const tdsCalculationService = {
  /**
   * Pure tax calculation engine implementing Indian Income Tax Act provisions.
   * Supports both New Regime (u/s 115BAC) and Old Regime.
   */
  calculate: (formData: TdsCustomerIncomeFormData): TaxCalculationBreakdown => {
    const { income } = formData;

    const salary = parsePositiveNumber(income.salaryIncome);
    const other = parsePositiveNumber(income.otherIncome);
    const interest = parsePositiveNumber(income.interestIncome);
    const rental = income.hasRentalIncome ? parsePositiveNumber(income.rentalIncome) : 0;
    const municipalTax = income.hasRentalIncome ? parsePositiveNumber(income.municipalTaxesPaid) : 0;
    const stcg = income.hasCapitalGains ? parsePositiveNumber(income.shortTermCapitalGains) : 0;
    const ltcg = income.hasCapitalGains ? parsePositiveNumber(income.longTermCapitalGains) : 0;
    const business = income.hasBusinessIncome ? parsePositiveNumber(income.netBusinessProfit) : 0;

    // Rental Net Income = Gross Rent - Municipal taxes - 30% standard deduction
    let netRentalIncome = 0;
    if (rental > 0) {
      const netAnnualValue = Math.max(0, rental - municipalTax);
      const standardRentDeduction = netAnnualValue * 0.3;
      netRentalIncome = Math.max(0, netAnnualValue - standardRentDeduction);
    }

    const grossTotalIncome =
      salary + other + interest + netRentalIncome + stcg + ltcg + business;

    const isOldRegime = income.taxRegime === "OLD";

    // Standard Deduction: for salary
    let standardDeduction = 0;
    if (salary > 0) {
      const maxStd = isOldRegime ? 50000 : 75000;
      standardDeduction = Math.min(salary, maxStd);
    }

    // Chapter VI-A Deductions
    let chapterVIADeductions = 0;
    if (isOldRegime && income.hasDeductions) {
      const d80C = Math.min(150000, parsePositiveNumber(income.deductions80C));
      const d80D = Math.min(50000, parsePositiveNumber(income.deductions80D));
      const d80G = parsePositiveNumber(income.donations80G);
      const otherDed = parsePositiveNumber(income.otherDeductions);
      chapterVIADeductions = d80C + d80D + d80G + otherDed;
    }

    // Section 24(b) Home Loan Interest on Self-occupied property (only under Old Regime)
    let homeLoanDeduction = 0;
    if (isOldRegime && income.hasHomeLoan) {
      homeLoanDeduction = Math.min(200000, parsePositiveNumber(income.homeLoanInterestSec24b));
    }

    const totalEligibleDeductions = Math.min(
      grossTotalIncome,
      standardDeduction + chapterVIADeductions + homeLoanDeduction
    );

    const taxableIncome = Math.max(0, grossTotalIncome - totalEligibleDeductions);

    // Slab Tax Calculation
    let slabTax = 0;
    let rebate87A = 0;

    if (isOldRegime) {
      // Old Regime Slabs (General individual):
      // 0 - 2,50,000: Nil
      // 2,50,001 - 5,00,000: 5%
      // 5,00,001 - 10,00,000: 20%
      // Above 10,00,000: 30%
      if (taxableIncome > 250000) {
        const slab1 = Math.min(taxableIncome, 500000) - 250000;
        slabTax += slab1 * 0.05;
      }
      if (taxableIncome > 500000) {
        const slab2 = Math.min(taxableIncome, 1000000) - 500000;
        slabTax += slab2 * 0.20;
      }
      if (taxableIncome > 1000000) {
        const slab3 = taxableIncome - 1000000;
        slabTax += slab3 * 0.30;
      }

      // Sec 87A Rebate: if taxable income <= 5,00,000, max 12,500
      if (taxableIncome <= 500000) {
        rebate87A = Math.min(slabTax, 12500);
      }
    } else {
      // New Regime Slabs (AY 2025-26 under Budget 2024):
      // 0 - 3,00,000: Nil
      // 3,00,001 - 7,00,000: 5%
      // 7,00,001 - 10,00,000: 10%
      // 10,00,001 - 12,00,000: 15%
      // 12,00,001 - 15,00,000: 20%
      // Above 15,00,000: 30%
      if (taxableIncome > 300000) {
        const s1 = Math.min(taxableIncome, 700000) - 300000;
        slabTax += s1 * 0.05;
      }
      if (taxableIncome > 700000) {
        const s2 = Math.min(taxableIncome, 1000000) - 700000;
        slabTax += s2 * 0.10;
      }
      if (taxableIncome > 1000000) {
        const s3 = Math.min(taxableIncome, 1200000) - 1000000;
        slabTax += s3 * 0.15;
      }
      if (taxableIncome > 1200000) {
        const s4 = Math.min(taxableIncome, 1500000) - 1200000;
        slabTax += s4 * 0.20;
      }
      if (taxableIncome > 1500000) {
        const s5 = taxableIncome - 1500000;
        slabTax += s5 * 0.30;
      }

      // Sec 87A Rebate: if taxable income <= 7,00,000, max 25,000
      if (taxableIncome <= 700000) {
        rebate87A = Math.min(slabTax, 25000);
      }
    }

    const taxAfterRebate = Math.max(0, slabTax - rebate87A);
    const cess = Math.round(taxAfterRebate * 0.04);
    const estimatedTaxLiability = Math.round(taxAfterRebate + cess);

    // Tax Credits
    const tdsDeducted = parsePositiveNumber(income.totalTdsDeducted);
    const tcsAmount = parsePositiveNumber(income.tcsAmount);
    const advanceTaxPaid = parsePositiveNumber(income.advanceTaxPaid);
    const selfAssessmentTaxPaid = parsePositiveNumber(income.selfAssessmentTaxPaid);

    const totalTaxCredits = Math.round(
      tdsDeducted + tcsAmount + advanceTaxPaid + selfAssessmentTaxPaid
    );

    let estimatedRefund = 0;
    let estimatedTaxPayable = 0;
    let isAdditionalTaxPayable = false;

    if (totalTaxCredits >= estimatedTaxLiability) {
      estimatedRefund = totalTaxCredits - estimatedTaxLiability;
    } else {
      estimatedTaxPayable = estimatedTaxLiability - totalTaxCredits;
      isAdditionalTaxPayable = true;
    }

    // Configurable TaxEdge Service Fee:
    // 10% of refund (min 499, max 4999), or flat 499 if tax payable / zero refund
    let serviceFee = 499;
    if (estimatedRefund > 0) {
      const pct = Math.round(estimatedRefund * 0.10);
      serviceFee = Math.min(4999, Math.max(499, pct));
    }
    const gstAmount = Math.round(serviceFee * 0.18);
    const totalPayableFee = serviceFee + gstAmount;

    return {
      grossTotalIncome: Math.round(grossTotalIncome),
      standardDeduction: Math.round(standardDeduction),
      chapterVIAEligibleDeductions: Math.round(chapterVIADeductions + homeLoanDeduction),
      totalEligibleDeductions: Math.round(totalEligibleDeductions),
      taxableIncome: Math.round(taxableIncome),
      slabTax: Math.round(slabTax),
      rebate87A: Math.round(rebate87A),
      taxAfterRebate: Math.round(taxAfterRebate),
      cess,
      estimatedTaxLiability,
      tdsDeducted: Math.round(tdsDeducted),
      tcsAmount: Math.round(tcsAmount),
      advanceTaxPaid: Math.round(advanceTaxPaid),
      selfAssessmentTaxPaid: Math.round(selfAssessmentTaxPaid),
      totalTaxCredits,
      estimatedRefund,
      estimatedTaxPayable,
      isAdditionalTaxPayable,
      serviceFee,
      gstAmount,
      totalPayableFee,
      disclaimer: CA_DISCLAIMER_TEXT,
    };
  },
};

export default tdsCalculationService;
