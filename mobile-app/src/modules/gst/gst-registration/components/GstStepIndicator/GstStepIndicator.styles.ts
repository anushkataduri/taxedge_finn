/**
 * Component: GstStepIndicator
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import { StyleSheet, Platform } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: BrandColors.WHITE,
  },
  stepItem: {
    alignItems: "center",
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  circleActive: {
    backgroundColor: BrandColors.PRIMARY_ORANGE,
  },
  circleCompleted: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
  },
  numberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  numberTextActive: {
    color: BrandColors.WHITE,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  labelTextActive: {
    color: BrandColors.PRIMARY_ORANGE,
    fontWeight: "700",
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 4,
    marginBottom: 16,
  },
  lineCompleted: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
  },
});
