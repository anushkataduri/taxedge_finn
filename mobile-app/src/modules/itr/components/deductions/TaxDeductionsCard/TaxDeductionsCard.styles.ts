import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F3A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
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
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B1F3A",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  textAreaContainer: {
    marginTop: 4,
    marginBottom: 14,
  },
  textAreaLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#0B1F3A",
    marginBottom: 6,
  },
  textAreaWrapper: {
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
    minHeight: 88,
    justifyContent: "space-between",
  },
  textArea: {
    fontSize: 13,
    color: "#0B1F3A",
    lineHeight: 18,
    padding: 0,
    textAlignVertical: "top",
    minHeight: 48,
  },
  charCounter: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "right",
    marginTop: 4,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  requiredStar: {
    color: "#DC2626",
    fontWeight: "700",
  },
});
