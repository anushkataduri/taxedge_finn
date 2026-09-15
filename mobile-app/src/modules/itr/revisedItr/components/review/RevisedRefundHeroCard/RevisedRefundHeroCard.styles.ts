import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F0FDF4",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  rupeeIcon: {
    fontSize: 22,
    fontWeight: "800",
    color: "#16A34A",
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },
  amount: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0B1F3A",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "400",
  },
});
