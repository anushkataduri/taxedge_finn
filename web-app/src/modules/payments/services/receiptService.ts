import type { TaxReceipt } from '../types/payments.types'

const MOCK_RECEIPTS: Record<string, TaxReceipt> = {
  default: {
    id: 'receipt_default',
    receiptNumber: 'TE/26-27/R-0912',
    companyName: 'TaxEdge Fin Solutions',
    companyGstin: 'GSTIN 27AAKCT9182F1ZR - Pune, Maharashtra',
    billedTo: {
      name: 'Anjali Deshmukh',
      tradeName: 'Shree Deshmukh Traders',
      addressLines: [
        'Shop 14, Laxmi Complex, FC Road',
        'Pune, Maharashtra 411004',
      ],
      gstin: 'GSTIN 27AXTPD4419K1ZP',
    },
    invoiceDetails: {
      date: '2 Sep 2026',
      customerId: 'TE-CUS-20418',
      applicationId: 'ITR-2026-00074',
      placeOfSupply: 'Maharashtra (27)',
    },
    lineItems: [
      {
        id: 'line_1',
        title: 'ITR Filing — AY 2026-27',
        subtitle: 'Professional fee for preparation and filing of ITR-3',
        sac: '998231',
        amount: '₹3,000',
        amountNumeric: 3000,
      },
    ],
    taxBreakdown: {
      taxableValue: '₹3,000',
      cgstRate: 'CGST @ 9%',
      cgstAmount: '₹270',
      sgstRate: 'SGST @ 9%',
      sgstAmount: '₹270',
      totalPaid: '₹3,540',
    },
    paymentDetails: {
      method: 'UPI · anjali@okhdfcbank',
      accountRef: 'anjali@okhdfcbank',
      transactionId: 'TXN2609021184402',
      status: 'Paid in full',
    },
    amountInWords: 'Three thousand five hundred forty rupees only.',
  },
  'GST-2026-00118': {
    id: 'receipt_gst_00118',
    receiptNumber: 'TE/26-27/R-0884',
    companyName: 'TaxEdge Fin Solutions',
    companyGstin: 'GSTIN 27AAKCT9182F1ZR - Pune, Maharashtra',
    billedTo: {
      name: 'Anjali Deshmukh',
      tradeName: 'Shree Deshmukh Traders',
      addressLines: [
        'Shop 14, Laxmi Complex, FC Road',
        'Pune, Maharashtra 411004',
      ],
      gstin: 'GSTIN 27AXTPD4419K1ZP',
    },
    invoiceDetails: {
      date: '28 Aug 2026',
      customerId: 'TE-CUS-20418',
      applicationId: 'GST-2026-00118',
      placeOfSupply: 'Maharashtra (27)',
    },
    lineItems: [
      {
        id: 'line_gst_1',
        title: 'GST Monthly Filing — August 2026',
        subtitle: 'Professional fee for preparation and filing of GSTR-1 & 3B',
        sac: '998231',
        amount: '₹2,500',
        amountNumeric: 2500,
      },
    ],
    taxBreakdown: {
      taxableValue: '₹2,500',
      cgstRate: 'CGST @ 9%',
      cgstAmount: '₹225',
      sgstRate: 'SGST @ 9%',
      sgstAmount: '₹225',
      totalPaid: '₹2,950',
    },
    paymentDetails: {
      method: 'UPI · anjali@okhdfcbank',
      accountRef: 'anjali@okhdfcbank',
      transactionId: 'TXN2608289948102',
      status: 'Paid in full',
    },
    amountInWords: 'Two thousand nine hundred fifty rupees only.',
  },
}

export const receiptService = {
  async getReceipt(idOrRef?: string): Promise<TaxReceipt> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (idOrRef && MOCK_RECEIPTS[idOrRef]) {
      return MOCK_RECEIPTS[idOrRef]
    }

    return MOCK_RECEIPTS.default
  },
}
