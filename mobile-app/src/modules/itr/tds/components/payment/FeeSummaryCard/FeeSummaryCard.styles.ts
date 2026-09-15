import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F3A",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B1F3A",
    marginBottom: 12,
  },
  rowsList: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B1F3A",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0B1F3A",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F97316",
    letterSpacing: -0.2,
  },
});
