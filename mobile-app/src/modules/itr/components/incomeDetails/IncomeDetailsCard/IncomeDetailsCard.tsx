import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./IncomeDetailsCard.styles";

interface IncomeDetailsCardProps {
  categoryTitle?: string;
  amount: string;
  error?: string;
  onChange: (value: string) => void;
}

export const IncomeDetailsCard: React.FC<IncomeDetailsCardProps> = ({
  categoryTitle = "Business Income",
  amount,
  error,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatWithCommas = (val: string) => {
    const rawNumber = val.replace(/[^0-9]/g, "");
    if (!rawNumber) return "";
    return Number(rawNumber).toLocaleString("en-IN");
  };

  const handleChangeText = (text: string) => {
    const raw = text.replace(/[^0-9]/g, "");
    onChange(raw);
  };

  const displayValue = formatWithCommas(amount);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{categoryTitle} Details</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {categoryTitle} <Text style={styles.requiredStar}>*</Text>
        </Text>

        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputFocused,
            !!error && styles.inputError,
          ]}
        >
          <View style={styles.currencyPrefixContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={`Enter ${categoryTitle}`}
            placeholderTextColor="#94A3B8"
            value={displayValue}
            keyboardType="number-pad"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={handleChangeText}
          />
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};
