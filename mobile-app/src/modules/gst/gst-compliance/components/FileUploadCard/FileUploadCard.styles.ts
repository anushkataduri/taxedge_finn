import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  contentContainer: {
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  fileNameText: {
    fontSize: 14.5,
    fontWeight: "600",
    flex: 1,
  },
  fileSizeText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: -4,
    marginLeft: 40,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E6F5F0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  successBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  secondaryButtonText: {
    fontSize: 13.5,
    fontWeight: "600",
  },
  deleteButton: {
    borderWidth: 1,
  },
  primaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    shadowColor: BrandColors.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  uploadingBox: {
    paddingVertical: 8,
    gap: 8,
  },
  uploadingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  uploadingText: {
    fontSize: 13.5,
    fontWeight: "600",
  },
  uploadingPercent: {
    fontSize: 13.5,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    borderRadius: 3,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "500",
  },
});

export const getCardContainerStyle = (isDark: boolean, hasError: boolean): ViewStyle => ({
  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
  borderColor: hasError ? "#EF4444" : isDark ? "#334155" : "#E2E8F0",
});

export const getUploadingTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? "#F8FAFC" : "#0F172A",
});

export const getProgressBarTrackStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? "#334155" : "#F1F5F9",
});

export const getProgressBarFillStyle = (progress: number): ViewStyle => ({
  width: `${progress}%`,
});

export const getIconWrapStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? "#0F172A" : "#EAF1FE",
});

export const getFileNameTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? "#F8FAFC" : "#0F172A",
});

export const getFileSizeTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? "#94A3B8" : "#64748B",
});

export const getSecondaryButtonStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? "#334155" : "#FFFFFF",
  borderColor: isDark ? "#475569" : "#CBD5E1",
});

export const getSecondaryButtonTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? "#E2E8F0" : "#334155",
});

export const getDeleteButtonStyle = (isDark: boolean): ViewStyle => ({
  backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "#FEE2E2",
  borderColor: isDark ? "#7F1D1D" : "#FECACA",
});

export const getDeleteButtonTextStyle = (): TextStyle => ({
  color: "#DC2626",
});

export const getTitleTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? "#F8FAFC" : "#0F172A",
});

export const getBadgeStyle = (required: boolean, isDark: boolean): ViewStyle => ({
  backgroundColor: required
    ? isDark
      ? "rgba(239, 68, 68, 0.15)"
      : "#FEE2E2"
    : isDark
    ? "rgba(100, 116, 139, 0.2)"
    : "#F1F5F9",
});

export const getBadgeTextStyle = (required: boolean, isDark: boolean): TextStyle => ({
  color: required ? "#DC2626" : isDark ? "#94A3B8" : "#64748B",
});

export const getCameraSecondaryButtonTextStyle = (isDark: boolean): TextStyle => ({
  color: isDark ? "#F8FAFC" : "#1E293B",
});
