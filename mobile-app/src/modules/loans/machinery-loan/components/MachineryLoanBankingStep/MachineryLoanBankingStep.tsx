import React from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanBankingFormData } from "../../../types/loans.types";
import { useIfscLookup } from "../../../hooks/useIfscLookup";
import { styles } from "./MachineryLoanBankingStep.styles";

export interface MachineryLoanBankingStepProps {
  data: LoanBankingFormData;
  onChange: (field: keyof LoanBankingFormData, value: string) => void;
  errors?: Record<string, string>;
  hasExistingLoans?: boolean;
}

export const MachineryLoanBankingStep: React.FC<MachineryLoanBankingStepProps> = ({
  data,
  onChange,
  errors = {},
  hasExistingLoans = false,
}) => {
  const ifsc = useIfscLookup({
    trigger: "length",
    onResolved: (details) => onChange("primaryBankName", details.bank),
  });
  const { isLoading: isIfscLoading, error: ifscError, branchName } = ifsc;

  const handleIfscChange = (text: string) => {
    onChange("ifscCode", ifsc.handleIfscChange(text));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="card" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Banking & Financial Account Details</Text>
          </View>
        </View>

        {/* Primary Bank Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Bank Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, Boolean(errors.primaryBankName) && styles.inputError]}
            placeholder="e.g. Bank of India / ICICI Bank"
            placeholderTextColor="#94A3B8"
            value={data.primaryBankName}
            onChangeText={(text) => onChange("primaryBankName", text)}
          />
          {Boolean(errors.primaryBankName) && (
            <Text style={styles.errorText}>{errors.primaryBankName}</Text>
          )}
        </View>

        {/* Account Number */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Current Account Number <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, Boolean(errors.accountNumber) && styles.inputError]}
            placeholder="e.g. 10023456789012"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={data.accountNumber}
            onChangeText={(text) => onChange("accountNumber", text)}
          />
          {Boolean(errors.accountNumber) && (
            <Text style={styles.errorText}>{errors.accountNumber}</Text>
          )}
        </View>

        {/* IFSC Code */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Bank IFSC Code <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, Boolean(errors.ifscCode || ifscError) && styles.inputError]}
            placeholder="e.g. BKID0001234"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            maxLength={11}
            value={data.ifscCode}
            onChangeText={handleIfscChange}
          />
          {isIfscLoading && (
            <View style={styles.ifscInfoRow}>
              <ActivityIndicator size="small" color={BrandColors.PRIMARY_ORANGE} />
              <Text style={styles.ifscLoadingText}>Verifying IFSC with RBI directory...</Text>
            </View>
          )}
          {!isIfscLoading && branchName ? (
            <View style={styles.ifscInfoRow}>
              <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              <Text style={styles.ifscSuccessText}>Branch: {branchName}</Text>
            </View>
          ) : null}
          {!isIfscLoading && !branchName && (
            <Text style={styles.helperText}>11-digit bank branch IFSC</Text>
          )}
          {Boolean(errors.ifscCode || ifscError) && (
            <Text style={styles.errorText}>{errors.ifscCode || ifscError}</Text>
          )}
        </View>

        {/* Existing Equipment Loans */}
        {hasExistingLoans && (
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>Existing Equipment / Term Loans</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Current Financing Institution</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Tata Capital / SIDBI"
                placeholderTextColor="#94A3B8"
                value={data.existingLenderName || ""}
                onChangeText={(text) => onChange("existingLenderName", text)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Approximate Total Outstanding (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 800000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={data.existingLoanOutstanding || ""}
                onChangeText={(text) => onChange("existingLoanOutstanding", text)}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MachineryLoanBankingStep;
