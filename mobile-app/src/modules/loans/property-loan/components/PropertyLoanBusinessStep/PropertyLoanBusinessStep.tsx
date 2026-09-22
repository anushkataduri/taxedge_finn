import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanBusinessFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanBusinessStep.styles";

export interface PropertyLoanBusinessStepProps {
  data: LoanBusinessFormData;
  onChange: (field: keyof LoanBusinessFormData, value: string) => void;
  errors?: Record<string, string>;
}

const VINTAGE_OPTIONS = [
  { label: "< 1 Year", value: "0" },
  { label: "1 - 2 Years", value: "2" },
  { label: "3 - 5 Years", value: "4" },
  { label: "5 - 10 Years", value: "7" },
  { label: "10+ Years", value: "11" },
];

export const PropertyLoanBusinessStep: React.FC<PropertyLoanBusinessStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Business or Property Entity Profile</Text>
      <Text style={styles.sectionSubtitle}>
        Provide the commercial entity or title holding business details.
      </Text>

      {/* Entity Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Registered Business / Firm / Entity Name <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.businessName && styles.inputError]}
          placeholder="e.g. Skyline Realities / Apex Traders"
          placeholderTextColor="#94A3B8"
          value={data.businessName}
          onChangeText={(text) => onChange("businessName", text)}
        />
        {errors.businessName && (
          <Text style={styles.errorText}>{errors.businessName}</Text>
        )}
      </View>

      {/* GSTIN */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          GST Identification Number (GSTIN){" "}
          <Text style={styles.optionalTag}>(If registered)</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.gstin && styles.inputError]}
          placeholder="e.g. 27ABCDE1234F1Z5"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          maxLength={15}
          value={data.gstin}
          onChangeText={(text) => onChange("gstin", text.toUpperCase())}
        />
        {errors.gstin && <Text style={styles.errorText}>{errors.gstin}</Text>}
      </View>

      {/* Business Vintage */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Business / Property Vintage (Years) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View style={styles.vintageRow}>
          {VINTAGE_OPTIONS.map((item) => {
            const isSelected = data.businessVintageYears === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.7}
                onPress={() => onChange("businessVintageYears", item.value)}
                style={[
                  styles.vintageChip,
                  isSelected && styles.vintageChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.vintageChipText,
                    isSelected && styles.vintageChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.businessVintageYears && (
          <Text style={styles.errorText}>{errors.businessVintageYears}</Text>
        )}
      </View>

      {/* Annual Turnover / Revenue */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Annual Business Turnover / Inflows (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.annualTurnover && styles.inputError]}
          placeholder="e.g. 15000000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.annualTurnover}
          onChangeText={(text) => onChange("annualTurnover", text)}
        />
        {errors.annualTurnover && (
          <Text style={styles.errorText}>{errors.annualTurnover}</Text>
        )}
      </View>

      {/* Net Profit */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Annual Net Profit / Yield (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.netProfit && styles.inputError]}
          placeholder="e.g. 2500000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.netProfit}
          onChangeText={(text) => onChange("netProfit", text)}
        />
        {errors.netProfit && (
          <Text style={styles.errorText}>{errors.netProfit}</Text>
        )}
      </View>
    </View>
  );
};

export default PropertyLoanBusinessStep;
