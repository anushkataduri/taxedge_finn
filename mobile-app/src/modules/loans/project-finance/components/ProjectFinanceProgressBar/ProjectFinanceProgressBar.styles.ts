import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
  },
  stepText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  track: {
    width: "100%",
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    borderRadius: 2,
  },
});

export const getProgressBarFillWidth = (percent: number) => ({
  width: `${percent}%` as any,
});
