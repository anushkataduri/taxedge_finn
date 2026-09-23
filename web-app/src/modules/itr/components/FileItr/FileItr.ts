export interface FileItrFormData {
  panNumber: string
  fullName: string
  dob: string
  assessmentYear: string
  incomeSource: 'salary' | 'business' | 'capital_gains' | 'freelance' | 'multiple'
  regime: 'new' | 'old'
  annualGrossIncome: number
  tdsDeducted: number
  deductions80C: number
  deductions80D: number
  bankAccountNumber: string
  ifscCode: string
}

export interface RegimeComparison {
  regime: 'new' | 'old'
  grossTotalIncome: number
  totalDeductions: number
  taxableIncome: number
  taxPayable: number
  netTaxOrRefund: number
}

export const INITIAL_FILE_ITR_STATE: FileItrFormData = {
  panNumber: 'ABCDE1234F',
  fullName: 'Meera Iyer',
  dob: '1992-08-14',
  assessmentYear: '2026-27',
  incomeSource: 'business',
  regime: 'new',
  annualGrossIncome: 1450000,
  tdsDeducted: 46800,
  deductions80C: 150000,
  deductions80D: 25000,
  bankAccountNumber: '918237461920',
  ifscCode: 'HDFC0001824',
}

export const calculateRegimeTax = (
  grossIncome: number,
  deductions80C: number,
  deductions80D: number,
  tds: number,
): { newRegime: RegimeComparison; oldRegime: RegimeComparison } => {
  const stdDeductionNew = 75000
  const taxableNew = Math.max(0, grossIncome - stdDeductionNew)
  
  // New Regime slabs (FY 2025-26 / AY 2026-27 approx)
  const computeNewTax = (taxable: number): number => {
    if (taxable <= 300000) return 0
    if (taxable <= 700000) return (taxable - 300000) * 0.05
    if (taxable <= 1000000) return 20000 + (taxable - 700000) * 0.1
    if (taxable <= 1200000) return 50000 + (taxable - 1000000) * 0.15
    if (taxable <= 1500000) return 80000 + (taxable - 1200000) * 0.2
    return 140000 + (taxable - 1500000) * 0.3
  }

  const baseTaxNew = computeNewTax(taxableNew)
  const cessNew = baseTaxNew * 0.04
  const finalTaxNew = Math.round(baseTaxNew + cessNew)

  // Old Regime
  const stdDeductionOld = 50000
  const totalDeductionsOld = stdDeductionOld + deductions80C + deductions80D
  const taxableOld = Math.max(0, grossIncome - totalDeductionsOld)
  
  const computeOldTax = (taxable: number): number => {
    if (taxable <= 250000) return 0
    if (taxable <= 500000) return (taxable - 250000) * 0.05
    if (taxable <= 1000000) return 12500 + (taxable - 500000) * 0.2
    return 112500 + (taxable - 1000000) * 0.3
  }

  const baseTaxOld = computeOldTax(taxableOld)
  const cessOld = baseTaxOld * 0.04
  const finalTaxOld = Math.round(baseTaxOld + cessOld)

  return {
    newRegime: {
      regime: 'new',
      grossTotalIncome: grossIncome,
      totalDeductions: stdDeductionNew,
      taxableIncome: taxableNew,
      taxPayable: finalTaxNew,
      netTaxOrRefund: tds - finalTaxNew,
    },
    oldRegime: {
      regime: 'old',
      grossTotalIncome: grossIncome,
      totalDeductions: totalDeductionsOld,
      taxableIncome: taxableOld,
      taxPayable: finalTaxOld,
      netTaxOrRefund: tds - finalTaxOld,
    },
  }
}
