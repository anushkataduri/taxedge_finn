import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanBankingFormData } from "../../../types/loans.types";
import { styles } from "./VehicleLoanBankingStep.styles";

export interface VehicleLoanBankingStepProps {
  data: LoanBankingFormData;
  onChange: (field: keyof LoanBankingFormData, value: string) => void;
  errors?: Record<string, string>;
  hasExistingLoans?: boolean;
}

const ITR_STATUS_OPTIONS: ("Filed" | "Not Filed" | "Exempt")[] = [
  "Filed",
  "Not Filed",
  "Exempt",
];

export const VehicleLoanBankingStep: React.FC<VehicleLoanBankingStepProps> = ({
  data,
  onChange,
  errors = {},
  hasExistingLoans = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Banking & EMI Repayment Account</Text>
      <Text style={styles.sectionSubtitle}>
        Provide the bank account for auto-debit NACH setup and recent tax filing status.
      </Text>

      {/* Primary Bank Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Primary Bank Name <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.primaryBankName && styles.inputError]}
          placeholder="e.g. Axis Bank / ICICI Bank"
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
          placeholder="e.g. 912345678901"
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
          placeholder="e.g. UTIB0001234"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          maxLength={11}
          value={data.ifscCode}
          onChangeText={(text) => onChange("ifscCode", text.toUpperCase())}
        />
        <Text style={styles.helperText}>11-digit alphanumeric bank code</Text>
        {errors.ifscCode && (
          <Text style={styles.errorText}>{errors.ifscCode}</Text>
        )}
      </View>

      {/* Existing Loan Obligations */}
      {hasExistingLoans && (
        <View style={styles.subCard}>
          <Text style={styles.subCardTitle}>Existing Vehicle / Personal Loans</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Current Financing Institution</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. HDFC Bank / Kotak Mahindra"
              placeholderTextColor="#94A3B8"
              value={data.existingLenderName || ""}
              onChangeText={(text) => onChange("existingLenderName", text)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Approximate Total Outstanding (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 200000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.existingLoanOutstanding || ""}
              onChangeText={(text) => onChange("existingLoanOutstanding", text)}
            />
          </View>
        </View>
      )}

      {/* ITR Details */}
      <View style={styles.subCard}>
        <Text style={styles.subCardTitle}>Income Tax Return (ITR) Compliance</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>ITR Filing Status</Text>
          <View style={styles.statusRow}>
            {ITR_STATUS_OPTIONS.map((status) => {
              const isSelected = data.itrFilingStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  onPress={() => onChange("itrFilingStatus", status)}
                  style={[
                    styles.statusChip,
                    isSelected && styles.statusChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      isSelected && styles.statusChipTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {data.itrFilingStatus === "Filed" && (
          <>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                ITR Acknowledgement Number (15 Digits){" "}
                <Text style={styles.optionalTag}>(Optional)</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.itrAckNumber && styles.inputError,
                ]}
                placeholder="e.g. 123456789012345"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={15}
                value={data.itrAckNumber || ""}
                onChangeText={(text) => onChange("itrAckNumber", text)}
              />
              {errors.itrAckNumber && (
                <Text style={styles.errorText}>{errors.itrAckNumber}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gross Total Annual Income as per ITR (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 850000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={data.grossTotalIncome || ""}
                onChangeText={(text) => onChange("grossTotalIncome", text)}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default VehicleLoanBankingStep;
