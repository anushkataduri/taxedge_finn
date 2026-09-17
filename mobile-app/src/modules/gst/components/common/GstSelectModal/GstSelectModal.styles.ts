import { StyleSheet, Platform } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingTop: 18,
    paddingBottom: Platform.select({ ios: 36, android: 24 }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    maxHeight: 380,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  optionItemActive: {
    borderColor: BrandColors.PRIMARY_ORANGE,
    backgroundColor: "#FEF0E6",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
    paddingRight: 10,
  },
  optionTextActive: {
    color: BrandColors.PRIMARY_ORANGE,
    fontWeight: "700",
  },
});
