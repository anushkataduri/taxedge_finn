import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { LandingScreen } from "../components/landing/LandingScreen";
import { biometricService } from "../modules/authentication/services/biometricService";
import { authStorage } from "../modules/authentication/services/authStorage";

export default function Index() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state: any) => state.isLoggedIn);
  const [isInitializing, setIsInitializing] = useState(true);
  const hasTriggeredBiometrics = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function handleAppLaunch() {
      if (hasTriggeredBiometrics.current) return;
      hasTriggeredBiometrics.current = true;

      try {
        const isBioEnabled = await biometricService.isBiometricEnabled();
        if (isBioEnabled) {
          const bioMobile =
            (await biometricService.getBiometricMobile()) ||
            authStorage.getSession().activeMobile ||
            useAuthStore.getState().mobileNumber;

          const user = bioMobile ? authStorage.getUserByMobile(bioMobile) : null;

          if (user) {
            const typeLabel = await biometricService.getBiometricTypeLabel();
            const authRes = await biometricService.authenticate(`Authenticate with ${typeLabel}`);

            if (!isMounted) return;

            if (authRes.success) {
              // Biometric success -> Dashboard
              authStorage.saveSession({
                isLoggedIn: true,
                activeMobile: user.mobileNumber,
                lastLoginAt: new Date().toISOString(),
              });
              useAuthStore.getState().syncFromDevAuth();
              router.replace("/(main)/home" as any);
              return;
            } else {
              // Biometric cancelled or failed -> Fallback to existing Passcode Screen
              // Never log the user out. Never clear session. Never require OTP again.
              useAuthStore.getState().setMobileNumber(user.mobileNumber);
              useAuthStore.getState().setAuthFlowState("PASSCODE_LOGIN");
              router.replace("/(auth)/login" as any);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("App launch biometric error:", e);
      }

      if (isMounted) {
        setIsInitializing(false);
        if (isLoggedIn) {
          router.replace("/(main)/home" as any);
        }
      }
    }

    handleAppLaunch();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, router]);

  if (isInitializing || isLoggedIn) {
    return null;
  }

  return <LandingScreen />;
}
