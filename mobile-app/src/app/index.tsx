import { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { LandingScreen } from "../components/landing/LandingScreen";
import { biometricService } from "../modules/authentication/services/biometricService";
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

        // 2. Synchronize store state from dev auth / storage
        useAuthStore.getState().syncFromDevAuth();

        const session = authStorage.getSession();
        const activeMobile = session?.activeMobile;
        const user = activeMobile ? authStorage.getUserByMobile(activeMobile) : null;
        const isAuthed = Boolean(session?.isLoggedIn && activeMobile && user);

        if (isAuthed && user) {
          // Check biometrics with 800ms safety timeout
          let isBioEnabled = false;
          try {
            isBioEnabled = await Promise.race([
              biometricService.isBiometricEnabled(),
              new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 800)),
            ]);
          } catch {
            isBioEnabled = false;
          }

          if (isBioEnabled) {
            const typeLabel = await biometricService.getBiometricTypeLabel().catch(() => "Fingerprint");
            const authRes = await biometricService.authenticate(`Authenticate with ${typeLabel}`);

            if (!isMounted) return;

            if (authRes.success) {
              authStorage.saveSession({
                isLoggedIn: true,
                activeMobile: user.mobileNumber,
                lastLoginAt: new Date().toISOString(),
              });
              useAuthStore.getState().syncFromDevAuth();
              useAuthStore.getState().fetchAndSyncProfile(user.mobileNumber).catch(() => {});
              if (!hasNavigated.current) {
                hasNavigated.current = true;
                router.replace("/(main)/home" as any);
              }
              return;
            } else {
              // Biometric cancelled or failed -> Passcode login screen
              useAuthStore.getState().setMobileNumber(user.mobileNumber);
              useAuthStore.getState().setAuthFlowState("PASSCODE_LOGIN");
              if (!hasNavigated.current) {
                hasNavigated.current = true;
                router.replace("/(auth)/login" as any);
              }
              return;
            }
          }

          // Authenticated and biometrics not enabled -> Dashboard
          if (!hasNavigated.current) {
            hasNavigated.current = true;
            useAuthStore.getState().fetchAndSyncProfile(user.mobileNumber).catch(() => {});
            router.replace("/(main)/home" as any);
            return;
          }
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
