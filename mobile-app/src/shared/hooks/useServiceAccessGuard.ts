import { useCallback, useEffect } from "react";
import { useRouter, usePathname } from "expo-router";
import { useAuthStore } from "../../modules/authentication/store/authStore";

export function useServiceAccessGuard() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const profileCompleted = useAuthStore((s) => s.profileCompleted);
  const customer = useAuthStore((s) => s.customer);
  const authenticatedUser = useAuthStore((s) => s.authenticatedUser);
  const openCompleteProfileModal = useAuthStore((s) => s.openCompleteProfileModal);

  const isProfileComplete = Boolean(
    profileCompleted ||
    customer?.profileCompleted ||
    (customer as any)?.registrationCompleted ||
    authenticatedUser?.registrationCompleted ||
    (authenticatedUser?.passcode && authenticatedUser.passcode.length === 6)
  );

  const accessService = useCallback(
    (targetRoute: any, params?: Record<string, any>): boolean => {
      // 1. Checks authentication
      if (!isLoggedIn) {
        router.push("/(auth)/login" as any);
        return false;
      }

      // 2. Checks profile completion using authenticated customer state
      if (!isProfileComplete) {
        // 3. Shows the Complete Profile popup and remembers requested route
        openCompleteProfileModal(typeof targetRoute === "string" ? targetRoute : targetRoute?.pathname || "/service/gst");
        return false;
      }

      // 4. Authorized: navigate to requested service
      if (params) {
        router.push({ pathname: targetRoute, params } as any);
      } else {
        router.push(targetRoute as any);
      }
      return true;
    },
    [isLoggedIn, isProfileComplete, openCompleteProfileModal, router]
  );

  return {
    accessService,
    isLoggedIn,
    profileCompleted: isProfileComplete,
  };
}

/**
 * Hook for screen-level protection when a service route mounts directly
 */
export function useServiceProtection(targetRoute?: any) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const profileCompleted = useAuthStore((s) => s.profileCompleted);
  const customer = useAuthStore((s) => s.customer);
  const authenticatedUser = useAuthStore((s) => s.authenticatedUser);
  const openCompleteProfileModal = useAuthStore((s) => s.openCompleteProfileModal);

  const isProfileComplete = Boolean(
    profileCompleted ||
    customer?.profileCompleted ||
    (customer as any)?.registrationCompleted ||
    authenticatedUser?.registrationCompleted ||
    (authenticatedUser?.passcode && authenticatedUser.passcode.length === 6)
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/(auth)/login" as any);
      return;
    }

    if (!isProfileComplete) {
      const routeToSave = targetRoute || pathname;
      openCompleteProfileModal(routeToSave);
      router.back();
    }
  }, [isLoggedIn, isProfileComplete, targetRoute, pathname, openCompleteProfileModal, router]);

  return {
    isAuthorized: isLoggedIn && isProfileComplete,
  };
}

export default useServiceAccessGuard;
