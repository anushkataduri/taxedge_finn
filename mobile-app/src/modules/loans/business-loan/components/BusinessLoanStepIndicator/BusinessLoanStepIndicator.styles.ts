import { StyleSheet } from "react-native";
import { BrandColors } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: BrandColors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    zIndex: 2,
  },
  stepCircleActive: {
    backgroundColor: "#EA580C",
    borderColor: "#EA580C",
  },
  stepCircleCompleted: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  stepNumberActive: {
    color: BrandColors.WHITE,
  },
  stepTitle: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 6,
    fontWeight: "500",
    textAlign: "center",
  },
  stepTitleActive: {
    color: "#EA580C",
    fontWeight: "700",
  },
  stepLine: {
    position: "absolute",
    top: 15,
    left: "50%",
    right: "-50%",
    height: 2,
    backgroundColor: "#E2E8F0",
    zIndex: 1,
  },
  stepLineCompleted: {
    backgroundColor: "#16A34A",
  },
});
