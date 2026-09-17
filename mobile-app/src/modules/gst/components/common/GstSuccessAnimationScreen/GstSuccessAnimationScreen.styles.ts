import { StyleSheet, Platform, Animated } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    paddingVertical: 36,
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  rippleRing: {
    position: "absolute",
    borderRadius: 999,
  },
  rippleOuter: {
    width: 170,
    height: 170,
    backgroundColor: "#DBEAFE",
  },
  rippleMiddle: {
    width: 140,
    height: 140,
    backgroundColor: "#EFF6FF",
  },
  rippleInner: {
    width: 110,
    height: 110,
    backgroundColor: "#F0F7FF",
  },
  mainIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#3B82F6",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  certIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  certBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  reprintContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  planeIcon: {
    position: "absolute",
    right: -14,
    top: -14,
  },
  textCol: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: BrandColors.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: 12,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  subtitle: {
    fontSize: 13.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
  },
  btnWrapper: {
    width: "100%",
  },
  orangeBtn: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BrandColors.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
});

export const getRippleAnimatedStyle = (
  rippleAnim: Animated.Value,
  rippleOpacity: Animated.Value
): any => ({
  transform: [{ scale: rippleAnim }],
  opacity: rippleOpacity,
});

export const getMainIconAnimatedStyle = (
  scaleAnim: Animated.Value,
  opacityAnim: Animated.Value
): any => ({
  transform: [{ scale: scaleAnim }],
  opacity: opacityAnim,
});

export const getContentAnimatedStyle = (
  contentAnim: Animated.Value,
  opacityAnim: Animated.Value
): any => ({
  transform: [{ translateY: contentAnim }],
  opacity: opacityAnim,
});

export const getBtnAnimatedStyle = (btnScale: Animated.Value): any => ({
  transform: [{ scale: btnScale }],
});
