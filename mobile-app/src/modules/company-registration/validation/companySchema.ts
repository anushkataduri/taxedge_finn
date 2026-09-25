import type { CompanyDetails } from '../types/company.types';
import { EMAIL_REGEX, PHONE_REGEX, PINCODE_REGEX } from '../../../shared/validators/indianTaxValidators';

export const companySchema = {
  validateStep(step: number, details: Partial<CompanyDetails>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (step === 1) {
      if (!details.companyClass?.trim()) errors.push('Please select Company Classification.');
      if (!details.companyCategory?.trim()) errors.push('Please select Company Category.');
      if (!details.companySubCategory?.trim()) errors.push('Please select Company Sub-Category.');
      if (!details.primaryActivity?.trim()) errors.push('Please enter Primary Business Activity.');
      if (!details.nicCode?.trim() || !/^\d{5}$/.test(details.nicCode)) errors.push('Please enter a valid 5-Digit NIC Code.');
      if (!details.proposedName1?.trim()) errors.push('Please enter 1st Preferred Name.');
      if (!details.proposedName2?.trim()) errors.push('Please enter 2nd Preferred Name.');
      if (!details.nameSuffix?.trim()) errors.push('Please enter Name Suffix.');
    }

    if (step === 2) {
      if (!details.registeredAddressLine?.trim()) errors.push('Please enter Building / Premises Address Line.');
      if (!details.registeredCity?.trim()) errors.push('Please enter City.');
      if (!details.registeredDistrict?.trim()) errors.push('Please enter District.');
      if (!details.registeredState?.trim()) errors.push('Please enter State.');
      if (!details.registeredPincode?.trim() || !PINCODE_REGEX.test(details.registeredPincode)) errors.push('Please enter a valid 6-Digit PIN Code.');
      if (!details.premisesOwnership?.trim()) errors.push('Please select Premises Ownership Status.');
      if (!details.companyEmail?.trim() || !EMAIL_REGEX.test(details.companyEmail)) errors.push('Please enter a valid Company Email.');
      if (!details.companyMobile?.trim() || !PHONE_REGEX.test(details.companyMobile)) errors.push('Please enter a valid 10-digit Mobile number.');
    }

    if (step === 4) {
      const authorizedCapital = details.authorizedCapital ?? 0;
      const paidUpCapital = details.paidUpCapital ?? 0;

      if (!details.authorizedCapital || details.authorizedCapital <= 0) errors.push('Please enter valid Authorized Capital.');
      if (!details.paidUpCapital || details.paidUpCapital <= 0) errors.push('Please enter valid Paid-up Capital.');
      if (paidUpCapital > authorizedCapital) errors.push('Paid-up Capital cannot exceed Authorized Capital.');
      if (!details.numberOfShares || details.numberOfShares <= 0) errors.push('Please enter valid Number of Shares.');
      if (!details.faceValuePerShare || details.faceValuePerShare <= 0) errors.push('Please enter valid Face Value per Share.');
    }

    return { valid: errors.length === 0, errors };
  },
};
