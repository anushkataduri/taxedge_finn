import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanBusinessFormData,
  LoanEmploymentType,
} from "../../../types/loans.types";
import { VehicleLoanDetailsFormData } from "../../types/vehicleLoan.types";
import { styles } from "./VehicleLoanEmploymentStep.styles";

export interface VehicleLoanEmploymentStepProps {
  data: VehicleLoanDetailsFormData;
  onChangeDetails: (field: keyof VehicleLoanDetailsFormData, value: any) => void;
  businessData: LoanBusinessFormData;
  onChangeBusiness: (field: keyof LoanBusinessFormData, value: string) => void;
  errors?: Record<string, string>;
}

const EMPLOYMENT_TYPES: { label: string; value: LoanEmploymentType }[] = [
  { label: "Salaried", value: "Salaried" },
  { label: "Self-Employed Pro", value: "Self-Employed Professional" },
  { label: "Business Owner", value: "Business Owner" },
];

const INCOME_RANGES = [
  "Below ₹10,000",
  "₹15,000 - ₹30,000",
  "₹30,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "Above ₹1,00,000",
  "Other (Enter Amount)",
];

export const VehicleLoanEmploymentStep: React.FC<VehicleLoanEmploymentStepProps> = ({
  data,
  onChangeDetails,
  businessData,
  onChangeBusiness,
  errors = {},
}) => {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isCustomIncome, setIsCustomIncome] = useState(() => {
    if (!data.monthlyIncomeOrTurnover) return false;
    return !INCOME_RANGES.some(
      (r) => r === data.monthlyIncomeOrTurnover && !r.startsWith("Other")
    );
  });

  const isBusinessOrSelfEmployed =
    data.employmentType === "Business Owner" ||
    data.employmentType === "Self-Employed Professional";

  const handleSelectIncome = (item: string) => {
    setIsIncomeModalOpen(false);
    if (item.startsWith("Other")) {
      setIsCustomIncome(true);
      onChangeDetails("monthlyIncomeOrTurnover", "");
    } else {
      setIsCustomIncome(false);
      onChangeDetails("monthlyIncomeOrTurnover", item);
    }
  };

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
              const isSelected =
                Boolean(data.employmentType) && data.employmentType === item.value;
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

      {/* 2. Monthly In-Hand Income Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="cash-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Monthly In-Hand Income</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Select monthly take-home income range or specify your exact net income.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Monthly Net Income (₹) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.monthlyIncomeOrTurnover) && styles.dropdownSelectorActive,
              errors.monthlyIncomeOrTurnover && styles.inputError,
            ]}
            onPress={() => setIsIncomeModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.monthlyIncomeOrTurnover
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.monthlyIncomeOrTurnover || "Select Monthly Income Range..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.monthlyIncomeOrTurnover
                  ? BrandColors.PRIMARY_ORANGE || "#EA580C"
                  : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.monthlyIncomeOrTurnover && (
            <Text style={styles.errorText}>
              {errors.monthlyIncomeOrTurnover}
            </Text>
          )}

          {/* Conditional input if Other (Enter Amount) is selected */}
          {isCustomIncome && (
            <View style={styles.customInputContainer}>
              <Text style={styles.label}>
                Enter Exact Monthly Income (₹) <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.monthlyIncomeOrTurnover && styles.inputError,
                ]}
                placeholder="Enter monthly net income (₹) (e.g. 45000)"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={data.monthlyIncomeOrTurnover}
                onChangeText={(text) =>
                  onChangeDetails("monthlyIncomeOrTurnover", text)
                }
              />
            </View>
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
            Provide enterprise details for commercial/auto-credit underwriting.
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
              Yes, Active EMIs
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
              placeholder="Enter total ongoing monthly EMI (₹)"
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

      {/* Dropdown Modal for Monthly In-Hand Income */}
      <Modal
        visible={isIncomeModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsIncomeModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsIncomeModalOpen(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Monthly In-Hand Income</Text>
              <TouchableOpacity onPress={() => setIsIncomeModalOpen(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {INCOME_RANGES.map((range) => {
                const isSelected = range.startsWith("Other")
                  ? isCustomIncome
                  : data.monthlyIncomeOrTurnover === range;
                return (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => handleSelectIncome(range)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {range}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default VehicleLoanEmploymentStep;
