import { StyleSheet, Platform, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  bottomBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    ...Platform.select({
      ios: {
        shadowColor: "#0B1F3A",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  ctaButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#F97316",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  ctaButtonDisabled: {
    backgroundColor: "#FDBA74",
    opacity: 0.8,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export const getContainerInsetsStyle = (topInset: number): ViewStyle => ({
  paddingTop: topInset,
});

export const getBottomBarInsetsStyle = (bottomInset: number): ViewStyle => ({
  paddingBottom: Math.max(bottomInset, 14),
});
