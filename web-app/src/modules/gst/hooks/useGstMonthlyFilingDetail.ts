import { useState, useEffect } from 'react';

export interface GstDocument {
  id: string;
  title: string;
  subtitle: string;
  status: 'verified' | 'uploading' | 'pending' | 'rejected';
  progress?: number;
}

export interface GstTimelineEvent {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
  description?: string;
}

export interface GstPayment {
  id: string;
  receiptNumber: string;
  description: string;
  amount: string;
  method: string;
  date: string;
  status: 'paid' | 'pending' | 'failed';
}

export interface GstFilingDetail {
  id: string;
  reference: string;
  title: string;
  details: string;
  progress: number;
  application: {
    appId: string;
    service: string;
    period: string;
    gstin: string;
    opened: string;
    due: string;
    currentStage: string;
  };
  tracking?: {
    arnNumber: string;
    currentStageIndex: number;
    totalStages: number;
    fee: string;
    paymentStatus: string;
    documentsCount: string;
    assignee: {
      name: string;
      role: string;
      initials: string;
    };
  };
  returnFigures: {
    taxableTurnover: string;
    outputTax: string;
    inputTaxCredit: string;
    itcReversed: string;
    netPayable: string;
  };
  documents: GstDocument[];
  timeline: GstTimelineEvent[];
  payments: GstPayment[];
}

export const useGstMonthlyFilingDetail = (id?: string) => {
  const [data, setData] = useState<GstFilingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      setData({
        id: id || '1',
        reference: 'GST-2026-00118',
        title: 'GST Monthly Filing',
        details: 'August 2026 · GSTR-1 & GSTR-3B',
        progress: 58,
        application: {
          appId: 'GST-2026-00118',
          service: 'GST Monthly Filing',
          period: 'August 2026',
          gstin: '27AXTPD4419K1ZP',
          opened: '28 Aug 2026',
          due: '20 Sep 2026',
          currentStage: 'ARN Generated',
        },
        tracking: {
          arnNumber: 'ARN AA2708260041926',
          currentStageIndex: 7,
          totalStages: 12,
          fee: '₹2,500',
          paymentStatus: 'Paid',
          documentsCount: '8 / 8',
          assignee: {
            name: 'Rohit Kulkarni',
            role: 'GST Executive',
            initials: 'RK',
          },
        },
        returnFigures: {
          taxableTurnover: '₹18,17,700',
          outputTax: '₹3,27,186',
          inputTaxCredit: '-₹1,96,400',
          itcReversed: '₹4,200',
          netPayable: '₹1,16,986'
        },
        documents: [
          { id: '1', title: 'PAN of business / proprietor', subtitle: 'PAN_AXTPD4419K.pdf · 240 KB · verified', status: 'verified' },
          { id: '2', title: 'Aadhaar of proprietor', subtitle: 'Aadhaar_masked.pdf · 310 KB · verified', status: 'verified' },
          { id: '3', title: 'Photograph of proprietor', subtitle: 'photo.jpg · 88 KB · verified', status: 'verified' },
          { id: '4', title: 'Rental agreement', subtitle: 'Rent_Agreement_2026.pdf · 1.8 MB', status: 'uploading', progress: 65 },
          { id: '5', title: 'Electricity bill (latest)', subtitle: 'Not older than 2 months · PDF or JPG', status: 'pending' },
          { id: '6', title: 'Bank statement or cancelled cheque', subtitle: 'First page showing name, account and IFSC', status: 'pending' },
          { id: '7', title: 'Address proof of premises', subtitle: 'Rejected · document was illegible, please rescan', status: 'rejected' },
          { id: '8', title: 'Digital signature (DSC)', subtitle: 'Only for companies and LLPs — optional for you', status: 'pending' }
        ],
        timeline: [
          { id: '1', title: 'New Request', date: '28 Aug 2026, 9:12 AM', status: 'completed' },
          { id: '2', title: 'Documents Pending', date: '28 Aug 2026, 9:14 AM', status: 'completed' },
          { id: '3', title: 'Documents Received', date: '29 Aug 2026, 11:04 AM', status: 'completed' },
          { id: '4', title: 'Verification', date: '30 Aug 2026, 2:30 PM', status: 'completed' },
          { id: '5', title: 'Application Prepared', date: '31 Aug 2026, 10:15 AM', status: 'completed' },
          { id: '6', title: 'Submitted', date: '1 Sep 2026, 4:02 PM', status: 'completed' },
          { id: '7', title: 'ARN Generated', date: '1 Sep 2026, 4:11 PM', status: 'current', description: 'Currently at this stage. Your executive will update you as it moves.' },
          { id: '8', title: 'Department Query', date: 'Pending', status: 'pending' },
          { id: '9', title: 'Query Response Submitted', date: 'Pending', status: 'pending' },
          { id: '10', title: 'GST Approved', date: 'Pending', status: 'pending' },
          { id: '11', title: 'GST Certificate Delivered', date: 'Pending', status: 'pending' },
          { id: '12', title: 'Completed', date: 'Pending', status: 'pending' }
        ],
        payments: [
          {
            id: '1',
            receiptNumber: 'TE/26-27/R-0884',
            description: 'GST Monthly Filing fee',
            amount: '₹2,950',
            method: 'UPI · HDFC',
            date: '28 Aug 2026',
            status: 'paid'
          }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  return { data, isLoading };
};
