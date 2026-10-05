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
    backgroundColor: BrandColors.CARD_BORDER,
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
    color: BrandColors.TEXT_MUTED,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  numberTextActive: {
    color: BrandColors.WHITE,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "500",
    color: BrandColors.TEXT_MUTED,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  labelTextActive: {
    color: BrandColors.PRIMARY_ORANGE,
    fontWeight: "700",
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: BrandColors.BORDER,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  lineCompleted: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
  },
});
