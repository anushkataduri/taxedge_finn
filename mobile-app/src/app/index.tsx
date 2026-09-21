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
        // 1. Initialize authStorage with 800ms safety timeout
        await Promise.race([
          authStorage.initAsync(),
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]);

        const session = authStorage.getSession();
        const activeMobile = session?.activeMobile;
        const user = activeMobile ? authStorage.getUserByMobile(activeMobile) : null;
        const isAuthed = Boolean(session?.isLoggedIn && activeMobile && user);

        if (isAuthed && user) {
          // Sync profile in background if available
          useAuthStore.getState().fetchAndSyncProfile(user.mobileNumber).catch(() => {});

          // Step 1: Check if Biometric authentication is enabled for this user on this device
          let isBioEnabled = false;
          try {
            isBioEnabled = await Promise.race([
              biometricService.isBiometricEnabled(user.mobileNumber),
              new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 800)),
            ]);
          } catch {
            isBioEnabled = false;
          }

          if (isBioEnabled) {
            // YES: Prompt Face ID / Fingerprint immediately
            const typeLabel = await biometricService.getBiometricTypeLabel().catch(() => "Biometrics");
            const authRes = await biometricService.authenticate({
              promptMessage: `Authenticate with ${typeLabel}`,
              disableDeviceFallback: true,
            });

            if (!isMounted) return;

            if (authRes.success) {
              // Biometric succeeds -> Go to Home / Dashboard
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
            } else {
              // Biometric fails or is cancelled -> Fall back to App Passcode or Login
              const hasPass = (await passcodeService.hasPasscode(user.mobileNumber)) || Boolean(user.hasPasscode);
              useAuthStore.setState({
                isLoggedIn: false,
                mobileNumber: user.mobileNumber,
                authFlowState: hasPass ? "PASSCODE_LOGIN" : "ENTER_MOBILE",
              });
              if (!hasNavigated.current) {
                hasNavigated.current = true;
                router.replace("/(auth)/login" as any);
              }
              return;
            }
          }

          // Step 2: Biometric is NO. Is App Passcode enabled?
          const hasPass = (await passcodeService.hasPasscode(user.mobileNumber)) || Boolean(user.hasPasscode);
          if (hasPass) {
            // YES: Prompt App Passcode -> Go to Home upon successful passcode entry
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
