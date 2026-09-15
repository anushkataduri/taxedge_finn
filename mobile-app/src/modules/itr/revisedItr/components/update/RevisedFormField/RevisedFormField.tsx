import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./RevisedFormField.styles";

interface RevisedFormFieldProps {
  label: string;
  value: string;
  onChangeText: (val: string) => void;
  isMandatory?: boolean;
  isLikelyChange?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "number-pad" | "numeric";
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
}

export const RevisedFormField: React.FC<RevisedFormFieldProps> = ({
  label,
  value,
  onChangeText,
  isMandatory = false,
  isLikelyChange = false,
  placeholder,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "none",
  error,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label} {isMandatory ? <Text style={styles.star}>*</Text> : null}
        </Text>

        {isLikelyChange && (
          <View style={styles.likelyChangeBadge}>
            <Text style={styles.likelyChangeText}>Likely change</Text>
          </View>
        )}
      </View>

      <TextInput
        style={[
          styles.input,
          isLikelyChange ? styles.highlightedInput : null,
          error ? styles.errorInput : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
