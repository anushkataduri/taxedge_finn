import { GstBusinessFormData } from "../components/GstBusinessStep/GstBusinessStep";

/**
 * Normalizes input string to UPPER_SNAKE_CASE for exact matching.
 */
const normalizeInput = (val: string): string =>
  (val || "")
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

/**
 * Exact or partial match dictionary lookup (Clean approach without if-else spaghetti)
 */
const getMappedValue = (
  rawInput: string,
  dict: Record<string, string>,
  fallback: string,
): string => {
  if (!rawInput) return fallback;

  // 1. Try Exact O(1) Lookup
  if (dict[rawInput]) return dict[rawInput];

  // 2. Fallback to Partial Match (Production-safe fallback)
  const matchedKey = Object.keys(dict).find((key) => rawInput.includes(key));
  return matchedKey ? dict[matchedKey] : fallback;
};

// --- DICTIONARY MAPS (Configurations) ---

const CONSTITUTION_MAP: Record<string, string> = {
  PARTNERSHIP_FIRM: "PARTNERSHIP",
  LLP: "LLP",
  PRIVATE: "PRIVATE_LIMITED_COMPANY",
  PUBLIC: "PUBLIC_LIMITED_COMPANY",
  HUF: "HUF",
  SOCIETY: "SOCIETY_TRUST_CLUB",
  TRUST: "SOCIETY_TRUST_CLUB",
  AOP: "AOP_BOI",
  BOI: "AOP_BOI",
  GOVERNMENT: "GOVERNMENT_DEPARTMENT",
  FOREIGN: "FOREIGN_COMPANY",
  PARTNERSHIP: "PARTNERSHIP",
};

const NATURE_MAP: Record<string, string> = {
  WHOLESALER: "TRADER",
  DISTRIBUTOR: "TRADER",
  RETAILER: "TRADER",
  TRADER: "TRADER",
  MANUFACTURER: "MANUFACTURER",
  E_COMMERCE: "E_COMMERCE",
  WORK_CONTRACT: "WORK_CONTRACT",
  IMPORT: "IMPORT_EXPORT",
  EXPORT: "IMPORT_EXPORT",
  WARE_HOUSE: "WARE_HOUSE_DEPOT",
  DEPOT: "WARE_HOUSE_DEPOT",
};

const REASON_MAP: Record<string, string> = {
  E_COMMERCE: "ECOMMERCE_OPERATOR_SELLER",
  THRESHOLD: "CROSSED_TURN_OVER_THRESHOLD",
  TURN_OVER: "CROSSED_TURN_OVER_THRESHOLD",
  INTER_STATE: "INTER_STATE_SUPPLY",
  CASUAL: "CASUAL_TAXABLE_PERSON",
  INPUT_SERVICE: "INPUT_SERVICE_DISTRIBUTOR",
};

/**
 * Exception-safe Date Formatter
 */
const formatBackendDate = (dateStr: string): string => {
  try {
    if (!dateStr || dateStr.trim() === "")
      return new Date().toISOString().split("T")[0];

    // Handles DD/MM/YYYY
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3)
        return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }

    // Handles DD-MM-YYYY
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (parts[0].length === 2 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }
    return dateStr; // Return as-is if already in YYYY-MM-DD
  } catch (error) {
    console.warn("Date formatting failed, defaulting to today", error);
    return new Date().toISOString().split("T")[0]; // Safe Fallback
  }
};

/**
 * Maps the frontend GstBusinessFormData to the backend-expected payload format.
 * Includes global Exception Handling.
 */
export const mapGstRegistrationPayload = (
  businessData: GstBusinessFormData,
) => {
  try {
    const rawConstitution = normalizeInput(businessData.businessType);
    const rawNature = normalizeInput(businessData.natureOfBusiness);
    const rawReason = normalizeInput(businessData.reasonForRegistration);
    const rawScheme = normalizeInput(businessData.compositionScheme);

    return {
      legalName: businessData.legalName,
      tradeName: businessData.businessName,
      constitutionOfBusiness: getMappedValue(
        rawConstitution,
        CONSTITUTION_MAP,
        "PROPRIETORSHIP",
      ),
      natureOfBusiness: getMappedValue(
        rawNature,
        NATURE_MAP,
        "SERVICE_PROVIDER",
      ),
      dateOfCommencement: formatBackendDate(businessData.businessStartDate),
      reasonForRegistration: getMappedValue(
        rawReason,
        REASON_MAP,
        "VOLUNTARY_REGISTRATION",
      ),
      compositionScheme: rawScheme.includes("YES")
        ? "YES_COMPOSITION_SCHEME"
        : "NO_REGULAR_SCHEME",
      placeOfBusiness: "PRINCIPAL_PLACE_OF_BUSINESS",
      businessAddress: businessData.businessAddress,
      city: businessData.city,
      district: businessData.district,
      state: businessData.state,
      pinCode: businessData.pinCode,
      hsnSac: businessData.hsnCode,
      accountHolderName: businessData.accountHolderName,
      bankAccountNumber: businessData.bankAccountNumber,
      ifscCode: businessData.ifscCode,
      bankName: businessData.bankName,
      branchName: businessData.branchName,
      accountType: normalizeInput(businessData.accountType) || "CURRENT",
      authorisedSignatory: businessData.signatoryName ? "YES" : "NO",
      signatoryName: businessData.signatoryName || businessData.legalName,
      signatoryPan: businessData.signatoryPan,
      signatoryDob: formatBackendDate(businessData.signatoryDob),
      designation: businessData.signatoryDesignation || "Owner",
      signatoryMobile: businessData.signatoryMobile,
      signatoryEmail: businessData.signatoryEmail,
    };
  } catch (error) {
    console.error("Payload Mapping Exception:", error);
    // In production, throw a standardized AppError so the UI layer's try-catch can show a toast
    throw new Error("Failed to process registration data for submission.");
  }
};

/**
 * Clean dictionary mapping for Document Upload Types
 */
const DOC_TYPE_MAP: Record<string, string> = {
  PAN: "PAN_CARD",
  AADHAAR: "AADHAAR_CARD",
  ADDRESS_PROOF: "PRINCIPAL_PLACE_ADDRESS_PROOF",
  BUSINESS_PROOF: "BUSINESS_REGISTRATION_PROOF",
  BANK_STATEMENT: "BANK_PASSBOOK_OR_CANCELLED_CHEQUE",
  BANK_PROOF: "BANK_PASSBOOK_OR_CANCELLED_CHEQUE",
  PHOTOGRAPH: "PASSPORT_SIZE_PHOTOGRAPH",
  AUTHORIZATION_PROOF: "PASSPORT_SIZE_PHOTOGRAPH",
};

export const mapDocumentType = (docId: string, subtitle?: string) => {
  const rawId = normalizeInput(docId);
  const type = getMappedValue(rawId, DOC_TYPE_MAP, rawId);

  // Specific condition: If it's address proof, the subtype is the actual proof name
  const subType =
    type === "PRINCIPAL_PLACE_ADDRESS_PROOF"
      ? normalizeInput(subtitle || "")
      : "";

  return { type, subType };
};
