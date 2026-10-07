import { StyleSheet } from "react-native";
import { Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 14,
  },
  categoryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  categoryIconBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: "#FEF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
