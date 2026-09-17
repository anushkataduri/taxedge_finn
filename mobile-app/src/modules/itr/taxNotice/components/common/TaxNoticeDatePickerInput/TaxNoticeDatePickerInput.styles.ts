import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { BrandColors, BorderRadius, BorderWidth, Typography } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: Typography.fontWeight.bold,
    color: "#0B1F3A",
    marginBottom: 6,
  },
  requiredStar: {
    color: "#DC2626",
  },
  inputBox: {
    height: 48,
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputBoxError: {
    borderColor: "#DC2626",
  },
  valueText: {
    fontSize: Typography.fontSize.base,
    color: "#0B1F3A",
    fontWeight: Typography.fontWeight.semiBold,
  },
  placeholderText: {
    color: "#94A3B8",
    fontWeight: Typography.fontWeight.regular,
  },
  errorText: {
    fontSize: Typography.fontSize.xs + 1.5,
    color: "#DC2626",
    marginTop: 4,
    fontWeight: Typography.fontWeight.medium,
  },
  helperText: {
    fontSize: Typography.fontSize.xs + 1,
    color: BrandColors.TEXT_SECONDARY,
    marginTop: 4,
  },
});

export const getWebInputStyle = (): any => ({
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  color: "#0B1F3A",
  fontSize: "15px",
  fontWeight: "600",
  fontFamily: "inherit",
});
