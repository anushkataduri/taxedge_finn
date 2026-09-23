import { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { LandingScreen } from "../components/landing/LandingScreen";
import { biometricService } from "../modules/authentication/services/biometricService";
import { passcodeService } from "../modules/authentication/services/passcodeService";
import { authStorage } from "../modules/authentication/services/authStorage";

export default function Index() {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  const hasTriggeredLaunch = useRef(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function handleAppLaunch() {
      if (hasTriggeredLaunch.current) return;
      hasTriggeredLaunch.current = true;

      try {
        // Wait for persisted auth data before deciding which launch flow to show.
        await authStorage.initAsync();

        const session = authStorage.getSession();
        const activeMobile = session?.activeMobile;
        const user = activeMobile ? authStorage.getUserByMobile(activeMobile) : null;
        const isAuthed = Boolean(session?.isLoggedIn && activeMobile && user);

        if (isAuthed && user) {
          // Sync profile in background if available
          useAuthStore.getState().fetchAndSyncProfile(user.mobileNumber).catch(() => {});

          // Step 1: Returning users with enrolled biometrics start at Welcome Back.
          let isBioEnabled = false;
          try {
            isBioEnabled = await Promise.race([
              biometricService.isBiometricAvailable(),
              new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 800)),
            ]);
          } catch {
            isBioEnabled = false;
          }

          if (isBioEnabled) {
            // Biometric enabled: navigate to auth screen in BIOMETRIC_REAUTH mode.
            // The auth screen will trigger the biometric prompt automatically after mounting.
            // We do NOT call biometricService.authenticate() here — the UI must be visible first.
            useAuthStore.setState({
              isLoggedIn: false,
              mobileNumber: user.mobileNumber,
              authFlowState: "BIOMETRIC_REAUTH",
            });
            if (!hasNavigated.current) {
              hasNavigated.current = true;
              router.replace("/(auth)/login" as any);
            }
            return;
          }

          // Step 2: Biometric is disabled. Is App Passcode enabled?
          const hasPass = (await passcodeService.hasPasscode(user.mobileNumber)) || Boolean(user.hasPasscode);
          if (hasPass) {
            // Prompt App Passcode — numpad will appear in the auth screen
            useAuthStore.setState({
              isLoggedIn: false,
              mobileNumber: user.mobileNumber,
              authFlowState: "PASSCODE_LOGIN",
            });
            if (!hasNavigated.current) {
              hasNavigated.current = true;
              router.replace("/(auth)/login" as any);
            }
            return;
          }

          // NO passcode, NO biometric -> Restore session -> Go to Home
          authStorage.saveSession({
            isLoggedIn: true,
            activeMobile: user.mobileNumber,
            lastLoginAt: new Date().toISOString(),
          });
          useAuthStore.getState().syncFromDevAuth();
          if (!hasNavigated.current) {
            hasNavigated.current = true;
            router.replace("/(main)/home" as any);
          }
          return;
        }
      } catch (e) {
        console.warn("App launch init error:", e);
      } finally {
        if (isMounted && !hasNavigated.current) {
          setIsInitializing(false);
        }
      }
    }

    handleAppLaunch();

    // Absolute failsafe: if after 2.0s the app is still initializing, dismiss loading screen
    const failsafe = setTimeout(() => {
      if (isMounted && !hasNavigated.current) {
        setIsInitializing(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(failsafe);
    };
  }, [router]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A2346", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  return <LandingScreen />;
}
