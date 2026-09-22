import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../../hooks/use-theme";
import { Spacing, BrandColors } from "../../../shared/theme";
import { useAuthStore } from "../store/authStore";
import {
  MobileNumberSection,
  OTPSection,
  PasscodeLoginSection,
  ResetPasscodeSection,
  GoogleLoginSection,
  ErrorBanner,
} from "../components";
import { authStorage } from "../services/authStorage";
import { biometricService } from "../services/biometricService";
import { BiometricPromptModal } from "../../../shared/components/BiometricPromptModal";
import { ServerConfigModal } from "../../../shared/components/ServerConfigModal";
import {
  styles,
  getThemedStyles,
  getDynamicScrollStyle,
} from "./AuthenticationScreen.styles";

const HEADER_OFFSET = Spacing.md;
const FOOTER_OFFSET = Spacing.base;
const MIN_SCROLL_PADDING = Spacing.xl + Spacing.xs;

export function AuthenticationScreen() {
  const colors = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    isLoggedIn,
    authFlowState,
    mobileNumber,
    otp,
    passcode,
    confirmPasscode,
    isLoading,
    error,
    otpTimer,
    canResendOTP,
    setMobileNumber,
    setOtp,
    setPasscode,
    setConfirmPasscode,
    setError,
    decrementTimer,
    sendOtp,
    verifyOtp,
    loginWithPasscode,
    startForgotPasscode,
    verifyForgotPasscodeOtp,
    resetPasscodeAndProceed,
    resendOtp,
    changeNumber,
    setAuthFlowState,
    isBiometricEnabled,
    syncFromDevAuth,
  } = useAuthStore();

  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricType, setBiometricType] = useState("Fingerprint");
  const [showServerModal, setShowServerModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // If already authenticated, redirect to home (unless biometric opt-in modal is open)
  useEffect(() => {
    if (isLoggedIn && !showBiometricModal) {
      router.replace("/(main)/home" as any);
    }
  }, [isLoggedIn, showBiometricModal]);

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const isOtpActive =
      authFlowState === "OTP_VERIFICATION" || authFlowState === "FORGOT_PASSCODE_OTP";
    if (isOtpActive && otpTimer > 0) {
      interval = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authFlowState, otpTimer]);

  // Animate on state transition
  useEffect(() => {
    fadeAnim.setValue(0.3);
    slideAnim.setValue(10);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [authFlowState]);

  const handleMobileSubmit = async () => {
    await sendOtp();
  };

  const handleOtpVerify = async (code?: string) => {
    const res = await verifyOtp(code);
    if (res.success && !res.requiresPasscode) {
      router.replace("/(main)/home" as any);
    }
  };

  const handleLoginSubmit = async () => {
    const res = await loginWithPasscode();
    if (res.success) {
      try {
        const hasHardware = await biometricService.checkHardwareSupport();
        const isEnrolled = await biometricService.checkEnrollment();
        const isAlreadyEnabled = await biometricService.isBiometricEnabled();

        if (hasHardware && isEnrolled && !isAlreadyEnabled) {
          const typeLabel = await biometricService.getBiometricTypeLabel();
          setBiometricType(typeLabel);
          setShowBiometricModal(true);
          return;
        }
      } catch { }

      router.replace("/(main)/home" as any);
    }
  };

  const handleEnableBiometric = async () => {
    setShowBiometricModal(false);
    try {
      const authRes = await biometricService.authenticate();
      if (authRes.success) {
        await useAuthStore.getState().setBiometricEnabled(true);
      }
    } catch { }
    router.replace("/(main)/home" as any);
  };

  const handleNotNowBiometric = () => {
    setShowBiometricModal(false);
    router.replace("/(main)/home" as any);
  };

  const handleBiometricLogin = async () => {
    try {
      const typeLabel = await biometricService.getBiometricTypeLabel();
      const authRes = await biometricService.authenticate(`Authenticate with ${typeLabel}`);
      if (authRes.success) {
        const activeMobile = mobileNumber || authStorage.getSession().activeMobile;
        if (activeMobile) {
          authStorage.saveSession({
            isLoggedIn: true,
            activeMobile: activeMobile,
            lastLoginAt: new Date().toISOString(),
          });
          syncFromDevAuth();
          router.replace("/(main)/home" as any);
        }
      } else if (!authRes?.cancelled && authRes?.error && authRes.error !== "Authentication cancelled") {
        setError(authRes.error);
      }
    } catch (e: any) {
      setError(e?.message || "Biometric authentication failed");
    }
  };

  const handleForgotPasscode = async () => {
    await startForgotPasscode();
  };

  const handleForgotPasscodeOtpVerify = async (code?: string) => {
    await verifyForgotPasscodeOtp(code);
  };

  const handleResetPasscodeSubmit = async () => {
    await resetPasscodeAndProceed();
  };

  const isMobileReadOnly = authFlowState !== "ENTER_MOBILE";
  const themed = getThemedStyles(
    colors,
    isDark,
    insets.top,
    HEADER_OFFSET,
    MIN_SCROLL_PADDING
  );
  const dynamicScroll = getDynamicScrollStyle(
    insets.top,
    insets.bottom,
    HEADER_OFFSET,
    FOOTER_OFFSET,
    MIN_SCROLL_PADDING
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, themed.container]}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, dynamicScroll]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {authFlowState === "RESET_PASSCODE" && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAuthFlowState("PASSCODE_LOGIN")}
            style={[styles.backBtnAbsolute, themed.backBtnAbsolute]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={isDark ? "#FFFFFF" : BrandColors.PRIMARY_BLUE_DARK}
            />
          </TouchableOpacity>
        )}

        <View style={styles.wrapper}>
          {/* Header & Branding (Long-press to configure server IP) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onLongPress={() => setShowServerModal(true)}
            delayLongPress={500}
            style={styles.header}
          >
            <Image
              source={require("../../../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.brandTitle, themed.brandTitle]}>TAXEDGE</Text>
            <Text style={[styles.brandSub, themed.brandSub]}>FIN SOLUTIONS</Text>
          </TouchableOpacity>

          {/* Welcome Title - Only shown on initial Mobile Number Login Screen */}
          {authFlowState === "ENTER_MOBILE" && (
            <View style={styles.welcome}>
              <Text style={[styles.welcomeTitle, themed.welcomeTitle]}>Welcome Back 👋</Text>

            </View>
          )}

          {/* Error Banner */}
          {authFlowState !== "RESET_PASSCODE" && (
            <>
              <ErrorBanner error={error} onDismiss={() => setError(null)} />
              {error && (
                error.toLowerCase().includes("server") ||
                error.toLowerCase().includes("connect") ||
                error.toLowerCase().includes("network") ||
                error.toLowerCase().includes("url") ||
                error.toLowerCase().includes("fetch")
              ) && (
                  <TouchableOpacity
                    onPress={() => setShowServerModal(true)}
                    style={styles.serverConfigBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.serverConfigBtnText}>
                      ⚙️ Tap to change Server IP / URL
                    </Text>
                  </TouchableOpacity>
                )}
            </>
          )}

          {/* Form Body with Animated Transition */}
          <Animated.View
            style={[
              styles.formBody,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* 1. ENTER_MOBILE or OTP_VERIFICATION */}
            {(authFlowState === "ENTER_MOBILE" || authFlowState === "OTP_VERIFICATION") && (
              <>
                <MobileNumberSection
                  mobile={mobileNumber}
                  onChangeMobile={setMobileNumber}
                  onSubmit={handleMobileSubmit}
                  isReadOnly={isMobileReadOnly}
                  onChangeNumber={changeNumber}
                  loading={isLoading && authFlowState === "ENTER_MOBILE"}
                  showContinueButton={authFlowState === "ENTER_MOBILE"}
                />

                {authFlowState === "OTP_VERIFICATION" && (
                  <OTPSection
                    otp={otp}
                    onChangeOtp={setOtp}
                    onVerify={handleOtpVerify}
                    onResend={resendOtp}
                    timer={otpTimer}
                    canResend={canResendOTP}
                    loading={isLoading}
                    verifyButtonTitle="Verify OTP"
                  />
                )}

                <GoogleLoginSection disabled={isLoading} />
              </>
            )}

            {/* 2. PASSCODE_LOGIN (Existing User) */}
            {authFlowState === "PASSCODE_LOGIN" && (
              <>
                <MobileNumberSection
                  mobile={mobileNumber}
                  onChangeMobile={setMobileNumber}
                  onSubmit={() => { }}
                  isReadOnly={true}
                  onChangeNumber={changeNumber}
                  loading={false}
                  showContinueButton={false}
                />

                <PasscodeLoginSection
                  passcode={passcode}
                  onChangePasscode={setPasscode}
                  onLogin={handleLoginSubmit}
                  onForgotPasscode={handleForgotPasscode}
                  loading={isLoading}
                  onBiometricLogin={handleBiometricLogin}
                  isBiometricEnabled={isBiometricEnabled}
                  biometricTypeLabel={biometricType}
                />

                <GoogleLoginSection disabled={isLoading} />
              </>
            )}

            {/* 3. FORGOT_PASSCODE_OTP */}
            {authFlowState === "FORGOT_PASSCODE_OTP" && (
              <>
                <MobileNumberSection
                  mobile={mobileNumber}
                  onChangeMobile={setMobileNumber}
                  onSubmit={() => { }}
                  isReadOnly={true}
                  onChangeNumber={() => setAuthFlowState("PASSCODE_LOGIN")}
                  loading={false}
                  showContinueButton={false}
                />

                <OTPSection
                  otp={otp}
                  onChangeOtp={setOtp}
                  onVerify={handleForgotPasscodeOtpVerify}
                  onResend={resendOtp}
                  timer={otpTimer}
                  canResend={canResendOTP}
                  loading={isLoading}
                  verifyButtonTitle="Verify Reset Code"
                />
              </>
            )}

            {/* 4. RESET_PASSCODE */}
            {authFlowState === "RESET_PASSCODE" && (
              <ResetPasscodeSection
                passcode={passcode}
                confirmPasscode={confirmPasscode}
                onChangePasscode={setPasscode}
                onChangeConfirmPasscode={setConfirmPasscode}
                onSubmit={handleResetPasscodeSubmit}
                loading={isLoading}
                error={error}
                mobileNumber={mobileNumber}
              />
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Biometric Enable Prompt Modal */}
      <BiometricPromptModal
        visible={showBiometricModal}
        biometricType={biometricType}
        onEnable={handleEnableBiometric}
        onNotNow={handleNotNowBiometric}
      />

      {/* Server Configuration Modal */}
      <ServerConfigModal
        visible={showServerModal}
        onClose={() => setShowServerModal(false)}
      />
    </KeyboardAvoidingView>
  );
}

export default AuthenticationScreen;
