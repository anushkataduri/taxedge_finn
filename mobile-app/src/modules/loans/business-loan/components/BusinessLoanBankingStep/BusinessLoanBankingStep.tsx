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
  hasExistingLoans = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Banking & Tax Records</Text>
      <Text style={styles.sectionSubtitle}>
        Provide primary Current Account details and income tax filing acknowledgment.
      </Text>

      {/* 1. Primary Operating Bank */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Primary Operating Bank</Text>
        <Text style={styles.cardDescription}>
          Specify current account details for loan disbursement and auto-debit setup.
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
            onChangeText={(text) => onChange("accountNumber", text.replace(/[^0-9]/g, ""))}
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
            onChangeText={(text) => onChange("ifscCode", text.toUpperCase().trim())}
          />
          {errors.ifscCode && (
            <Text style={styles.errorText}>{errors.ifscCode}</Text>
          )}
        </View>
      </View>

      {/* 2. Existing Credit Facilities (Conditional on hasExistingLoans) */}
      {hasExistingLoans && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Existing Credit Facilities</Text>
          <Text style={styles.cardDescription}>
            Disclose running lender and remaining balance for eligibility computation.
          </Text>
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
              onChangeText={(text) => onChange("existingLoanOutstanding", text.replace(/[^0-9]/g, ""))}
            />
          </View>
        </View>
      )}

      {/* 3. Business Tax Filings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Business Tax Filings</Text>
        <Text style={styles.cardDescription}>
          Income tax return (ITR) acknowledgment and declared annual income.
        </Text>
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
            onChangeText={(text) => onChange("itrAckNumber", text.replace(/[^0-9]/g, ""))}
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
            onChangeText={(text) => onChange("grossTotalIncome", text.replace(/[^0-9]/g, ""))}
          />
        </View>
      </View>
    </View>
  );
};

export default BusinessLoanBankingStep;
