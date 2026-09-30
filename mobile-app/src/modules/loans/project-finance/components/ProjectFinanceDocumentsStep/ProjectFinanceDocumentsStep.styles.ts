import { StyleSheet } from "react-native";
import { BrandColors, Typography, BorderRadius } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: "#64748B",
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.md || 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: "#0F172A",
  },
  progressCount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE_DARK || "#EA580C",
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  categoryContainer: {
    marginBottom: 18,
  },
  categoryHeader: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 2,
  },
  docCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.md || 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  docCardUploaded: {
    borderColor: "#86EFAC",
    backgroundColor: "#F0FDF4",
  },
  docLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
  },
  docNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  docName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "600",
    color: "#0F172A",
  },
  mandatoryStar: {
    color: "#EF4444",
    fontSize: Typography.fontSize.xs,
  },
  uploadedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  uploadedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  requiredBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#EF4444",
  },
  optionalBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  optionalText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  docSubtitle: {
    fontSize: Typography.fontSize.xs - 1,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  docDescription: {
    fontSize: Typography.fontSize.xs - 1,
    color: "#64748B",
    marginTop: 2,
  },
  fileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  fileNameText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#15803D",
    maxWidth: 160,
  },
  fileSizeText: {
    fontSize: 10,
    color: "#64748B",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF0E6",
    borderWidth: 1,
    borderColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  uploadButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE_DARK || "#EA580C",
  },
  replaceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  replaceButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: "#16A34A",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  sheetContent: {
    backgroundColor: BrandColors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
    color: "#0F172A",
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 12,
  },
  sheetOptionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "600",
    color: "#1E293B",
  },
});

export const getProgressFillStyle = (percent: number) => ({
  height: "100%" as const,
  width: `${percent}%` as any,
  backgroundColor:
    percent === 100 ? "#16A34A" : BrandColors.PRIMARY_ORANGE || "#EA580C",
  borderRadius: 3,
});

export const getIconBoxStyle = (bgColor?: string) => ({
  backgroundColor: bgColor || "#F1F5F9",
});
