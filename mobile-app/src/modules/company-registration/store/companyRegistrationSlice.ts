import { create } from 'zustand';
import type { CompanyRegistrationDraft, LinkedRegistrations, ApplicationReceipt, CompanyDoc } from '../types/registration.types';
import type { CompanyType, CompanyDetails } from '../types/company.types';
import type { DirectorInfo, OpcNomineeInfo, PartnerInfo } from '../types/director.types';
import type { DocumentStatus } from '../../../types/domain';

interface CompanyRegistrationState {
  draft: CompanyRegistrationDraft;
  setCompanyType: (type: CompanyType) => void;
  updateCompanyDetails: (details: Partial<CompanyDetails>) => void;
  addDirector: (director: DirectorInfo) => void;
  updateDirector: (id: string, director: Partial<DirectorInfo>) => void;
  removeDirector: (id: string) => void;
  addPartner: (partner: PartnerInfo) => void;
  removePartner: (id: string) => void;
  setOpcNominee: (nominee: OpcNomineeInfo) => void;
  toggleLinkedRegistration: (key: keyof LinkedRegistrations) => void;
  updateDocumentStatus: (documentId: string, status: DocumentStatus, fileUri?: string) => void;
  setStep: (step: number) => void;
  processPayment: (paymentMethod: string) => void;
  resetRegistration: () => void;
}

const initialDraft: CompanyRegistrationDraft = {
  id: 'INC-2026-89421',
  company: {
    companyType: 'Private Limited',
    companyClass: 'Private',
    companyCategory: 'Company limited by Shares',
    companySubCategory: 'Indian Non-Government Company',
    primaryActivity: 'Information Technology & Software Services',
    nicCode: '62011',
    secondaryActivity: 'Data Processing & Hosting Services',
    proposedName1: 'TaxEdge Tech Private Limited',
    proposedName2: 'TaxEdge Financial Innovations Pvt Ltd',
    proposedName3: 'TaxEdge Solutions Private Limited',
    nameSuffix: 'Private Limited',
    nameAvailabilityStatus: 'Available',
    registeredAddressLine: 'Plot 42, Tech Park Phase 2, HITEC City',
    registeredCity: 'Hyderabad',
    registeredState: 'Telangana',
    registeredPincode: '500081',
    premisesOwnership: 'Rented',
    companyEmail: 'contact@taxedgetech.com',
    companyMobile: '9876543210',
    officeAddressProofName: 'Rent_Agreement_Office.pdf',
    authorizedCapital: 100000,
    paidUpCapital: 100000,
    numberOfShares: 10000,
    faceValuePerShare: 10,
  },
  directors: [
    {
      id: 'dir-1',
      name: 'Rajesh Kumar',
      pan: 'ABCDE1234F',
      aadhaar: '123456789012',
      dob: '1988-05-14',
      fatherName: 'Suresh Kumar',
      email: 'rajesh@taxedge.com',
      phone: '9876543210',
      occupation: 'Professional',
      hasDin: true,
      din: '08492014',
      hasDsc: true,
      sharesPercentage: 60,
      residentialAddress: 'Flat 302, Green Acres, Hyderabad',
    },
    {
      id: 'dir-2',
      name: 'Anita Sharma',
      pan: 'XYZPS9876K',
      aadhaar: '987654321098',
      dob: '1990-11-20',
      fatherName: 'Ramesh Sharma',
      email: 'anita@taxedge.com',
      phone: '9812345678',
      occupation: 'Business',
      hasDin: false,
      hasDsc: true,
      sharesPercentage: 40,
      residentialAddress: 'H.No 12-4, Jubliee Hills, Hyderabad',
    },
  ],
  opcNominee: {
    name: 'Vikram Sharma',
    pan: 'NOMEE4321P',
    aadhaar: '456789123045',
    email: 'vikram.nominee@taxedge.com',
    phone: '9765432109',
    relationship: 'Brother',
  },
  partners: [],
  documents: [
    { id: 'doc-pan', name: 'Promoter PAN Card', category: 'Promoter KYC', required: true, status: 'Uploaded' },
    { id: 'doc-aadhaar', name: 'Promoter Aadhaar / Passport', category: 'Promoter KYC', required: true, status: 'Uploaded' },
    { id: 'doc-photo', name: 'Promoter Passport Photo', category: 'Promoter KYC', required: true, status: 'Uploaded' },
    { id: 'doc-address', name: 'Registered Office Ownership / Lease Proof', category: 'Office Proof', required: true, status: 'Uploaded' },
    { id: 'doc-utility', name: 'Registered Office Utility Bill (Electricity/Water)', category: 'Office Proof', required: true, status: 'Uploaded' },
    { id: 'doc-moa', name: 'Draft e-MoA (Memorandum of Association)', category: 'Statutory Docs', required: true, status: 'Pending' },
    { id: 'doc-aoa', name: 'Draft e-AoA (Articles of Association)', category: 'Statutory Docs', required: true, status: 'Pending' },
  ],
  linkedRegistrations: {
    pan: true,
    tan: true,
    gst: true,
    esic: true,
    epfo: true,
    professionalTax: true,
    bankAccount: true,
  },
  feeBreakdown: {
    professionalFee: 4999,
    gstAmount: 900,
    statutoryCharges: 1500,
    totalAmount: 7399,
  },
  trackingStages: [
    { id: 'stg-1', title: 'Draft Creation', description: 'Application initiated by user', status: 'completed', updatedAt: '18 Sep 2026' },
    { id: 'stg-2', title: 'KYC & Document Verification', description: 'Reviewing PAN, Aadhaar & Office Proofs', status: 'completed', updatedAt: '18 Sep 2026' },
    { id: 'stg-3', title: 'Under Review', description: 'TaxEdge compliance expert validation', status: 'current', updatedAt: 'In Progress' },
    { id: 'stg-4', title: 'Name Reservation (RUN / SPICe+ Part A)', description: 'Filing preferred names with MCA CRC', status: 'pending' },
    { id: 'stg-5', title: 'DSC & DIN Processing', description: 'Digital signature token generation', status: 'pending' },
    { id: 'stg-6', title: 'Ready for SPICe+ Part B Filing', description: 'Final incorporation payload compilation', status: 'pending' },
    { id: 'stg-7', title: 'Submitted to MCA Portal', description: 'Form e-MoA, e-AoA & AGILE-PRO-S filed', status: 'pending' },
    { id: 'stg-8', title: 'Government Approval & COI', description: 'Certificate of Incorporation & CIN Issuance', status: 'pending' },
  ],
  currentStep: 0,
  totalFee: 4999,
  paymentStatus: 'Pending',
  status: 'Draft',
  createdAt: '2026-09-18',
};

