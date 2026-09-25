import type { DirectorInfo } from '../types/director.types';
import { PAN_REGEX, AADHAAR_REGEX, EMAIL_REGEX, PHONE_REGEX, PINCODE_REGEX } from '../../../shared/validators/indianTaxValidators';

export const directorSchema = {
  validateDirector(director: Partial<DirectorInfo>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!director.name?.trim()) errors.push('Director name is required.');
    if (!director.pan?.trim() || !PAN_REGEX.test(director.pan.trim().toUpperCase())) errors.push(`Invalid PAN format for ${director.name || 'Director'}.`);
    if (director.aadhaar && !AADHAAR_REGEX.test(director.aadhaar.trim().replace(/\s/g, ''))) errors.push(`Invalid Aadhaar format for ${director.name || 'Director'}.`);
    if (!director.dob?.trim()) errors.push(`Date of Birth is required for ${director.name || 'Director'}.`);
    if (!director.fatherName?.trim()) errors.push(`Father's name is required for ${director.name || 'Director'}.`);
    
    if (!director.email?.trim() || !EMAIL_REGEX.test(director.email.trim())) errors.push(`Invalid Email for ${director.name || 'Director'}.`);
    if (!director.phone?.trim() || !PHONE_REGEX.test(director.phone.trim())) errors.push(`Invalid Phone number for ${director.name || 'Director'}.`);

    if (director.hasDin && !director.din?.trim()) errors.push(`DIN is required for ${director.name || 'Director'} as 'Has DIN' is checked.`);
    
    if (!director.addressLine1?.trim()) errors.push(`Address Line 1 is required for ${director.name || 'Director'}.`);
    if (!director.city?.trim()) errors.push(`City is required for ${director.name || 'Director'}.`);
    if (!director.state?.trim()) errors.push(`State is required for ${director.name || 'Director'}.`);
    if (!director.pinCode?.trim() || !PINCODE_REGEX.test(director.pinCode.trim())) errors.push(`Invalid PIN Code for ${director.name || 'Director'}.`);

    if (!director.sameAsPermanentAddress) {
      if (!director.presentAddressLine1?.trim()) errors.push(`Present Address Line 1 is required for ${director.name || 'Director'}.`);
      if (!director.presentCity?.trim()) errors.push(`Present City is required for ${director.name || 'Director'}.`);
      if (!director.presentState?.trim()) errors.push(`Present State is required for ${director.name || 'Director'}.`);
      if (!director.presentPincode?.trim() || !PINCODE_REGEX.test(director.presentPincode.trim())) errors.push(`Invalid Present PIN Code for ${director.name || 'Director'}.`);
    }

    return { valid: errors.length === 0, errors };
  },
};
