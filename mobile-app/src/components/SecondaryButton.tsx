import React from "react";
import {
  TouchableOpacity,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "./SecondaryButton.styles";

export interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function SecondaryButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}: SecondaryButtonProps) {
  const colors = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          borderColor: colors.border,
          backgroundColor: "transparent",
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: disabled ? colors.textSecondary : colors.primary },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
