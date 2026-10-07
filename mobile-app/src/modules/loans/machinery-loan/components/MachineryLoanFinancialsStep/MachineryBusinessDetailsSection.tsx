import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanBusinessFormData } from "../../../types/loans.types";
import { Dropdown } from "../../../../../shared/components/Dropdown";
import { styles } from "./MachineryLoanFinancialsStep.styles";

export interface MachineryBusinessDetailsSectionProps {
  businessData: LoanBusinessFormData;
  onBusinessChange: (field: keyof LoanBusinessFormData, value: any) => void;
  errors?: Record<string, string>;
}

export const BUSINESS_TYPE_OPTIONS = [
  "Proprietorship",
  "Partnership",
  "LLP",
  "Private Limited",
  "Other",
];

export const BUSINESS_VINTAGE_OPTIONS = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

export const MachineryBusinessDetailsSection: React.FC<MachineryBusinessDetailsSectionProps> = ({
  businessData,
  onBusinessChange,
  errors = {},
}) => {
  const isOtherBusinessType =
    businessData.businessType === "Other" ||
    (Boolean(businessData.businessType) &&
      !BUSINESS_TYPE_OPTIONS.slice(0, -1).includes(businessData.businessType || ""));

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="briefcase" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>Business Profile & Enterprise Identity</Text>
        </View>
      </View>

      {/* Business / Plant Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Business / Plant Name <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, Boolean(errors.businessName) && styles.inputError]}
          placeholder="Enter business name"
          placeholderTextColor="#94A3B8"
          value={businessData.businessName}
          onChangeText={(text) => onBusinessChange("businessName", text)}
        />
        {Boolean(errors.businessName) && (
          <Text style={styles.errorText}>{errors.businessName}</Text>
        )}
      </View>

      {/* Business Type */}
      <View style={styles.fieldGroup}>
        <Dropdown
          label="Business Type"
          required
          placeholder="Select business type"
          options={BUSINESS_TYPE_OPTIONS}
          value={
            isOtherBusinessType && businessData.businessType !== "Other"
              ? "Other"
              : businessData.businessType
          }
          onSelect={(val) => {
            if (val === "Other") {
              onBusinessChange("businessType", "Other");
            } else {
              onBusinessChange("businessType", val);
              onBusinessChange("otherBusinessType", "");
            }
          }}
          error={errors.businessType}
        />

        {isOtherBusinessType && (
          <View style={styles.customFieldWrapper}>
            <Text style={styles.label}>
              Specify Business Type <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                Boolean(errors.otherBusinessType) && styles.inputError,
              ]}
              placeholder="e.g. Trust / Co-operative Society"
              placeholderTextColor="#94A3B8"
              value={
                businessData.otherBusinessType ||
                (businessData.businessType !== "Other" ? businessData.businessType : "")
              }
              onChangeText={(text) => {
                onBusinessChange("otherBusinessType", text);
                onBusinessChange("businessType", text || "Other");
              }}
            />
            {Boolean(errors.otherBusinessType) && (
              <Text style={styles.errorText}>{errors.otherBusinessType}</Text>
            )}
          </View>
        )}
      </View>

      {/* Business Vintage */}
      <View style={styles.fieldGroup}>
        <Dropdown
          label="Business Vintage"
          required
          placeholder="Select vintage"
          options={BUSINESS_VINTAGE_OPTIONS}
          value={businessData.businessVintageYears}
          onSelect={(val) => onBusinessChange("businessVintageYears", val)}
          error={errors.businessVintageYears}
        />
      </View>

      {/* Annual Turnover */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Annual Turnover <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, Boolean(errors.annualTurnover) && styles.inputError]}
          placeholder="Enter annual turnover (₹)"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={businessData.annualTurnover}
          onChangeText={(text) => onBusinessChange("annualTurnover", text)}
        />
        {Boolean(errors.annualTurnover) && (
          <Text style={styles.errorText}>{errors.annualTurnover}</Text>
        )}
      </View>

      {/* GST Registered? (Two Separate Bordered Boxes) */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>GST Registered?</Text>
        <View style={styles.twoBoxRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onBusinessChange("isGstRegistered", true)}
            style={[
              styles.separateBox,
              businessData.isGstRegistered === true && styles.separateBoxActive,
            ]}
          >
            <Text
              style={[
                styles.separateBoxText,
                businessData.isGstRegistered === true && styles.separateBoxTextActive,
              ]}
            >
              YES
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onBusinessChange("isGstRegistered", false);
              onBusinessChange("gstin", "");
            }}
            style={[
              styles.separateBox,
              businessData.isGstRegistered === false && styles.separateBoxActive,
            ]}
          >
            <Text
              style={[
                styles.separateBoxText,
                businessData.isGstRegistered === false && styles.separateBoxTextActive,
              ]}
            >
              NO
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditional GSTIN */}
      {businessData.isGstRegistered && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            GSTIN <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, Boolean(errors.gstin) && styles.inputError]}
            placeholder="Enter GSTIN (e.g. 24AABCP1234F1Z9)"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            maxLength={15}
            value={businessData.gstin}
            onChangeText={(text) => onBusinessChange("gstin", text.toUpperCase())}
          />
          {Boolean(errors.gstin) && (
            <Text style={styles.errorText}>{errors.gstin}</Text>
          )}
        </View>
      )}
    </View>
  );
};
