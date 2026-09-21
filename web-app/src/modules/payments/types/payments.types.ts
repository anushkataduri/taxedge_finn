import type { ApplicationStatus, Timestamped } from '@shared/types'

export interface TaxReceiptLineItem {
  id: string
  title: string
  subtitle: string
  sac: string
  amount: string
  amountNumeric: number
}

export interface TaxReceipt {
  id: string
  receiptNumber: string
  companyName: string
  companyGstin: string
  billedTo: {
    name: string
    tradeName?: string
    addressLines: string[]
    gstin?: string
  }
  invoiceDetails: {
    date: string
    customerId: string
    applicationId: string
    placeOfSupply: string
  }
  lineItems: TaxReceiptLineItem[]
  taxBreakdown: {
    taxableValue: string
    cgstRate: string
    cgstAmount: string
    sgstRate: string
    sgstAmount: string
    totalPaid: string
  }
  paymentDetails: {
    method: string
    accountRef: string
    transactionId: string
    status: string
  }
  amountInWords: string
}

export interface PaymentsItem extends Timestamped {
  id: string
  reference: string
  title: string
  status: ApplicationStatus
  amount?: number
}

export interface PaymentsFilters {
  status?: ApplicationStatus
  search?: string
}
