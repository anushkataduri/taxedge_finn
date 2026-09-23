import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
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
      {/* 1. Operating & Auto-Debit Bank Account Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="wallet-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Primary Operating & Repayment Bank</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Specify the account for loan disbursement and setting up auto-debit NACH EMI repayments.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Bank Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.primaryBankName && styles.inputError]}
            placeholder="Enter primary bank name (e.g. State Bank of India / HDFC)"
            placeholderTextColor="#94A3B8"
            value={data.primaryBankName}
            onChangeText={(text) => onChange("primaryBankName", text)}
          />
          {errors.primaryBankName && (
            <Text style={styles.errorText}>{errors.primaryBankName}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Bank Account Number <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.accountNumber && styles.inputError]}
            placeholder="Enter bank account number"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={data.accountNumber}
            onChangeText={(text) => onChange("accountNumber", text)}
          />
          {errors.accountNumber && (
            <Text style={styles.errorText}>{errors.accountNumber}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Bank IFSC Code <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.ifscCode && styles.inputError]}
            placeholder="Enter 11-digit IFSC code (e.g. SBIN0001234)"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            maxLength={11}
            value={data.ifscCode}
            onChangeText={(text) => onChange("ifscCode", text.toUpperCase())}
          />
          <Text style={styles.helperText}>11-digit alphanumeric bank IFSC code</Text>
          {errors.ifscCode && (
            <Text style={styles.errorText}>{errors.ifscCode}</Text>
          )}
        </View>
      </View>

      {/* 2. Existing Loan Obligations (if active loans) */}
      {hasExistingLoans && (
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons
                name="card-outline"
                size={20}
                color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
              />
              <Text style={styles.cardTitle}>Existing Loan Details</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            Disclose running lender and remaining balance for auto-loan credit assessment.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Current Financing Bank / NBFC</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current lender / bank name"
              placeholderTextColor="#94A3B8"
              value={data.existingLenderName || ""}
              onChangeText={(text) => onChange("existingLenderName", text)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Approximate Total Outstanding (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter approximate outstanding balance (₹)"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.existingLoanOutstanding || ""}
              onChangeText={(text) => onChange("existingLoanOutstanding", text)}
            />
          </View>
        </View>
      )}

      {/* 3. ITR Compliance Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Income Tax Return (ITR) Compliance</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Select your recent assessment year income tax filing status and declared income.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Last Assessment Year Filing Status <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.statusRow}>
            {ITR_STATUS_OPTIONS.map((status) => {
              const isSelected =
                Boolean(data.itrFilingStatus) && data.itrFilingStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  activeOpacity={0.7}
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
          {errors.itrFilingStatus && (
            <Text style={styles.errorText}>{errors.itrFilingStatus}</Text>
          )}
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
                placeholder="Enter 15-digit ITR acknowledgement number"
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
                placeholder="Enter gross total annual income (₹)"
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
