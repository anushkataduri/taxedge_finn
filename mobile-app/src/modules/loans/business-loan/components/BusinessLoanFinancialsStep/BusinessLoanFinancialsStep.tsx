import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoanDetailsFormData, LoanEmploymentType, ExistingLoanDetail } from "../../../types/loans.types";
import { styles } from "./BusinessLoanFinancialsStep.styles";

export interface BusinessLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: any) => void;
  errors?: Record<string, string>;
}

const EMPLOYMENT_PROFILES: LoanEmploymentType[] = [
  "Salaried",
  "Self-Employed Professional",
  "Business Owner",
];

const AMOUNT_PRESETS = [
  { label: "₹5 Lakhs", value: "500000" },
  { label: "₹10 Lakhs", value: "1000000" },
  { label: "₹25 Lakhs", value: "2500000" },
  { label: "₹50 Lakhs", value: "5000000" },
  { label: "₹1 Crore", value: "10000000" },
];

const COMMON_PURPOSES = [
  "Business Expansion",
  "Working Capital & Inventory",
  "Machinery / Equipment Purchase",
  "Home Purchase / Construction",
  "Home Renovation",
  "Vehicle Purchase",
  "Debt Consolidation",
  "Personal / Medical Emergency",
];

const TENURE_PRESETS = [
  { label: "12 Mos (1 Yr)", value: "12" },
  { label: "24 Mos (2 Yrs)", value: "24" },
  { label: "36 Mos (3 Yrs)", value: "36" },
  { label: "60 Mos (5 Yrs)", value: "60" },
  { label: "84 Mos (7 Yrs)", value: "84" },
  { label: "120 Mos (10 Yrs)", value: "120" },
  { label: "240 Mos (20 Yrs)", value: "240" },
];

export const BusinessLoanFinancialsStep: React.FC<BusinessLoanFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [isPurposeDropdownOpen, setIsPurposeDropdownOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* 1. Employment / Business Profile */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="briefcase" size={16} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>
              Employment / Business Profile <Text style={styles.requiredStar}>*</Text>
            </Text>
            <Ionicons name="information-circle-outline" size={16} color="#94A3B8" style={styles.infoIcon} />
          </View>
        </View>

        <View style={styles.profileRow}>
          {EMPLOYMENT_PROFILES.map((profile) => {
            const isSelected = data.employmentType === profile;
            return (
              <TouchableOpacity
                key={profile}
                activeOpacity={0.8}
                onPress={() => onChange("employmentType", profile)}
                style={[styles.profileBtn, isSelected && styles.profileBtnActive]}
              >
                <Text style={[styles.profileBtnText, isSelected && styles.profileBtnTextActive]}>
                  {profile}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.employmentType && <Text style={styles.errorText}>{errors.employmentType}</Text>}
      </View>

      {/* 2. Required Loan Amount */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="wallet" size={16} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>
              Required Loan Amount (₹) <Text style={styles.requiredStar}>*</Text>
            </Text>
          </View>
        </View>

        <TextInput
          style={[styles.input, errors.requiredAmount && styles.inputError]}
          placeholder="1000000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.requiredAmount}
          onChangeText={(text) => onChange("requiredAmount", text)}
        />

        <View style={styles.chipRow}>
          {AMOUNT_PRESETS.map((item) => {
            const isSelected = data.requiredAmount === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => onChange("requiredAmount", item.value)}
                style={[styles.chip, isSelected && styles.chipActive]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.requiredAmount && <Text style={styles.errorText}>{errors.requiredAmount}</Text>}
      </View>

      {/* 3. Purpose of Loan */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="location" size={16} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>
              Purpose of Loan <Text style={styles.requiredStar}>*</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsPurposeDropdownOpen(!isPurposeDropdownOpen)}
          style={styles.dropdownBox}
        >
          <Text style={data.purpose ? styles.dropdownText : styles.dropdownPlaceholder}>
            {data.purpose || "Select your loan type"}
          </Text>
          <Ionicons
            name={isPurposeDropdownOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#64748B"
          />
        </TouchableOpacity>

        {isPurposeDropdownOpen && (
          <View style={styles.dropdownMenu}>
            {COMMON_PURPOSES.map((purpose) => {
              const isSelected = data.purpose === purpose;
              return (
                <TouchableOpacity
                  key={purpose}
                  activeOpacity={0.7}
                  onPress={() => {
                    onChange("purpose", purpose);
                    setIsPurposeDropdownOpen(false);
                  }}
                  style={[styles.dropdownMenuItem, isSelected && styles.dropdownMenuItemActive]}
                >
                  <Text style={[styles.dropdownMenuText, isSelected && styles.dropdownMenuTextActive]}>
                    {purpose}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {errors.purpose && <Text style={styles.errorText}>{errors.purpose}</Text>}
      </View>

      {/* 4. Preferred Tenure */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={16} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>
              Preferred Tenure (Months) <Text style={styles.requiredStar}>*</Text>
            </Text>
          </View>
        </View>

        <View style={styles.tenureGrid}>
          {TENURE_PRESETS.map((item) => {
            const isSelected = data.preferredTenureMonths === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => onChange("preferredTenureMonths", item.value)}
                style={[styles.tenureBox, isSelected && styles.tenureBoxActive]}
              >
                <Text style={[styles.tenureText, isSelected && styles.tenureTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.preferredTenureMonths && <Text style={styles.errorText}>{errors.preferredTenureMonths}</Text>}
      </View>

      {/* 5. Monthly / Annual Revenue / Turnover */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="bar-chart" size={16} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>
              Monthly / Annual Revenue / Turnover (₹) <Text style={styles.requiredStar}>*</Text>
            </Text>
          </View>
        </View>

        <TextInput
          style={[styles.input, errors.monthlyIncomeOrTurnover && styles.inputError]}
          placeholder="150000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.monthlyIncomeOrTurnover}
          onChangeText={(text) => onChange("monthlyIncomeOrTurnover", text)}
        />
        {errors.monthlyIncomeOrTurnover && <Text style={styles.errorText}>{errors.monthlyIncomeOrTurnover}</Text>}
      </View>

      {/* 6. Do you have any existing loans? */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="document-text" size={16} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>
              Do you have any existing loans? <Text style={styles.requiredStar}>*</Text>
            </Text>
          </View>
        </View>

        <View style={styles.radioGroup}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChange("hasExistingLoans", false)}
            style={[styles.radioCard, data.hasExistingLoans === false && styles.radioCardActive]}
          >
            <View style={[styles.radioOuter, data.hasExistingLoans === false && styles.radioOuterActive]}>
              {data.hasExistingLoans === false && <View style={styles.radioInner} />}
            </View>
            <View style={styles.radioContent}>
              <Text style={styles.radioTitle}>No Existing Loans</Text>
              <Text style={styles.radioSubtitle}>
                I do not have any active loans with other lenders.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChange("hasExistingLoans", true)}
            style={[styles.radioCard, data.hasExistingLoans === true && styles.radioCardActive]}
          >
            <View style={[styles.radioOuter, data.hasExistingLoans === true && styles.radioOuterActive]}>
              {data.hasExistingLoans === true && <View style={styles.radioInner} />}
            </View>
            <View style={styles.radioContent}>
              <Text style={styles.radioTitle}>Yes, Active Loans</Text>
              <Text style={styles.radioSubtitle}>
                I have one or more active loans with other lenders.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {errors.hasExistingLoans && <Text style={styles.errorText}>{errors.hasExistingLoans}</Text>}
      </View>
    </View>
  );
};

export default BusinessLoanFinancialsStep;
