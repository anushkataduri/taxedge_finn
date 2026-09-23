import { StyleSheet, Platform } from "react-native";
import { Spacing, BorderRadius, Typography, BrandColors } from "../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  wrapper: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  backBtnAbsolute: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.base - 2,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: Spacing.xl,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: BrandColors.PRIMARY_BLUE_DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  headerResetPasscode: {
    marginBottom: Spacing.lg,
    alignItems: "center",
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  logoResetPasscode: {
    width: 80,
    height: 80,
    marginBottom: 0,
  },
  brandTitle: {
    fontSize: Typography.fontSize.hero,
    fontWeight: Typography.fontWeight.extraBold,
    letterSpacing: 2,
  },
  brandSub: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 3.5,
    marginTop: 3,
  },
  welcome: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: Typography.fontSize.base,
    textAlign: "center",
    lineHeight: 20,
  },
  formBody: {
    width: "100%",
  },
  serverConfigBtn: {
    alignSelf: "center",
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  serverConfigBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: BrandColors.PRIMARY_BLUE,
  },
});

export const getThemedStyles = (
  colors: {
    background: string;
    primaryDark: string;
    textSecondary: string;
    text: string;
  },
  isDark: boolean,
  insetsTop: number,
  headerOffset: number,
  minScrollPadding: number
) => ({
  container: {
    backgroundColor: colors.background,
  },
  backBtnAbsolute: {
    top: Math.max(insetsTop + headerOffset, minScrollPadding),
    backgroundColor: isDark ? "#1E293B" : BrandColors.WHITE,
    borderColor: isDark ? "#334155" : "#E2E8F0",
  },
  brandTitle: {
    color: colors.primaryDark,
  },
  brandSub: {
    color: colors.textSecondary,
  },
  welcomeTitle: {
    color: colors.text,
  },
  welcomeSub: {
    color: colors.textSecondary,
  },
});

export const getDynamicScrollStyle = (
  insetsTop: number,
  insetsBottom: number,
  headerOffset: number,
  footerOffset: number,
  minScrollPadding: number
) => ({
  paddingTop: Math.max(insetsTop + headerOffset, minScrollPadding),
  paddingBottom: Math.max(insetsBottom + footerOffset, minScrollPadding),
});
