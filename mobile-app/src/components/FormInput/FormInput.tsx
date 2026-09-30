import React, { useState } from "react";
import { View, Text, TextInput, type KeyboardTypeOptions } from "react-native";
import { useTheme } from "../../hooks/use-theme";
import { styles } from "./FormInput.styles";

export interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  maxLength?: number;
  /** Validation message shown under the field. */
  error?: string | null;
  required?: boolean;
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  maxLength,
  error,
  required = false,
}: FormInputProps) {
  const colors = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label} {required && <Text style={[styles.requiredAsterisk, { color: colors.error }]}>*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: error
              ? colors.error
              : isFocused
                ? colors.primary
                : colors.border,
          },
        ]}
      />

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}
