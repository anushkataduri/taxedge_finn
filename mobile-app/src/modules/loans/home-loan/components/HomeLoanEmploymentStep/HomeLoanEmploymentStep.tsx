import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanEmploymentType,
} from "../../../types/loans.types";
import { styles } from "./HomeLoanEmploymentStep.styles";

export interface HomeLoanEmploymentStepProps {
  data: LoanDetailsFormData;
  onChangeDetails: (field: keyof LoanDetailsFormData, value: any) => void;
  businessData: LoanBusinessFormData;
  onChangeBusiness: (field: keyof LoanBusinessFormData, value: string) => void;
  errors?: Record<string, string>;
}

const EMPLOYMENT_TYPES: { label: string; value: LoanEmploymentType }[] = [
  { label: "Salaried", value: "Salaried" },
  { label: "Self-Employed Pro", value: "Self-Employed Professional" },
  { label: "Business Owner", value: "Business Owner" },
];

export const HomeLoanEmploymentStep: React.FC<HomeLoanEmploymentStepProps> = ({
  data,
  onChangeDetails,
  businessData,
  onChangeBusiness,
  errors = {},
}) => {
  const isBusinessOrSelfEmployed =
    data.employmentType === "Business Owner" ||
    data.employmentType === "Self-Employed Professional";

  return (
    <View style={styles.container}>
      {/* 1. Employment / Income Category Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Employment & Income Category</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Select your occupation type. Underwriting checks and required financial proofs adapt based on this selection.
        </Text>

        <View style={styles.fieldGroup}>
          <View style={styles.pillRow}>
            {EMPLOYMENT_TYPES.map((item) => {
              const isSelected = Boolean(data.employmentType) && data.employmentType === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.7}
                  onPress={() => onChangeDetails("employmentType", item.value)}
                  style={[styles.pill, isSelected && styles.pillActive]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.employmentType && (
            <Text style={styles.errorText}>{errors.employmentType}</Text>
          )}
        </View>
      </View>

      {/* 2. Monthly Income / Turnover Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="cash-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Monthly Household Income</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Enter monthly take-home salary or net business surplus after taxes.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Monthly Net Income (₹) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              errors.monthlyIncomeOrTurnover && styles.inputError,
            ]}
            placeholder="Enter monthly net income (₹)"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={data.monthlyIncomeOrTurnover}
            onChangeText={(text) =>
              onChangeDetails("monthlyIncomeOrTurnover", text)
            }
          />
          {errors.monthlyIncomeOrTurnover && (
            <Text style={styles.errorText}>
              {errors.monthlyIncomeOrTurnover}
            </Text>
          )}
        </View>
      </View>

      {/* 3. Business Details Card (conditionally displayed if Non-Salaried) */}
      {isBusinessOrSelfEmployed && (
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons
                name="business-outline"
                size={20}
                color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
              />
              <Text style={styles.cardTitle}>Business Profile & Compliance</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            Provide enterprise details per Section 10 of loan underwriting requirements.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Legal Business / Firm Name</Text>
            <TextInput
              style={[
                styles.input,
                errors.businessName && styles.inputError,
              ]}
              placeholder="Enter legal business / firm name"
              placeholderTextColor="#94A3B8"
              value={businessData.businessName}
              onChangeText={(text) => onChangeBusiness("businessName", text)}
            />
            {errors.businessName && (
              <Text style={styles.errorText}>{errors.businessName}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>GSTIN (15 Digits)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 15-digit GSTIN (e.g. 27ABCDE1234F1Z5)"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              maxLength={15}
              value={businessData.gstin}
              onChangeText={(text) =>
                onChangeBusiness("gstin", text.toUpperCase())
              }
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Udyam Registration Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Udyam number (e.g. UDYAM-MH-01-0012345)"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={businessData.udyamRegistration}
              onChangeText={(text) =>
                onChangeBusiness("udyamRegistration", text.toUpperCase())
              }
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Business Vintage (in Years)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter business vintage in years"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={businessData.businessVintageYears}
              onChangeText={(text) =>
                onChangeBusiness("businessVintageYears", text)
              }
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Annual Turnover (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter annual turnover (₹)"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={businessData.annualTurnover}
              onChangeText={(text) => onChangeBusiness("annualTurnover", text)}
            />
          </View>
        </View>
      )}

      {/* 4. Existing Loans & Monthly Obligations Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="card-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Existing Loan Obligations</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Indicate if you have active ongoing loans or EMIs. Lenders use this to verify debt servicing capacity.
        </Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => onChangeDetails("hasExistingLoans", false)}
            style={[
              styles.toggleButton,
              !data.hasExistingLoans && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                !data.hasExistingLoans && styles.toggleTextActive,
              ]}
            >
              No Other EMIs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChangeDetails("hasExistingLoans", true)}
            style={[
              styles.toggleButton,
              data.hasExistingLoans && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                data.hasExistingLoans && styles.toggleTextActive,
              ]}
            >
              Yes, Paying EMIs
            </Text>
          </TouchableOpacity>
        </View>

        {data.hasExistingLoans && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Total Ongoing Monthly EMI (₹) <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.existingEmi && styles.inputError]}
              placeholder="Enter total monthly EMI amount (₹)"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.existingEmi}
              onChangeText={(text) => onChangeDetails("existingEmi", text)}
            />
            {errors.existingEmi && (
              <Text style={styles.errorText}>{errors.existingEmi}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeLoanEmploymentStep;
