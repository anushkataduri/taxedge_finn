import { StyleSheet, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B1F3A",
  },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#F97316",
    borderRadius: 3,
  },
});

export const getFillProgressStyle = (percentage: number): ViewStyle => ({
  width: `${percentage}%`,
});
