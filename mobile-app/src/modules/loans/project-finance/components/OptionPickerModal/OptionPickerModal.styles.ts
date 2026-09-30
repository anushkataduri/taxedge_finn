import { StyleSheet } from "react-native";
import { BrandColors, Typography, Spacing, BorderRadius } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "75%",
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.base,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: "#0F172A",
  },
  closeBtn: {
    padding: 4,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  optionItemActive: {
    backgroundColor: "#FEF0E6",
    borderRadius: BorderRadius.sm,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    color: "#334155",
    fontWeight: Typography.fontWeight.medium,
  },
  optionTextActive: {
    color: BrandColors.PRIMARY_ORANGE_DARK || "#EA580C",
    fontWeight: Typography.fontWeight.bold,
  },
});
