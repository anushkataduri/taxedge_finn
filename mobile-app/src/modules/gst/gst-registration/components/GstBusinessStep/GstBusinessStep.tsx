/**
 * Component: GstBusinessStep
 * Refactored: Functional modular architecture with strict TypeScript concepts,
 * helper functions, DRY renderers, and robust exception handling (< 400 lines).
 */

import React, { useState, useEffect, useCallback, memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "./GstBusinessStep.styles";
import { UniversalDatePicker } from "@/shared/components/UniversalDatePicker";
import { FormInput, FormSelect } from "./GstFormElements";

// --- CONSTANTS WITH 'as const' FOR STRICT TYPESCRIPT INFERENCE ---

export const BUSINESS_TYPES = [
  "Proprietorship", "Partnership Firm", "Limited Liability Partnership (LLP)",
  "Private Limited Company", "Public Limited Company", "HUF",
  "Society / Trust / Club", "AOP / BOI", "Government Department",
  "Foreign Company", "One Person Company (OPC)",
] as const;

export const NATURE_OF_BUSINESS = [
  "Trader", "Manufacturer", "Service Provider", "Wholesaler / Distributor",
  "Retailer", "Exporter / Importer", "Contractor / Freelancer",
] as const;

export const REASONS = [
  "Crossed turnover threshold", "Voluntary registration", "Inter-state supply",
  "E-commerce operator / seller", "Casual taxable person", "Input Service Distributor",
] as const;

export const COMPOSITION_OPTIONS = ["No - regular scheme", "Yes - composition scheme"] as const;
export const PLACE_OPTIONS = ["Principal place of business", "Additional place of business"] as const;
export const STATE_OPTIONS = [
  "Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Maharashtra", "Tamil Nadu", "Telangana",
] as const;
export const BANK_OPTIONS = [
  "Axis Bank", "HDFC Bank", "ICICI Bank", "Kotak Mahindra Bank", "Punjab National Bank", "State Bank of India",
] as const;
export const ACCOUNT_TYPES = ["Current", "Savings", "Cash Credit / OD"] as const;

// Derived Union Types
export type BusinessType = (typeof BUSINESS_TYPES)[number];
export type NatureOfBusiness = (typeof NATURE_OF_BUSINESS)[number];
export type ReasonForRegistration = (typeof REASONS)[number];
export type CompositionOption = (typeof COMPOSITION_OPTIONS)[number];
export type PlaceOption = (typeof PLACE_OPTIONS)[number];
export type StateOption = (typeof STATE_OPTIONS)[number];
export type BankOption = (typeof BANK_OPTIONS)[number];
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export interface GstBusinessFormData {
  gstId?: string;
  customerId?: string;
  legalName: string;
  businessName: string;
  businessType: string;
  natureOfBusiness: string;
  placeOfBusiness: string;
  businessStartDate: string;
  reasonForRegistration: string;
  compositionScheme: string;
  businessAddress: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  hsnCode: string;
  accountHolderName: string;
  bankAccountNumber: string;
  confirmBankAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: string;
  signatoryName: string;
  signatoryPan: string;
  signatoryDob: string;
  signatoryDesignation: string;
  signatoryMobile: string;
  signatoryEmail: string;
  addressProofType: string;
  aadhaarConsent: boolean;
}

export type FormErrors = Partial<Record<keyof GstBusinessFormData, string>>;

// Field keys for automated accordion error expansion
const BANK_FIELD_KEYS: readonly (keyof GstBusinessFormData)[] = [
  "accountHolderName", "bankAccountNumber", "confirmBankAccountNumber",
  "ifscCode", "bankName", "branchName", "accountType",
];

const SIGNATORY_FIELD_KEYS: readonly (keyof GstBusinessFormData)[] = [
  "signatoryName", "signatoryPan", "signatoryDob",
  "signatoryDesignation", "signatoryMobile", "signatoryEmail",
];

// --- EXCEPTION HANDLING & SANITIZATION UTILITIES ---

function safeTransform(value: unknown, transformer: (val: string) => string): string {
  try {
    if (value === null || value === undefined) return "";
    return transformer(typeof value === "string" ? value : String(value));
  } catch (error) {
    console.error("Input transformation failed:", error);
    return typeof value === "string" ? value : "";
  }
}

const sanitizeDigits = (val: string): string => safeTransform(val, (s) => s.replace(/\D/g, ""));
const sanitizeAlphanumericUpper = (val: string): string => safeTransform(val, (s) => s.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
const sanitizeUpper = (val: string): string => safeTransform(val, (s) => s.toUpperCase());

// --- FUNCTIONAL ACCORDION COMPONENT ---

interface AccordionSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = memo(({ title, isExpanded, onToggle, children }) => (
  <>
    <TouchableOpacity
      style={styles.accordionHeader}
      activeOpacity={0.7}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
    >
      <Text style={styles.accordionTitle}>{title}</Text>
      <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={BrandColors.TEXT_PRIMARY} />
    </TouchableOpacity>
    {isExpanded && <View style={styles.accordionContent}>{children}</View>}
  </>
));
AccordionSection.displayName = "AccordionSection";

// --- PROPS INTERFACE ---

interface Props {
  data: GstBusinessFormData;
  onChange: (fields: Partial<GstBusinessFormData>) => void;
  onBlurField?: (field: keyof GstBusinessFormData) => void;
  errors?: FormErrors;
}

// --- MAIN COMPONENT ---

export const GstBusinessStep: React.FC<Props> = ({ data, onChange, onBlurField, errors = {} }) => {
  const [isBankExpanded, setIsBankExpanded] = useState(false);
  const [isSignatoryExpanded, setIsSignatoryExpanded] = useState(false);

  useEffect(() => {
    try {
      if (BANK_FIELD_KEYS.some((field) => Boolean(errors[field]))) setIsBankExpanded(true);
    } catch (err) {
      console.error("Failed to evaluate bank errors:", err);
    }
  }, [errors]);

  useEffect(() => {
    try {
      if (SIGNATORY_FIELD_KEYS.some((field) => Boolean(errors[field]))) setIsSignatoryExpanded(true);
    } catch (err) {
      console.error("Failed to evaluate signatory errors:", err);
    }
  }, [errors]);

  const updateField = useCallback(
    <K extends keyof GstBusinessFormData>(field: K, value: GstBusinessFormData[K]) => {
      try {
        onChange({ [field]: value });
      } catch (err) {
        console.error(`Error updating field "${String(field)}":`, err);
      }
    },
    [onChange],
  );

  const blurField = useCallback(
    (field: keyof GstBusinessFormData) => {
      try {
        onBlurField?.(field);
      } catch (err) {
        console.error(`Error blurring field "${String(field)}":`, err);
      }
    },
    [onBlurField],
  );

  const renderInput = useCallback(
    (
      field: keyof GstBusinessFormData,
      label: string,
      placeholder: string,
      options?: {
        keyboardType?: "default" | "numeric" | "email-address";
        maxLength?: number;
        autoCapitalize?: "none" | "sentences" | "words" | "characters";
        transform?: (val: string) => string;
      },
    ) => {
      const val = (data?.[field] as string) ?? "";
      return (
        <FormInput
          key={field}
          label={label}
          value={val}
          onChange={(t) => updateField(field, (options?.transform ? options.transform(t) : t) as any)}
          onBlur={() => blurField(field)}
          error={errors?.[field]}
          placeholder={placeholder}
          keyboardType={options?.keyboardType}
          maxLength={options?.maxLength}
          autoCapitalize={options?.autoCapitalize}
        />
      );
    },
    [data, errors, updateField, blurField],
  );

  const renderSelect = useCallback(
    (field: keyof GstBusinessFormData, label: string, placeholder: string, options: readonly string[]) => {
      const val = (data?.[field] as string) ?? "";
      return (
        <FormSelect
          key={field}
          label={label}
          value={val}
          options={options as string[]}
          onChange={(t) => updateField(field, t as any)}
          error={errors?.[field]}
          placeholder={placeholder}
        />
      );
    },
    [data, errors, updateField],
  );

  const renderDatePicker = useCallback(
    (field: keyof GstBusinessFormData, label: string) => {
      const val = (data?.[field] as string) ?? "";
      return (
        <UniversalDatePicker
          key={field}
          label={label}
          value={val}
          onChange={(d) => updateField(field, d as any)}
          error={errors?.[field]}
          valueFormat="DD-MM-YYYY"
          placeholder="DD-MM-YYYY"
        />
      );
    },
    [data, errors, updateField],
  );

  const renderPrimaryDetails = () => (
    <>
      {renderInput("legalName", "Legal Name of Business (as per PAN) *", "Exactly as on the PAN card")}
      {renderInput("businessName", "Trade Name *", "Enter your business / trade name")}
      {renderSelect("businessType", "Constitution of Business *", "Select business type", BUSINESS_TYPES)}
      {renderSelect("natureOfBusiness", "Nature of Business *", "Select nature of business", NATURE_OF_BUSINESS)}
      {renderDatePicker("businessStartDate", "Date of Commencement of Business *")}
      {renderSelect("reasonForRegistration", "Reason for Registration *", "Select a reason", REASONS)}
      {renderSelect("compositionScheme", "Opting for Composition Scheme? *", "Select yes or no", COMPOSITION_OPTIONS)}
      {renderSelect("placeOfBusiness", "Place of Business *", "Select place type", PLACE_OPTIONS)}
    </>
  );

  const renderAddressSection = () => (
    <>
      {renderInput("businessAddress", "Business Address *", "Building, street, locality")}
      <View style={styles.row}>
        <View style={styles.halfField}>{renderInput("city", "City *", "City")}</View>
        <View style={styles.halfField}>{renderInput("district", "District *", "District")}</View>
      </View>
      <View style={styles.row}>
        <View style={styles.halfField}>{renderSelect("state", "State / UT *", "Select", STATE_OPTIONS)}</View>
        <View style={styles.halfField}>
          {renderInput("pinCode", "PIN Code *", "560001", { keyboardType: "numeric", maxLength: 6, transform: sanitizeDigits })}
        </View>
      </View>
      {renderInput("hsnCode", "Primary HSN / SAC Code *", "e.g. 998311", { keyboardType: "numeric", maxLength: 8, transform: sanitizeDigits })}
    </>
  );

  const renderBankDetails = () => (
    <AccordionSection title="Bank Details" isExpanded={isBankExpanded} onToggle={() => setIsBankExpanded((p) => !p)}>
      {renderInput("accountHolderName", "Account Holder Name *", "As per bank records")}
      {renderInput("bankAccountNumber", "Bank Account Number *", "Enter account number", { keyboardType: "numeric", maxLength: 18, transform: sanitizeDigits })}
      {renderInput("confirmBankAccountNumber", "Confirm Account Number *", "Re-enter account number", { keyboardType: "numeric", maxLength: 18, transform: sanitizeDigits })}
      {renderInput("ifscCode", "IFSC Code *", "e.g. HDFC0001234", { autoCapitalize: "characters", maxLength: 11, transform: sanitizeAlphanumericUpper })}
      <View style={styles.row}>
        <View style={styles.halfField}>{renderSelect("bankName", "Bank Name *", "Select", BANK_OPTIONS)}</View>
        <View style={styles.halfField}>{renderInput("branchName", "Branch *", "Branch Name")}</View>
      </View>
      {renderSelect("accountType", "Account Type *", "Select account type", ACCOUNT_TYPES)}
    </AccordionSection>
  );

  const renderSignatoryDetails = () => (
    <AccordionSection title="Authorised Signatory" isExpanded={isSignatoryExpanded} onToggle={() => setIsSignatoryExpanded((p) => !p)}>
      {renderInput("signatoryName", "Signatory Name *", "Full name")}
      <View style={styles.row}>
        <View style={styles.halfField}>
          {renderInput("signatoryPan", "Signatory PAN *", "ABCDE1234F", { autoCapitalize: "characters", maxLength: 10, transform: sanitizeUpper })}
        </View>
        <View style={styles.halfField}>{renderDatePicker("signatoryDob", "Date of Birth *")}</View>
      </View>
      {renderInput("signatoryDesignation", "Designation *", "Proprietor / Director / Partner")}
      <View style={styles.row}>
        <View style={styles.halfField}>
          {renderInput("signatoryMobile", "Signatory Mobile *", "10-digit", { keyboardType: "numeric", maxLength: 10, transform: sanitizeDigits })}
        </View>
        <View style={styles.halfField}>
          {renderInput("signatoryEmail", "Signatory Email *", "email@business.com", { keyboardType: "email-address", autoCapitalize: "none" })}
        </View>
      </View>
    </AccordionSection>
  );

  const renderConsentSection = () => {
    const isChecked = Boolean(data?.aadhaarConsent);
    return (
      <>
        <View style={styles.consentRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => updateField("aadhaarConsent", !isChecked)}
            style={styles.checkboxTouch}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
          >
            <Ionicons name={isChecked ? "checkbox" : "square-outline"} size={24} color={isChecked ? BrandColors.PRIMARY_ORANGE : "#94A3B8"} />
          </TouchableOpacity>
          <Text style={styles.consentText}>I consent to Aadhaar authentication (e-KYC) for this GST registration.</Text>
        </View>
        {errors?.aadhaarConsent ? (
          <Text style={[styles.errorText, styles.errorTextMarginBottom]}>{errors.aadhaarConsent}</Text>
        ) : null}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderPrimaryDetails()}
      {renderAddressSection()}
      {renderBankDetails()}
      {renderSignatoryDetails()}
      {renderConsentSection()}
    </View>
  );
};