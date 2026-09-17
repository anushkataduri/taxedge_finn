

import { StyleSheet } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  star: {
    color: "#EF4444",
  },
  inputWrapper: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14.5,
  },
  selectorBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    fontSize: 14.5,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "500",
  },
  submitWrapper: {
    marginTop: 8,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BrandColors.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.WHITE,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    gap: 12,
  },
  dialogIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 122, 0, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  dialogMessage: {
    fontSize: 13.5,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 8,
  },
  dialogActionsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  dialogCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dialogCancelText: {
    fontSize: 14.5,
    fontWeight: "600",
  },
  dialogConfirmBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  dialogResumeBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: BrandColors.PRIMARY_BLUE_ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },
  dialogConfirmText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: BrandColors.WHITE,
  },
});

export const getRootThemeStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
});

export const getCardThemeStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? "#1E293B" : BrandColors.WHITE,
  borderColor: isDark ? "#334155" : "#E2E8F0",
});

export const getTextThemeStyle = (isDark: boolean) => ({
  color: isDark ? "#F8FAFC" : "#0F172A",
});

export const getLabelThemeStyle = (isDark: boolean) => ({
  color: isDark ? "#E2E8F0" : "#334155",
});

export const getInputWrapperThemeStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
  borderColor: isDark ? "#334155" : "#CBD5E1",
});

export const getSubmitBtnThemeStyle = (isSubmitting: boolean) => ({
  backgroundColor: isSubmitting ? "#CBD5E1" : BrandColors.PRIMARY_ORANGE,
});

export const getDialogCardThemeStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? "#1E293B" : BrandColors.WHITE,
  borderColor: isDark ? "#334155" : "#E2E8F0",
});

export const getDialogMessageThemeStyle = (isDark: boolean) => ({
  color: isDark ? "#94A3B8" : "#64748B",
});

export const getDialogCancelBtnThemeStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? "#334155" : "#F1F5F9",
});

export const getDialogCancelTextThemeStyle = (isDark: boolean) => ({
  color: isDark ? "#E2E8F0" : "#475569",
});
