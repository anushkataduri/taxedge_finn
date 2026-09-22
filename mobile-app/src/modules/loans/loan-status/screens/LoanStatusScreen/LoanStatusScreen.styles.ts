import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.COLOR_WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: BrandColors.COLOR_WHITE,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: Typography.FONT_SIZE_LG,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: BrandColors.COLOR_WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  appIdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  refNumber: {
    fontSize: Typography.FONT_SIZE_XS,
    fontWeight: "600",
    color: "#64748B",
  },
  badge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.PRIMARY_BLUE,
  },
  loanName: {
    fontSize: Typography.FONT_SIZE_LG,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  amountText: {
    fontSize: Typography.FONT_SIZE_XL,
    fontWeight: "800",
    color: "#16A34A",
    marginBottom: 12,
  },
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  metaLabel: {
    fontSize: Typography.FONT_SIZE_XS,
    color: "#64748B",
  },
  metaValue: {
    fontSize: Typography.FONT_SIZE_SM,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: BrandColors.COLOR_WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timelineTitle: {
    fontSize: Typography.FONT_SIZE_BASE,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  bottomActions: {
    marginTop: 16,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryBtnText: {
    color: BrandColors.COLOR_WHITE,
    fontSize: Typography.FONT_SIZE_SM,
    fontWeight: "700",
  },
  secondaryBtn: {
    backgroundColor: BrandColors.COLOR_WHITE,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#475569",
    fontSize: Typography.FONT_SIZE_SM,
    fontWeight: "600",
  },
});
