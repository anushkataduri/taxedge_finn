export interface DetailedEstimatorInput {
  salaryTds: number
  bankInterestTds: number
  contractor194JTds: number
  propertySaleTds: number
  otherTds: number
  totalIncome: number
  deductions: number
}

export interface DetailedEstimatorResult {
  totalTdsDeducted: number
  estimatedActualTax: number
  estimatedRefund: number
  taxEdgeFee: number
  netRefundCredited: number
}

export const INITIAL_DETAILED_ESTIMATOR: DetailedEstimatorInput = {
  salaryTds: 18000,
  bankInterestTds: 3800,
  contractor194JTds: 25000,
  propertySaleTds: 0,
  otherTds: 0,
  totalIncome: 1250000,
  deductions: 175000,
}

export const calculateDetailedEstimator = (
  input: DetailedEstimatorInput,
): DetailedEstimatorResult => {
  const allTdsArray = [
    input.salaryTds,
    input.bankInterestTds,
    input.contractor194JTds,
    input.propertySaleTds,
    input.otherTds,
  ]
  const totalTdsDeducted = allTdsArray.reduce((acc, curr) => acc + (Number(curr) || 0), 0)

  // Quick tax computation
  const taxable = Math.max(0, input.totalIncome - input.deductions)
  const computeTax = (taxableAmt: number): number => {
    if (taxableAmt <= 300000) return 0
    if (taxableAmt <= 700000) return (taxableAmt - 300000) * 0.05
    if (taxableAmt <= 1000000) return 20000 + (taxableAmt - 700000) * 0.1
    if (taxableAmt <= 1200000) return 50000 + (taxableAmt - 1000000) * 0.15
    return 80000 + (taxableAmt - 1200000) * 0.2
  }

  const estimatedActualTax = Math.round(computeTax(taxable) * 1.04)
  const rawRefund = totalTdsDeducted - estimatedActualTax
  const estimatedRefund = rawRefund > 0 ? rawRefund : Math.round(totalTdsDeducted * 0.5)
  const taxEdgeFee = Math.round(estimatedRefund * 0.15)
  const netRefundCredited = estimatedRefund - taxEdgeFee

  return {
    totalTdsDeducted,
    estimatedActualTax,
    estimatedRefund,
    taxEdgeFee,
    netRefundCredited,
  }
}
