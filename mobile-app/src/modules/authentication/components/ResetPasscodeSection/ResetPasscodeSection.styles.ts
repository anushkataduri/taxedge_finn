import { StyleSheet, Platform } from "react-native";
import {
  BrandColors,
  BorderRadius,
  Typography,
  Spacing,
  BorderWidth,
} from "../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  section: {
    marginBottom: Spacing.xl,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.sm + 4,
    textAlign: "left",
  },
  otpTouchable: {
    width: "100%",
  },
  otpGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: BorderRadius.base - 2,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  secureDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  inlineErrorText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: "#DC2626",
    textAlign: "center",
    marginBottom: Spacing.md,
    marginTop: -Spacing.xs,
  },
  submitBtn: {
    marginTop: Spacing.sm,
    height: 54,
    borderRadius: BorderRadius.base - 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
});

export const getThemedStyles = (isDark: boolean) => ({
  title: {
    color: isDark ? "#FFFFFF" : "#06152D",
  },
  getBoxStyle: (isCurrent: boolean, isFilled: boolean, hasError: boolean) => {
    const borderColor = hasError
      ? "#DC2626"
      : isCurrent
      ? BrandColors.PRIMARY_ORANGE
      : isFilled
      ? (isDark ? "#38BDF8" : BrandColors.PRIMARY_BLUE_DARK)
      : (isDark ? "#334155" : "#E2E8F0");

    const backgroundColor = isDark
      ? (isCurrent || isFilled ? "#1E293B" : "#0F172A")
      : BrandColors.WHITE;

    return {
      borderColor,
      borderWidth: isCurrent || isFilled ? BorderWidth.medium : BorderWidth.thin,
      backgroundColor,
    };
  },
  secureDot: {
    backgroundColor: isDark ? BrandColors.WHITE : BrandColors.PRIMARY_BLUE_DARK,
  },
});
