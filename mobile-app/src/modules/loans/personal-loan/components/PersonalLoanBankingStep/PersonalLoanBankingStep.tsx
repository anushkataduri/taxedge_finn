import React from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import { LoanBankingFormData } from "../../../types/loans.types";
import { useIfscLookup } from "../../../hooks/useIfscLookup";
import { styles } from "./PersonalLoanBankingStep.styles";

export interface PersonalLoanBankingStepProps {
  data: LoanBankingFormData;
  onChange: <K extends keyof LoanBankingFormData>(field: K, value: LoanBankingFormData[K]) => void;
  errors?: Record<string, string>;
}

const IFSC_LOADER_COLOR = "#F97316";

export const PersonalLoanBankingStep: React.FC<PersonalLoanBankingStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const ifsc = useIfscLookup({
    trigger: "validFormat",
    errorMessage: "Invalid IFSC code. Please check branch details.",
    onResolved: (details) => {
      onChange("primaryBankName", details.bank);
      onChange("branchName", details.branch);
      onChange("isIfscVerified", true);
    },
  });

  // Every edit un-verifies the code; a successful lookup re-verifies it via onResolved.
  const handleIfscChange = (value: string) => {
    onChange("ifscCode", ifsc.handleIfscChange(value));
    onChange("branchName", "");
    onChange("isIfscVerified", false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Banking Details</Text>
      <Text style={styles.sectionSubtitle}>
        Provide the account where the approved loan should be disbursed.
      </Text>

      {/* Primary Bank Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Primary Operating Bank Name <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.primaryBankName && styles.inputError]}
          placeholder="e.g. HDFC Bank / State Bank of India"
          placeholderTextColor="#94A3B8"
          value={data.primaryBankName}
          onChangeText={(text) => onChange("primaryBankName", text)}
        />
        {errors.primaryBankName && (
          <Text style={styles.errorText}>{errors.primaryBankName}</Text>
        )}
      </View>

      {/* Account Number */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Bank Account Number <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.accountNumber && styles.inputError]}
          placeholder="e.g. 50100234567890"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          value={data.accountNumber}
          onChangeText={(text) => onChange("accountNumber", text)}
        />
        {errors.accountNumber && (
          <Text style={styles.errorText}>{errors.accountNumber}</Text>
        )}
      </View>

      {/* IFSC Code */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Bank IFSC Code <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.ifscCode && styles.inputError]}
          placeholder="e.g. HDFC0001234"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          maxLength={11}
          value={data.ifscCode}
          onChangeText={handleIfscChange}
        />
        <Text style={styles.helperText}>11-digit alphanumeric bank code</Text>
        {ifsc.isLoading && (
          <View style={styles.ifscLoadingRow}>
            <ActivityIndicator size="small" color={IFSC_LOADER_COLOR} />
            <Text style={styles.helperText}>Verifying IFSC...</Text>
          </View>
        )}
        {data.branchName && data.isIfscVerified && (
          <View style={styles.ifscSuccessBox}>
            <Text style={styles.ifscSuccessText}>
              {data.primaryBankName} • {data.branchName}
            </Text>
          </View>
        )}
        {(errors.ifscCode || ifsc.error) && (
          <Text style={styles.errorText}>{errors.ifscCode || ifsc.error}</Text>
        )}
      </View>
    </View>
  );
};

export default PersonalLoanBankingStep;
