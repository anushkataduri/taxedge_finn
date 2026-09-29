import React, { type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useTheme } from "../hooks/use-theme";
import { AppHeader } from "./AppHeader/AppHeader";
import { styles } from "./ScreenLayout.styles";

export { SCREEN_PADDING, SCREEN_BOTTOM_PADDING } from "./ScreenLayout.styles";

export interface ScreenLayoutProps {
  title: string;
  children?: ReactNode;
  showBack?: boolean;
  showNotification?: boolean;
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ScreenLayout({
  title,
  children,
  showBack = false,
  showNotification = true,
  onBack,
  style,
}: ScreenLayoutProps) {
  const colors = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <AppHeader
        title={title}
        showBack={showBack}
        showNotification={showNotification}
        onBack={onBack}
      />
      {children}
    </View>
  );
}
