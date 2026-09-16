import { StyleSheet, Platform } from "react-native";
import {
  BrandColors,
  BorderRadius,
  BorderWidth,
  Spacing,
  Typography,
} from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.BACKGROUND,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingBottom: 10,
    backgroundColor: BrandColors.WHITE,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: BrandColors.BORDER,
    backgroundColor: BrandColors.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleGroup: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSize.base + 1,
    fontWeight: Typography.fontWeight.bold,
    color: BrandColors.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: BrandColors.PRIMARY_ORANGE,
    marginTop: 1,
  },
  headerRightSpacer: {
    width: 38,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "#E2E8F0",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    width: "20%", // Step 1 of 5
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 40,
  },

  // Info Notice Card
  infoNotice: {
    backgroundColor: BrandColors.PRIMARY_LIGHT_BLUE,
    borderRadius: BorderRadius.md,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    borderWidth: BorderWidth.thin,
    borderColor: "#BFDBFE",
    gap: 8,
  },
  infoNoticeText: {
    flex: 1,
    fontSize: Typography.fontSize.xs + 1,
    color: BrandColors.PRIMARY_BLUE,
    lineHeight: 18,
  },

  // Section Card
  sectionCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    borderWidth: BorderWidth.thin,
    borderColor: BrandColors.BORDER,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: "#F1F5F9",
  },
  sectionNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BrandColors.PRIMARY_LIGHT_ORANGE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  sectionNumberText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: BrandColors.PRIMARY_ORANGE_DARK,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: BrandColors.TEXT_PRIMARY,
  },

  // Input Fields
  fieldGroup: {
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
  },
  fieldRowItem: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.semiBold,
    color: BrandColors.TEXT_PRIMARY,
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: "#DC2626",
  },
  textInput: {
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: BrandColors.BORDER,
    paddingHorizontal: 14,
    fontSize: Typography.fontSize.sm + 0.5,
    color: BrandColors.TEXT_PRIMARY,
    backgroundColor: BrandColors.WHITE,
    includeFontPadding: false,
  },
  textInputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  textInputReadOnly: {
    backgroundColor: "#F8FAFC",
    color: BrandColors.TEXT_SECONDARY,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: "#DC2626",
    marginTop: 4,
    fontWeight: Typography.fontWeight.medium,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: BrandColors.TEXT_SECONDARY,
    marginTop: 4,
  },

  // IFSC status container
  ifscRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ifscInputWrap: {
    flex: 1,
  },
  ifscLoadingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  ifscLoadingText: {
    fontSize: Typography.fontSize.xs,
    color: BrandColors.PRIMARY_ORANGE,
    fontWeight: Typography.fontWeight.medium,
  },
  ifscSuccessBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    padding: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: BorderWidth.thin,
    borderColor: "#BBF7D0",
    marginTop: 6,
    gap: 6,
  },
  ifscSuccessText: {
    fontSize: Typography.fontSize.xs,
    color: "#16A34A",
    fontWeight: Typography.fontWeight.bold,
  },

  // Toggle Chip Row (Yes / No)
  toggleSection: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: BrandColors.BORDER,
  },
  toggleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleQuestion: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: BrandColors.TEXT_PRIMARY,
    flex: 1,
    marginRight: 8,
  },
  chipGroup: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: BorderWidth.thin,
    borderColor: BrandColors.BORDER,
    backgroundColor: BrandColors.WHITE,
  },
  chipActive: {
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    borderColor: BrandColors.PRIMARY_ORANGE,
  },
  chipText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: Typography.fontWeight.semiBold,
    color: BrandColors.TEXT_SECONDARY,
  },
  chipTextActive: {
    color: BrandColors.WHITE,
  },
  conditionalFields: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: "#E2E8F0",
  },

  // Regime Selector
  regimeSelector: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  regimeOption: {
    flex: 1,
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    borderColor: BrandColors.BORDER,
    backgroundColor: BrandColors.WHITE,
    alignItems: "center",
  },
  regimeOptionActive: {
    borderColor: BrandColors.PRIMARY_ORANGE,
    backgroundColor: BrandColors.PRIMARY_LIGHT_ORANGE,
  },
  regimeTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: BrandColors.TEXT_PRIMARY,
  },
  regimeTitleActive: {
    color: BrandColors.PRIMARY_ORANGE_DARK,
  },
  regimeDesc: {
    fontSize: 10,
    color: BrandColors.TEXT_SECONDARY,
    marginTop: 2,
    textAlign: "center",
  },

  // Live Estimate Banner in Screen 1
  previewEstimateBanner: {
    backgroundColor: BrandColors.PRIMARY_BLUE_DARK,
    borderRadius: BorderRadius.base,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  previewLeft: {
    flex: 1,
  },
  previewLabel: {
    fontSize: Typography.fontSize.xs,
    color: "#94A3B8",
    fontWeight: Typography.fontWeight.medium,
  },
  previewAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "800",
    color: BrandColors.PRIMARY_ORANGE,
    marginTop: 2,
  },
  previewRight: {
    alignItems: "flex-end",
  },
  previewTag: {
    fontSize: Typography.fontSize.xs,
    color: "#CBD5E1",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },

  // Sticky Bottom CTA Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BrandColors.WHITE,
    paddingHorizontal: Spacing.base,
    paddingTop: 10,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F3A",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  ctaButton: {
    height: 50,
    borderRadius: BorderRadius.base,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  ctaButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: BrandColors.WHITE,
  },
});
