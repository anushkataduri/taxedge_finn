/**
 * Screen: Application Details
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import { StyleSheet } from "react-native";
import { BrandColors } from "../../../shared/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  navyHeader: { backgroundColor: "#0A2346", paddingHorizontal: 16, paddingBottom: 16 },
  topNavRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  backButton: { width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(255, 255, 255, 0.14)", alignItems: "center", justifyContent: "center" },
  navTitle: { fontSize: 17, fontWeight: "700", color: "#FFFFFF", letterSpacing: -0.2 },
  appIdLabel: { fontSize: 12, fontWeight: "600", color: "rgba(255, 255, 255, 0.7)", letterSpacing: 0.5, marginBottom: 6 },
  serviceTitle: { fontSize: 22, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.3, marginBottom: 4 },
  serviceSubtitle: { fontSize: 13.5, color: "rgba(255, 255, 255, 0.85)", fontWeight: "400", marginBottom: 2 },
  tabsContainer: { backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  tabsScrollContent: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 10, alignItems: "center", gap: 8 },
  tabItem: { paddingHorizontal: 12, paddingVertical: 6, alignItems: "center", justifyContent: "center" },
  tabLabel: { fontSize: 13, textAlign: "center", letterSpacing: -0.1 },
  activeTabIndicator: { height: 2.5, width: "100%", minWidth: 24, backgroundColor: "#FF5722", borderRadius: 2, marginTop: 4 },
  inactiveTabIndicator: { height: 2.5, width: "100%", backgroundColor: "transparent", marginTop: 4 },
  scrollContent: { padding: 16, gap: 16 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#F1F5F9", padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1.5 },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  cardHeaderTitle: { fontSize: 15.5, fontWeight: "700", color: "#0A2346", letterSpacing: -0.2 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 2 },
  infoKey: { fontSize: 13.5, color: "#64748B", fontWeight: "500" },
  infoVal: { fontSize: 13.5, color: "#0F172A", fontWeight: "700" },
  infoDivider: { height: 1, backgroundColor: "#F1F5F9" },
  completedCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" },
  currentCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#FF5722", alignItems: "center", justifyContent: "center" },
  pendingCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#CBD5E1", backgroundColor: "#FFFFFF" },
  timelineConnectingLine: { width: 2, flex: 1, minHeight: 28, marginVertical: 4 },
  timelineContentCol: { flex: 1, paddingBottom: 16, paddingRight: 4 },
  timelineStepTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  timelineStepTitle: { fontSize: 14, letterSpacing: -0.1, flex: 1, flexShrink: 1, lineHeight: 19 },
  timelineStepDate: { fontSize: 11.5, color: "#64748B", fontWeight: "500", marginTop: 1, flexShrink: 0 },
  timelineStepSub: { fontSize: 12, color: "#64748B", marginTop: 2, lineHeight: 16 },
  statusPillSmall: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  docItemCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 14, borderWidth: 1, borderColor: "#F1F5F9", padding: 12, gap: 12 },
  docIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  docNameText: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  uploadPeachBtn: { backgroundColor: "#FFF2EA", paddingHorizontal: 12, paddingVertical: 6.5, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 5 },
  uploadPeachBtnText: { color: "#EA580C", fontSize: 12.5, fontWeight: "700" },
  uploadedPill: { backgroundColor: "#EAF2FF", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 4 },
  uploadedPillText: { color: "#083B75", fontSize: 12, fontWeight: "700" },
  bottomActionBar: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingHorizontal: 16, paddingTop: 12, shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 8 },
  actionBtnFilled: { height: 48, borderRadius: 12, backgroundColor: "#FF5722", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  actionBtnFilledText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  errorContent: { flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, alignItems: "center", justifyContent: "center", padding: 24 },
  errorText: { fontSize: 16, fontWeight: "600", color: "#0F172A", marginTop: 12, marginBottom: 16 },

  /* Chat with CA Styles */
  emptyChatWrap: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 20 },
  emptyChatIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FFF2EA", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyChatTitle: { fontSize: 16, fontWeight: "700", color: "#0A2346", textAlign: "center" },
  emptyChatSubtitle: { fontSize: 13, color: "#64748B", textAlign: "center", marginTop: 6, lineHeight: 18 },
  chatSecurityBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#ECFDF5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 14 },
  chatSecurityText: { fontSize: 11, fontWeight: "600", color: "#059669" },

  chatBubbleUser: { alignSelf: "flex-end", backgroundColor: "#083B75", borderRadius: 16, borderBottomRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10, maxWidth: "80%", marginBottom: 10 },
  chatBubbleCA: { alignSelf: "flex-start", backgroundColor: "#F1F5F9", borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10, maxWidth: "80%", marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  chatSenderLabel: { fontSize: 11, fontWeight: "700", marginBottom: 3 },
  chatTextUser: { fontSize: 13.5, color: "#FFFFFF", lineHeight: 19 },
  chatTextCA: { fontSize: 13.5, color: "#0F172A", lineHeight: 19 },
  chatTimeUser: { fontSize: 10, color: "rgba(255,255,255,0.7)", alignSelf: "flex-end", marginTop: 4 },
  chatTimeCA: { fontSize: 10, color: "#94A3B8", alignSelf: "flex-end", marginTop: 4 },

  chatInputBar: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E2E8F0", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingTop: 10, gap: 10 },
  chatTextInput: { flex: 1, minHeight: 42, maxHeight: 100, backgroundColor: "#F8FAFC", borderRadius: 21, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: "#0F172A", borderWidth: 1, borderColor: "#E2E8F0" },
  chatSendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FF5722", alignItems: "center", justifyContent: "center" },
});

