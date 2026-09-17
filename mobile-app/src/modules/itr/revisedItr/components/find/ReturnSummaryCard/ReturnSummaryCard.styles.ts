import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#86EFAC",
    marginTop: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#16A34A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    marginRight: 10,
  },
  headerTextGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0B1F3A",
  },
  ackNumber: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1.5,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#16A34A",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  detailsGrid: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  value: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0B1F3A",
  },
  incomeValue: {
    color: "#EA580C",
  },
});
