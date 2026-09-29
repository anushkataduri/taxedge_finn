/**
 * Component: GstBusinessStep
 * Refactored: Modular Architecture (< 200 lines). Replaced 8 manual modals and custom calendar with modular Form elements.
 */
 
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "./GstBusinessStep.styles";
import { UniversalDatePicker } from "@/shared/components/UniversalDatePicker";
import { FormInput, FormSelect } from "./GstFormElements";
 
const BUSINESS_TYPES = [
  "Proprietorship",
  "Partnership Firm",
  "Limited Liability Partnership (LLP)",
  "Private Limited Company",
  "Public Limited Company",
  "HUF",
  "Society / Trust / Club",
  "AOP / BOI",
  "Government Department",
  "Foreign Company",
  "One Person Company (OPC)",
];
const NATURE_OF_BUSINESS = [
  "Trader",
  "Manufacturer",
  "Service Provider",
  "Wholesaler / Distributor",
  "Retailer",
  "Exporter / Importer",
  "Contractor / Freelancer",
];
const REASONS = [
  "Crossed turnover threshold",
  "Voluntary registration",
  "Inter-state supply",
  "E-commerce operator / seller",
  "Casual taxable person",
  "Input Service Distributor",
];
const COMPOSITION_OPTIONS = ["No - regular scheme", "Yes - composition scheme"];
const PLACE_OPTIONS = [
  "Principal place of business",
  "Additional place of business",
];
const STATE_OPTIONS = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
];
const BANK_OPTIONS = [
  "Axis Bank",
  "HDFC Bank",
  "ICICI Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "State Bank of India",
];
const ACCOUNT_TYPES = ["Current", "Savings", "Cash Credit / OD"];
 
