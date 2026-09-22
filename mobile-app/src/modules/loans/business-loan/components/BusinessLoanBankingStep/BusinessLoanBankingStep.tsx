import React from "react";
import { View, Text, TextInput } from "react-native";
import { LoanBankingFormData } from "../../../types/loans.types";
import { styles } from "./BusinessLoanBankingStep.styles";

export interface BusinessLoanBankingStepProps {
  data: LoanBankingFormData;
  onChange: (field: keyof LoanBankingFormData, value: string) => void;
  errors?: Record<string, string>;
  hasExistingLoans?: boolean;
}

export const BusinessLoanBankingStep: React.FC<BusinessLoanBankingStepProps> = ({
  data,
  onChange,
  errors = {},
  hasExistingLoans,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Banking & Tax Records</Text>
      <Text style={styles.sectionSubtitle}>
        Provide primary Current Account details and income tax filing acknowledgment.
      </Text>

      {/* Primary Bank Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Primary Operating Bank Name <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.primaryBankName && styles.inputError]}
          placeholder="e.g. HDFC Bank / ICICI Bank"
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
          Current Account Number <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.accountNumber && styles.inputError]}
          placeholder="e.g. 50200012345678"
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
          onChangeText={(text) => onChange("ifscCode", text.toUpperCase())}
        />
        {errors.ifscCode && (
          <Text style={styles.errorText}>{errors.ifscCode}</Text>
        )}
      </View>

      {/* Existing Credit Facilities */}
      <View style={styles.subCard}>
        <Text style={styles.subCardTitle}>Existing Credit Facilities</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Current Lender / Bank</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Axis Bank (CC/OD)"
            placeholderTextColor="#94A3B8"
            value={data.existingLenderName || ""}
            onChangeText={(text) => onChange("existingLenderName", text)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Total Active Loan Limit (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1500000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={data.existingLoanOutstanding || ""}
            onChangeText={(text) => onChange("existingLoanOutstanding", text)}
          />
        </View>
      </View>

      {/* ITR Details */}
      <View style={styles.subCard}>
        <Text style={styles.subCardTitle}>Business Tax Filings</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            ITR Acknowledgement Number (15 Digits){" "}
            <Text style={styles.optionalTag}>(Optional)</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.itrAckNumber && styles.inputError]}
            placeholder="e.g. 123456789012345"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={15}
            value={data.itrAckNumber || ""}
            onChangeText={(text) => onChange("itrAckNumber", text)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Gross Total Income as per ITR (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3500000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={data.grossTotalIncome || ""}
            onChangeText={(text) => onChange("grossTotalIncome", text)}
          />
        </View>
      </View>
    </View>
  );
};

export default BusinessLoanBankingStep;
