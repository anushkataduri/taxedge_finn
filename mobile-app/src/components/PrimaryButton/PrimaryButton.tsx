import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "./PrimaryButton.styles";

export type ButtonColorType = "primary" | "orange";

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  colorType?: ButtonColorType;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  colorType = "primary",
  style,
  textStyle,
}: PrimaryButtonProps) {
  const colors = useTheme();

  const backgroundColor = disabled
    ? colors.backgroundSelected
    : colorType === "orange"
      ? colors.orange
      : colors.primary;

  const textColor = disabled ? colors.textSecondary : "#FFFFFF";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, { backgroundColor }, style]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
