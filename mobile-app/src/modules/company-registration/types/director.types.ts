export interface DirectorInfo {
  id: string;
  name: string;
  pan: string;
  aadhaar: string;
  dob?: string;
  fatherName?: string;
  email: string;
  phone: string;
  occupation?: string;
  hasDin: boolean;
  din?: string;
  hasDsc?: boolean;
  sharesPercentage: number;
  residentialAddress: string;
}


export interface OpcNomineeInfo {
  name: string;
  pan: string;
  aadhaar: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface PartnerInfo {
  id: string;
  name: string;
  pan: string;
  aadhaar: string;
  email: string;
  phone: string;
  contributionAmount: number;
  profitSharePercentage: number;
  capitalContribution?: number;
  profitSharingRatio?: number;
}

