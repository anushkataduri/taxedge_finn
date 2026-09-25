/**
 * Screen: GST Amendment
 * Follows exact structural and UX references from design screenshots.
 * STRICT: Preserves TaxEdge Orange + Blue theme (NO green theme).
 */

import { StyleSheet, Platform, Dimensions } from "react-native";
import {
  BrandColors,
  BorderRadius,
  BorderWidth,
  Spacing,
  Typography,
} from "@/shared/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 40,
  },

  /* ---------------- HEADERS ---------------- */
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingBottom: 12,
    backgroundColor: "#F8FAFC",
  },
  roundBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF1FE",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 14,
  },
  headerMainTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 2,
  },
  placeholderBox: {
    width: 40,
  },

  /* ---------------- TOP INFO BANNER ---------------- */
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EAF1FE",
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: 14,
    marginTop: 12,
    marginBottom: 18,
  },
  infoIconBox: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.fontSize.sm + 0.5,
    lineHeight: 20,
    color: "#083B75",
    fontWeight: "500",
  },

  /* ---------------- GSTIN INPUT ---------------- */
  gstinBlock: {
    marginBottom: 20,
  },
  gstinLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  star: {
    color: "#EF4444",
  },
  gstinInput: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingHorizontal: 16,
    fontSize: Typography.fontSize.base + 1,
    color: "#0F172A",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  gstinInputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  gstinCounterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  charCountText: {
    fontSize: Typography.fontSize.xs + 1,
    color: "#94A3B8",
    fontWeight: "500",
    alignSelf: "flex-end",
  },
  errorText: {
    fontSize: Typography.fontSize.xs + 1.5,
    color: "#DC2626",
    fontWeight: "500",
  },

  /* ---------------- SECTION HEADERS & CARDS ---------------- */
  sectionHeading: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    marginTop: 6,
  },
  cardGroup: {
    gap: 12,
    marginBottom: 24,
  },
  amendmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base + 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardContentCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base + 1,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "500",
    color: "#64748B",
  },
  cardChevron: {
    marginLeft: 8,
  },

  /* ---------------- EDIT SECTION FORM ---------------- */
  editContainer: {
    gap: 18,
    marginTop: 4,
  },
  currentRegisteredCard: {
    backgroundColor: "#F1F5F9",
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 12,
  },
  currentRegisteredHeader: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: "800",
    color: "#0F172A",
  },
  currentRegisteredSubtitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: "500",
    color: "#64748B",
  },
  currentFieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 4,
  },
  currentFieldLabel: {
    fontSize: Typography.fontSize.sm,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
  },
  currentFieldValue: {
    fontSize: Typography.fontSize.sm + 0.5,
    color: "#0F172A",
    fontWeight: "700",
    flex: 1.5,
    textAlign: "right",
  },
  formSectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
    marginBottom: -6,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: "700",
    color: "#0F172A",
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    fontSize: Typography.fontSize.base,
    color: "#0F172A",
    fontWeight: "500",
  },
  textArea: {
    minHeight: 88,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    padding: 14,
    fontSize: Typography.fontSize.base,
    color: "#0F172A",
    textAlignVertical: "top",
    fontWeight: "500",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  dropdownSelect: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownSelectText: {
    fontSize: Typography.fontSize.base,
    color: "#0F172A",
    fontWeight: "500",
  },
  dropdownPlaceholderText: {
    fontSize: Typography.fontSize.base,
    color: "#94A3B8",
    fontWeight: "500",
  },
  fieldCounterRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  fieldCounterText: {
    fontSize: Typography.fontSize.xs + 1,
    color: "#94A3B8",
    fontWeight: "500",
  },

  /* Address Proof Pills (Registration Style) */
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  pillSelected: {
    backgroundColor: "#FFF1E8",
    borderColor: BrandColors.PRIMARY_ORANGE,
  },
  pillText: {
    fontSize: Typography.fontSize.sm,
    color: "#475569",
    fontWeight: "500",
  },
  pillTextSelected: {
    color: BrandColors.PRIMARY_ORANGE_DARK,
    fontWeight: "700",
  },

  /* ---------------- SUPPORTING PROOF CARD ---------------- */
  proofCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base + 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  proofDescText: {
    fontSize: Typography.fontSize.sm,
    color: "#64748B",
    lineHeight: 20,
  },
  uploadActionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  uploadBtn: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: "#083B75",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadBtnText: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: "700",
    color: "#083B75",
  },
  proofErrorText: {
    fontSize: Typography.fontSize.sm,
    color: "#DC2626",
    fontWeight: "500",
  },

  /* Uploaded Document Preview */
  docPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },
  docPreviewIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EAF1FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  docPreviewInfo: {
    flex: 1,
  },
  docPreviewName: {
    fontSize: Typography.fontSize.sm + 0.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  docPreviewSize: {
    fontSize: Typography.fontSize.xs + 1,
    color: "#64748B",
    marginTop: 2,
  },
  docSelectedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  docSelectedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#166534",
  },
  docRemoveBtn: {
    padding: 4,
  },
  docDeleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  docDeleteText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: "#DC2626",
  },

  /* Dropdown Picker Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: Typography.fontSize.md + 1,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalOptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  modalOptionText: {
    fontSize: Typography.fontSize.base,
    color: "#334155",
    fontWeight: "500",
  },
  modalOptionSelectedText: {
    color: BrandColors.PRIMARY_BLUE,
    fontWeight: "700",
  },

  /* ---------------- REVIEW SCREEN ---------------- */
  reviewMetaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base + 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewMetaKey: {
    fontSize: Typography.fontSize.sm + 0.5,
    color: "#64748B",
    fontWeight: "500",
  },
  reviewMetaVal: {
    fontSize: Typography.fontSize.sm + 1,
    color: "#0F172A",
    fontWeight: "700",
  },
  reviewMetaDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  /* Requested Details Card (Review) */
  requestedDetailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base + 2,
    borderWidth: 1.5,
    borderColor: "#FFD8BF",
    padding: 16,
    gap: 10,
  },
  requestedCardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestedCardTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "800",
    color: BrandColors.PRIMARY_ORANGE_DARK,
    letterSpacing: 0.5,
  },
  editOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF1E8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  editOptionText: {
    fontSize: Typography.fontSize.xs + 1.5,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
  },
  reviewFieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 4,
    gap: 12,
  },
  reviewFieldLabel: {
    fontSize: Typography.fontSize.sm,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
  },
  reviewFieldValue: {
    fontSize: Typography.fontSize.sm,
    color: "#0F172A",
    fontWeight: "700",
    flex: 1.4,
    textAlign: "right",
  },

  /* Current vs Requested Side-by-Side (Deprecated fallback) */
  comparisonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  compareCard: {
    flex: 1,
    borderRadius: BorderRadius.base,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  currentCard: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  requestedCard: {
    backgroundColor: "#FFF1E8",
    borderColor: BrandColors.PRIMARY_ORANGE,
  },
  compareCardHeader: {
    fontSize: Typography.fontSize.xs + 1.5,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  currentCardHeader: {
    color: "#475569",
  },
  requestedCardHeader: {
    color: BrandColors.PRIMARY_ORANGE_DARK,
  },
  compareFieldLabel: {
    fontSize: Typography.fontSize.xs + 1,
    color: "#64748B",
    fontWeight: "500",
  },
  compareFieldValue: {
    fontSize: Typography.fontSize.sm + 0.5,
    color: "#0F172A",
    fontWeight: "700",
  },

  /* Supporting Documents Card (Review) */
  reviewDocsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base + 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 10,
  },
  reviewDocsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "800",
    color: "#0F172A",
  },
  reviewDocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewDocName: {
    fontSize: Typography.fontSize.sm + 0.5,
    color: "#334155",
    fontWeight: "500",
    flex: 1,
  },
  reviewDocSize: {
    fontSize: Typography.fontSize.sm,
    color: "#0F172A",
    fontWeight: "700",
    marginLeft: 12,
  },

  /* Declaration Card */
  declarationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EAF1FE",
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: 14,
    gap: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: "#083B75",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: "#083B75",
    borderColor: "#083B75",
  },
  declarationText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: "#083B75",
    fontWeight: "500",
    lineHeight: 20,
  },

  /* ---------------- SUCCESS / SUBMITTED SCREEN ---------------- */
  successContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  successHero: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: "center",
    paddingBottom: 42,
  },
  successHeroIconBox: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successHeroCheckCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  successHeroTitle: {
    fontSize: Typography.fontSize.hero - 1,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: Spacing.base,
    marginTop: -22,
    padding: 22,
    gap: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  successRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  successRowKey: {
    fontSize: Typography.fontSize.sm + 1,
    color: "#64748B",
    fontWeight: "500",
  },
  successRowVal: {
    fontSize: Typography.fontSize.base,
    color: "#0F172A",
    fontWeight: "800",
  },
  successDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  successActionsWrap: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: Spacing.base,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  /* ---------------- CTA BUTTONS ---------------- */
  bottomBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: Spacing.base,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 16 : 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BrandColors.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: Typography.fontSize.md,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.8,
    borderColor: BrandColors.PRIMARY_BLUE,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: Typography.fontSize.md,
    fontWeight: "800",
    color: BrandColors.PRIMARY_BLUE,
  },

  /* ---------------- PHONE INPUT WITH PREFIX (+91) ---------------- */
  phoneInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    overflow: "hidden",
  },
  phonePrefixBox: {
    height: "100%",
    paddingHorizontal: 14,
    backgroundColor: "#F1F5F9",
    borderRightWidth: 1,
    borderRightColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  phonePrefixText: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
    color: "#0F172A",
  },
  phoneTextInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: Typography.fontSize.base,
    color: "#0F172A",
    fontWeight: "500",
  },

  /* ---------------- DATE INPUT WITH CALENDAR ICON ---------------- */
  dateInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.base,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
  },
  dateTextInput: {
    flex: 1,
    height: "100%",
    fontSize: Typography.fontSize.base,
    color: "#0F172A",
    fontWeight: "500",
  },
  dateIconBox: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------------- ACCEPTED PROOFS CARD ---------------- */
  acceptedProofsCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: BorderRadius.base + 2,
    borderWidth: 1,
    borderColor: "#FFEDD5",
    padding: 16,
    marginTop: 14,
  },
  acceptedProofsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  acceptedProofsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
    color: "#0F172A",
  },
  acceptedProofList: {
    marginTop: 2,
  },
  acceptedProofItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingRight: 4,
  },
  acceptedProofDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    marginTop: 7,
    marginRight: 8,
  },
  acceptedProofBullet: {
    fontSize: 14,
    color: "#334155",
    marginRight: 8,
    lineHeight: 20,
  },
  acceptedProofText: {
    flex: 1,
    fontSize: 13.5,
    color: "#334155",
    lineHeight: 20,
    fontWeight: "400",
  },
  viewMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 4,
  },
  viewMoreText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 24,
  },
  gap8: {
    gap: 8,
  },
  gap6: {
    gap: 6,
  },
  noDocText: {
    color: "#94A3B8",
  },
});
