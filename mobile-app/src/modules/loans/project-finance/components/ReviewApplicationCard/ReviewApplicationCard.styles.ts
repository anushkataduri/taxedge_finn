import { StyleSheet } from "react-native";
import { BrandColors, Typography, BorderRadius } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.md || 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 18,
  },

  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 16,
  },
  summaryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  summaryTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
    color: "#0F172A",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
  },
  summaryItemHalf: {
    width: "50%",
  },
  summaryItemFull: {
    width: "100%",
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs - 1,
    color: "#64748B",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: "#0F172A",
  },
  summaryHighlightValue: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE_DARK || "#EA580C",
  },

  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: "#0F172A",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  editText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: BrandColors.PRIMARY_ORANGE_DARK || "#EA580C",
  },
});
