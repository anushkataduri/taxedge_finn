import { StyleSheet, ViewStyle, DimensionValue } from "react-native";
import { BrandColors, Typography, Spacing } from "../../../../../shared/theme";

export const getProgressBarFillDynamic = (progressPercent: number): ViewStyle => ({
  width: `${Math.min(100, Math.max(0, progressPercent))}%` as DimensionValue,
});

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  titleCenter: {
    alignItems: "center",
  },
  mainTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
  },
  subTitle: {
    fontSize: Typography.fontSize.xs,
    color: BrandColors.PRIMARY_ORANGE_DARK || "#EA580C",
    fontWeight: Typography.fontWeight.medium,
    marginTop: 2,
  },
  rightSpacer: {
    width: 36,
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: "#E2E8F0",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: BrandColors.PRIMARY_ORANGE,
  },
});
