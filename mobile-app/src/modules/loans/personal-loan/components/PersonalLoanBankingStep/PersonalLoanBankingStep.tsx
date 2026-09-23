import React, { useRef, useState } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import { ifscService } from "../../../../gst/services/ifscService";
import { LoanBankingFormData } from "../../../types/loans.types";
import { styles } from "./PersonalLoanBankingStep.styles";

export interface PersonalLoanBankingStepProps {
  data: LoanBankingFormData;
  onChange: (field: keyof LoanBankingFormData, value: any) => void;
  errors?: Record<string, string>;
}

export const PersonalLoanBankingStep: React.FC<PersonalLoanBankingStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [isIfscLoading, setIsIfscLoading] = useState(false);
  const [ifscError, setIfscError] = useState<string | null>(null);
  const lookupRequest = useRef(0);

  const handleIfscChange = async (value: string) => {
    const cleanIfsc = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const requestId = ++lookupRequest.current;
    setIfscError(null);
    onChange("ifscCode", cleanIfsc);
    onChange("branchName", "");
    onChange("isIfscVerified", false);

    if (!ifscService.isValidFormat(cleanIfsc)) {
      setIsIfscLoading(false);
      return;
    }

    setIsIfscLoading(true);
    try {
      const details = await ifscService.lookup(cleanIfsc);
      if (requestId !== lookupRequest.current) return;
      onChange("primaryBankName", details.bank);
      onChange("branchName", details.branch);
      onChange("isIfscVerified", true);
    } catch {
      if (requestId !== lookupRequest.current) return;
      setIfscError("Invalid IFSC code. Please check branch details.");
      onChange("isIfscVerified", false);
    } finally {
      if (requestId === lookupRequest.current) setIsIfscLoading(false);
    }
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
        {isIfscLoading && (
          <View style={styles.ifscLoadingRow}>
            <ActivityIndicator size="small" color="#F97316" />
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
        {(errors.ifscCode || ifscError) && (
          <Text style={styles.errorText}>{errors.ifscCode || ifscError}</Text>
        )}
      </View>
    </View>
  );
};

export default PersonalLoanBankingStep;
