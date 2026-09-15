import React from "react";
import { View, Text, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DeductionCurrencyInput } from "../DeductionCurrencyInput";
import { DeductionsFormData, DeductionsFormErrors } from "../../../types/deductions.types";
import { styles } from "./TaxDeductionsCard.styles";

interface TaxDeductionsCardProps {
  formData: DeductionsFormData;
  errors: DeductionsFormErrors;
  onChange: (updated: Partial<DeductionsFormData>) => void;
}

export const TaxDeductionsCard: React.FC<TaxDeductionsCardProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <View style={styles.card}>
      {/* Header with Orange Shield Icon */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={20} color="#F97316" />
        </View>
        <Text style={styles.cardTitle}>Tax Deductions</Text>
      </View>

      {/* Row 1: 80C & 80D */}
      <View style={styles.inputRow}>
        <DeductionCurrencyInput
          label="Section 80C Investments"
          required
          value={formData.sec80c}
          placeholder="Enter amount"
          error={errors.sec80c}
          onChangeText={(val) => onChange({ sec80c: val })}
        />

        <DeductionCurrencyInput
          label="Section 80D Health Insurance"
          required
          value={formData.sec80d}
          placeholder="Enter amount"
          error={errors.sec80d}
          onChangeText={(val) => onChange({ sec80d: val })}
        />
      </View>

      {/* Row 2: Home Loan 24B & Education Loan 80E */}
      <View style={styles.inputRow}>
        <DeductionCurrencyInput
          label="Home Loan Interest (Sec 24B)"
          value={formData.homeLoan24b}
          placeholder="Enter amount"
          error={errors.homeLoan24b}
          onChangeText={(val) => onChange({ homeLoan24b: val })}
        />

        <DeductionCurrencyInput
          label="Education Loan Interest (Sec 80E)"
          value={formData.educationLoan80e}
          placeholder="Enter amount"
          error={errors.educationLoan80e}
          onChangeText={(val) => onChange({ educationLoan80e: val })}
        />
      </View>

      {/* Other Deductions Text Area */}
      <View style={styles.textAreaContainer}>
        <Text style={styles.textAreaLabel}>Other Deductions</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={styles.textArea}
            placeholder="Mention any additional deductions you wish to claim."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            maxLength={300}
            value={formData.otherDeductions}
            onChangeText={(text) => onChange({ otherDeductions: text })}
          />
          <Text style={styles.charCounter}>
            {formData.otherDeductions?.length || 0}/300
          </Text>
        </View>
      </View>

      {/* Mandatory Note */}
      <View style={styles.infoRow}>
        <Ionicons name="information-circle-outline" size={16} color="#0B1F3A" />
        <Text style={styles.infoText}>
          Fields marked with <Text style={styles.requiredStar}>*</Text> are mandatory.
        </Text>
      </View>
    </View>
  );
};
