import { Platform, StyleSheet } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    gap: 14,
    paddingBottom: 20,
  },

  readyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.PRIMARY_BLUE,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },

  readyIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  readyTextCol: {
    flex: 1,
  },

  readyHeading: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif-medium",
    }),
  },

  readySub: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
    lineHeight: 16,
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif",
    }),
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },

  cardTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif-medium",
    }),
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif",
    }),
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    color: BrandColors.TEXT_PRIMARY,
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif-medium",
    }),
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FEF0E6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 4,
  },

  totalLabel: {
    fontSize: 13.5,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif-medium",
    }),
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: BrandColors.PRIMARY_ORANGE,
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif-medium",
    }),
  },

  requestChangesBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: BrandColors.PRIMARY_ORANGE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },

  requestChangesText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif-medium",
    }),
  },
});