export interface GstBusinessFormData {
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
 
interface Props {
  data: GstBusinessFormData;
  onChange: (fields: Partial<GstBusinessFormData>) => void;
  onBlurField?: (field: keyof GstBusinessFormData) => void;
  errors?: Record<string, string>;
}
 
export const GstBusinessStep: React.FC<Props> = ({
  data,
  onChange,
  onBlurField,
  errors = {},
}) => {
  const [isBankExpanded, setIsBankExpanded] = useState(false);
  const [isSignatoryExpanded, setIsSignatoryExpanded] = useState(false);
 
  useEffect(() => {
    if (
      errors.accountHolderName ||
      errors.bankAccountNumber ||
      errors.confirmBankAccountNumber ||
      errors.ifscCode ||
      errors.bankName ||
      errors.branchName ||
      errors.accountType
    )
      setIsBankExpanded(true);
  }, [errors]);
 
  useEffect(() => {
    if (
      errors.signatoryName ||
      errors.signatoryPan ||
      errors.signatoryDob ||
      errors.signatoryDesignation ||
      errors.signatoryMobile ||
      errors.signatoryEmail
    )
      setIsSignatoryExpanded(true);
  }, [errors]);
 
  return (
    <View style={styles.container}>
      {/* Primary Business Details */}
      <FormInput
        label="Legal Name of Business (as per PAN) *"
        value={data.legalName}
        onChange={(t) => onChange({ legalName: t })}
        onBlur={() => onBlurField?.("legalName")}
        error={errors.legalName}
        placeholder="Exactly as on the PAN card"
      />
      <FormInput
        label="Trade Name *"
        value={data.businessName}
        onChange={(t) => onChange({ businessName: t })}
        onBlur={() => onBlurField?.("businessName")}
        error={errors.businessName}
        placeholder="Enter your business / trade name"
      />
      <FormSelect
        label="Constitution of Business *"
        value={data.businessType}
        options={BUSINESS_TYPES}
        onChange={(t) => onChange({ businessType: t })}
        error={errors.businessType}
        placeholder="Select business type"
      />
      <FormSelect
        label="Nature of Business *"
        value={data.natureOfBusiness}
        options={NATURE_OF_BUSINESS}
        onChange={(t) => onChange({ natureOfBusiness: t })}
        error={errors.natureOfBusiness}
        placeholder="Select nature of business"
      />
 
      <UniversalDatePicker
        label="Date of Commencement of Business *"
        value={data.businessStartDate}
        onChange={(d) => onChange({ businessStartDate: d })}
        error={errors.businessStartDate}
        valueFormat="DD-MM-YYYY"
        placeholder="DD-MM-YYYY"
      />
 
      <FormSelect
        label="Reason for Registration *"
        value={data.reasonForRegistration}
        options={REASONS}
        onChange={(t) => onChange({ reasonForRegistration: t })}
        error={errors.reasonForRegistration}
        placeholder="Select a reason"
      />
      <FormSelect
        label="Opting for Composition Scheme? *"
        value={data.compositionScheme}
        options={COMPOSITION_OPTIONS}
        onChange={(t) => onChange({ compositionScheme: t })}
        error={errors.compositionScheme}
        placeholder="Select yes or no"
      />
      <FormSelect
        label="Place of Business *"
        value={data.placeOfBusiness}
        options={PLACE_OPTIONS}
        onChange={(t) => onChange({ placeOfBusiness: t })}
        error={errors.placeOfBusiness}
        placeholder="Select place type"
      />
      <FormInput
        label="Business Address *"
        value={data.businessAddress}
        onChange={(t) => onChange({ businessAddress: t })}
        onBlur={() => onBlurField?.("businessAddress")}
        error={errors.businessAddress}
        placeholder="Building, street, locality"
      />
 
      <View style={styles.row}>
        <View style={styles.halfField}>
          <FormInput
            label="City *"
            value={data.city}
            onChange={(t) => onChange({ city: t })}
            onBlur={() => onBlurField?.("city")}
            error={errors.city}
            placeholder="City"
          />
        </View>
        <View style={styles.halfField}>
          <FormInput
            label="District *"
            value={data.district}
            onChange={(t) => onChange({ district: t })}
            onBlur={() => onBlurField?.("district")}
            error={errors.district}
            placeholder="District"
          />
        </View>
      </View>
 
      <View style={styles.row}>
        <View style={styles.halfField}>
          <FormSelect
            label="State / UT *"
            value={data.state}
            options={STATE_OPTIONS}
            onChange={(t) => onChange({ state: t })}
            error={errors.state}
            placeholder="Select"
          />
        </View>
        <View style={styles.halfField}>
          <FormInput
            label="PIN Code *"
            value={data.pinCode}
            onChange={(t) => onChange({ pinCode: t.replace(/\D/g, "") })}
            onBlur={() => onBlurField?.("pinCode")}
            error={errors.pinCode}
            placeholder="560001"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      </View>
 
      <FormInput
        label="Primary HSN / SAC Code *"
        value={data.hsnCode}
        onChange={(t) => onChange({ hsnCode: t.replace(/\D/g, "") })}
        onBlur={() => onBlurField?.("hsnCode")}
        error={errors.hsnCode}
        placeholder="e.g. 998311"
        keyboardType="numeric"
        maxLength={8}
      />
 
      {/* Bank Details Accordion */}
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.7}
        onPress={() => setIsBankExpanded(!isBankExpanded)}
      >
        <Text style={styles.accordionTitle}>Bank Details</Text>
        <Ionicons
          name={isBankExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={BrandColors.TEXT_PRIMARY}
        />
      </TouchableOpacity>
 
      {isBankExpanded && (
        <View style={styles.accordionContent}>
          <FormInput
            label="Account Holder Name *"
            value={data.accountHolderName}
            onChange={(t) => onChange({ accountHolderName: t })}
            onBlur={() => onBlurField?.("accountHolderName")}
            error={errors.accountHolderName}
            placeholder="As per bank records"
          />
          <FormInput
            label="Bank Account Number *"
            value={data.bankAccountNumber}
            onChange={(t) =>
              onChange({ bankAccountNumber: t.replace(/\D/g, "") })
            }
            onBlur={() => onBlurField?.("bankAccountNumber")}
            error={errors.bankAccountNumber}
            placeholder="Enter account number"
            keyboardType="numeric"
            maxLength={18}
          />
          <FormInput
            label="Confirm Account Number *"
            value={data.confirmBankAccountNumber}
            onChange={(t) =>
              onChange({ confirmBankAccountNumber: t.replace(/\D/g, "") })
            }
            onBlur={() => onBlurField?.("confirmBankAccountNumber")}
            error={errors.confirmBankAccountNumber}
            placeholder="Re-enter account number"
            keyboardType="numeric"
            maxLength={18}
          />
          <FormInput
            label="IFSC Code *"
            value={data.ifscCode}
            onChange={(t) =>
              onChange({
                ifscCode: t.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
              })
            }
            onBlur={() => onBlurField?.("ifscCode")}
            error={errors.ifscCode}
            placeholder="e.g. HDFC0001234"
            autoCapitalize="characters"
            maxLength={11}
          />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <FormSelect
                label="Bank Name *"
                value={data.bankName}
                options={BANK_OPTIONS}
                onChange={(t) => onChange({ bankName: t })}
                error={errors.bankName}
                placeholder="Select"
              />
            </View>
            <View style={styles.halfField}>
              <FormInput
                label="Branch *"
                value={data.branchName}
                onChange={(t) => onChange({ branchName: t })}
                onBlur={() => onBlurField?.("branchName")}
                error={errors.branchName}
                placeholder="Branch Name"
              />
            </View>
          </View>
          <FormSelect
            label="Account Type *"
            value={data.accountType}
            options={ACCOUNT_TYPES}
            onChange={(t) => onChange({ accountType: t })}
            error={errors.accountType}
            placeholder="Select account type"
          />
        </View>
      )}
 
      {/* Authorised Signatory Accordion */}
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.7}
        onPress={() => setIsSignatoryExpanded(!isSignatoryExpanded)}
      >
        <Text style={styles.accordionTitle}>Authorised Signatory</Text>
        <Ionicons
          name={isSignatoryExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={BrandColors.TEXT_PRIMARY}
        />
      </TouchableOpacity>
 
      {isSignatoryExpanded && (
        <View style={styles.accordionContent}>
          <FormInput
            label="Signatory Name *"
            value={data.signatoryName}
            onChange={(t) => onChange({ signatoryName: t })}
            onBlur={() => onBlurField?.("signatoryName")}
            error={errors.signatoryName}
            placeholder="Full name"
          />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <FormInput
                label="Signatory PAN *"
                value={data.signatoryPan}
                onChange={(t) => onChange({ signatoryPan: t.toUpperCase() })}
                onBlur={() => onBlurField?.("signatoryPan")}
                error={errors.signatoryPan}
                placeholder="ABCDE1234F"
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>
            <View style={styles.halfField}>
              <UniversalDatePicker
                label="Date of Birth *"
                value={data.signatoryDob}
                onChange={(d) => onChange({ signatoryDob: d })}
                error={errors.signatoryDob}
                valueFormat="DD-MM-YYYY"
                placeholder="DD-MM-YYYY"
              />
            </View>
          </View>
          <FormInput
            label="Designation *"
            value={data.signatoryDesignation}
            onChange={(t) => onChange({ signatoryDesignation: t })}
            onBlur={() => onBlurField?.("signatoryDesignation")}
            error={errors.signatoryDesignation}
            placeholder="Proprietor / Director / Partner"
          />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <FormInput
                label="Signatory Mobile *"
                value={data.signatoryMobile}
                onChange={(t) =>
                  onChange({ signatoryMobile: t.replace(/\D/g, "") })
                }
                onBlur={() => onBlurField?.("signatoryMobile")}
                error={errors.signatoryMobile}
                placeholder="10-digit"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={styles.halfField}>
              <FormInput
                label="Signatory Email *"
                value={data.signatoryEmail}
                onChange={(t) => onChange({ signatoryEmail: t })}
                onBlur={() => onBlurField?.("signatoryEmail")}
                error={errors.signatoryEmail}
                placeholder="email@business.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>
      )}
 
      {/* Consent Checkbox */}
      <View style={styles.consentRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChange({ aadhaarConsent: !data.aadhaarConsent })}
          style={styles.checkboxTouch}
        >
          <Ionicons
            name={data.aadhaarConsent ? "checkbox" : "square-outline"}
            size={24}
            color={data.aadhaarConsent ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
          />
        </TouchableOpacity>
        <Text style={styles.consentText}>
          I consent to Aadhaar authentication (e-KYC) for this GST registration.
        </Text>
      </View>
      {errors.aadhaarConsent ? (
        <Text style={[styles.errorText, { marginBottom: 14 }]}>
          {errors.aadhaarConsent}
        </Text>
      ) : null}
    </View>
  );
};
 