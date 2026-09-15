export interface ComputationHead {
  headName: string
  grossAmount: number
  exemptions: number
  netTaxable: number
  aisVerified: boolean
}

export interface FullComputationModel {
  pan: string
  assessmentYear: string
  financialYear: string
  taxpayerName: string
  filingStatus: string
  heads: ComputationHead[]
  totalTaxableIncome: number
  grossTaxLiability: number
  rebate87A: number
  healthEducationCess: number
  totalTaxPayable: number
  advanceTaxPaid: number
  tdsCreditsClaimed: number
  selfAssessmentTax: number
  netRefundOrPayable: number
}

export const MOCK_COMPUTATION_DATA: FullComputationModel = {
  pan: 'ABCDE1234F',
  assessmentYear: 'AY 2026-27',
  financialYear: 'FY 2025-26',
  taxpayerName: 'Meera Iyer',
  filingStatus: 'Individual (Resident)',
  heads: [
    {
      headName: 'Income from Salary / Professional Consulting',
      grossAmount: 1450000,
      exemptions: 75000,
      netTaxable: 1375000,
      aisVerified: true,
    },
    {
      headName: 'Income from House Property (Self Occupied)',
      grossAmount: 0,
      exemptions: 0,
      netTaxable: 0,
      aisVerified: true,
    },
    {
      headName: 'Capital Gains (Short Term & Long Term Equity)',
      grossAmount: 85000,
      exemptions: 85000,
      netTaxable: 0,
      aisVerified: true,
    },
    {
      headName: 'Income from Other Sources (Bank Interest & Dividend)',
      grossAmount: 38400,
      exemptions: 10000,
      netTaxable: 28400,
      aisVerified: true,
    },
  ],
  totalTaxableIncome: 1403400,
  grossTaxLiability: 110680,
  rebate87A: 0,
  healthEducationCess: 4427,
  totalTaxPayable: 115107,
  advanceTaxPaid: 91707,
  tdsCreditsClaimed: 46800,
  selfAssessmentTax: 0,
  netRefundOrPayable: 23400, // Refund
}
