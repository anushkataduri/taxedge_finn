import { StyleSheet } from "react-native";
import { BrandColors } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.WHITE,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BrandColors.WHITE,
  },
  circularBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenterContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F2052",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EA580C",
    marginTop: 2,
    textAlign: "center",
  },
  progressBarTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "#E2E8F0",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#EA580C",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BrandColors.WHITE,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
  },
  prevBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#0F2052",
    backgroundColor: BrandColors.WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  prevBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F2052",
  },
  continueBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#EA580C",
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnFlex: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#EA580C",
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnDisabled: {
    backgroundColor: "#FDBA74",
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: BrandColors.WHITE,
  },
});
