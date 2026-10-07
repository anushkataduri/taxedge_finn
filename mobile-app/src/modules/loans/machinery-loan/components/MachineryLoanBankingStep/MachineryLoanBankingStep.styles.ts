import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#FEF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    marginBottom: 14,
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 5,
  },
  requiredStar: {
    color: "#EF4444",
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 3,
  },
  input: {
    backgroundColor: BrandColors.WHITE,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: Typography.fontSize.sm,
    color: "#0F172A",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  subCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 8,
  },
  subCardTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  ifscInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  ifscLoadingText: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
  },
  ifscSuccessText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: "#16A34A",
  },
});
