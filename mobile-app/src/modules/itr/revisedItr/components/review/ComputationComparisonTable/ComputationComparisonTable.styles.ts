import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 12,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerCell: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#64748B",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  cell: {
    fontSize: 12,
    color: "#0B1F3A",
    fontWeight: "600",
  },
  particularCol: {
    flex: 1.4,
    paddingRight: 4,
  },
  valueCol: {
    flex: 1,
    textAlign: "right",
    paddingRight: 6,
  },
  changeCol: {
    flex: 1,
    textAlign: "right",
  },
  highlightText: {
    color: "#EA580C",
    fontWeight: "800",
  },
  neutralText: {
    color: "#64748B",
  },
});