export const useCompanyRegistrationStore = create<CompanyRegistrationState>((set) => ({
  draft: initialDraft,
  setCompanyType: (type) =>
    set((state) => {
      const isOpc = type === 'One Person Company (OPC)';
      let directors = state.draft.directors;
      if (isOpc && directors.length > 0) {
        directors = [{ ...directors[0], sharesPercentage: 100 }];
      }
      return {
        draft: {
          ...state.draft,
          company: { ...state.draft.company, companyType: type },
          directors,
        },
      };
    }),
  updateCompanyDetails: (details) =>
    set((state) => ({
      draft: {
        ...state.draft,
        company: { ...state.draft.company, ...details },
      },
    })),
  addDirector: (director) =>
    set((state) => {
      if (state.draft.company.companyType === 'One Person Company (OPC)') {
        return state; // Prevent adding more than 1 director/promoter for OPC
      }
      return {
        draft: {
          ...state.draft,
          directors: [...state.draft.directors, director],
        },
      };
    }),
  updateDirector: (id, updatedFields) =>
    set((state) => ({
      draft: {
        ...state.draft,
        directors: state.draft.directors.map((d) => (d.id === id ? { ...d, ...updatedFields } : d)),
      },
    })),
  removeDirector: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        directors: state.draft.directors.filter((d) => d.id !== id),
      },
    })),
  addPartner: (partner) =>
    set((state) => ({
      draft: {
        ...state.draft,
        partners: [...state.draft.partners, partner],
      },
    })),
  removePartner: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        partners: state.draft.partners.filter((p) => p.id !== id),
      },
    })),
  setOpcNominee: (opcNominee) =>
    set((state) => ({
      draft: { ...state.draft, opcNominee },
    })),
  toggleLinkedRegistration: (key) =>
    set((state) => ({
      draft: {
        ...state.draft,
        linkedRegistrations: {
          ...state.draft.linkedRegistrations,
          [key]: !state.draft.linkedRegistrations[key],
        },
      },
    })),
  updateDocumentStatus: (documentId, status, fileUri) =>
    set((state) => {
      const exists = state.draft.documents.some((doc) => doc.id === documentId);
      const updatedDocs = exists
        ? state.draft.documents.map((doc) => (doc.id === documentId ? { ...doc, status, fileUri } : doc))
        : [...state.draft.documents, { id: documentId, name: documentId, category: 'Conditional Doc', required: true, status, fileUri }];
      return {
        draft: {
          ...state.draft,
          documents: updatedDocs,
        },
      };
    }),
  setStep: (currentStep) =>
    set((state) => ({
      draft: { ...state.draft, currentStep },
    })),
  processPayment: (paymentMethod) =>
    set((state) => {
      const receipt: ApplicationReceipt = {
        applicationId: state.draft.id,
        companyName: state.draft.company.proposedName1,
        companyType: state.draft.company.companyType,
        appliedDate: '18 Sep 2026',
        totalAmount: state.draft.feeBreakdown.totalAmount,
        paymentStatus: 'Paid',
        paymentMethod,
        transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      };
      return {
        draft: {
          ...state.draft,
          paymentStatus: 'Paid',
          status: 'Submitted',
          receipt,
        },
      };
    }),
  resetRegistration: () => set({ draft: initialDraft }),
}));


