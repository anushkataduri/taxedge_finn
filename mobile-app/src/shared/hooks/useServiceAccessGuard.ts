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
  const fetchAndSyncProfile = useAuthStore((s) => s.fetchAndSyncProfile);

  const isPlaceholderName =
    !customer?.name ||
    customer.name.trim() === "" ||
    customer.name.toLowerCase() === "valued client" ||
    customer.name.toLowerCase() === "client" ||
    customer.name.toLowerCase() === "valued";

  const hasBackendIdentity = Boolean(
    (customer?.customerId || authenticatedUser?.customerId) && !isPlaceholderName
  );

  const hasPanOrAadhaar = Boolean(
    customer?.pan || (customer as any)?.aadhaar || authenticatedUser?.pan || (authenticatedUser as any)?.aadhaar
  );

  const isProfileComplete = Boolean(
    profileCompleted ||
    customer?.profileCompleted ||
    (customer as any)?.registrationCompleted ||
    authenticatedUser?.registrationCompleted ||
    (authenticatedUser?.passcode && authenticatedUser.passcode.length === 6) ||
    (hasBackendIdentity && (hasPanOrAadhaar || Boolean(customer?.dob)))
  );

  const accessService = useCallback(
    async (targetRoute: any, params?: Record<string, any>): Promise<boolean> => {
      // 1. Checks authentication
      if (!isLoggedIn) {
        router.push("/(auth)/login" as any);
        return false;
      }

      // 2. Checks profile completion using authenticated customer state
      let complete = isProfileComplete;

      // If memory state says incomplete, verify with backend before blocking
      if (!complete) {
        try {
          const syncRes = await fetchAndSyncProfile();
          if (syncRes && syncRes.isComplete) {
            complete = true;
          }
        } catch (err) {
          console.warn("⚠️ [useServiceAccessGuard] fetchAndSyncProfile check failed:", err);
        }
      }

      if (!complete) {
        // Shows the Complete Profile popup and remembers requested route
        openCompleteProfileModal(typeof targetRoute === "string" ? targetRoute : targetRoute?.pathname || "/service/gst");
        return false;
      }

      // 3. Authorized: navigate to requested service
      if (params) {
        router.push({ pathname: targetRoute, params } as any);
      } else {
        router.push(targetRoute as any);
      }
      return true;
    },
    [isLoggedIn, isProfileComplete, fetchAndSyncProfile, openCompleteProfileModal, router]
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
  const fetchAndSyncProfile = useAuthStore((s) => s.fetchAndSyncProfile);

  const isPlaceholderName =
    !customer?.name ||
    customer.name.trim() === "" ||
    customer.name.toLowerCase() === "valued client" ||
    customer.name.toLowerCase() === "client" ||
    customer.name.toLowerCase() === "valued";

  const hasBackendIdentity = Boolean(
    (customer?.customerId || authenticatedUser?.customerId) && !isPlaceholderName
  );

  const hasPanOrAadhaar = Boolean(
    customer?.pan || (customer as any)?.aadhaar || authenticatedUser?.pan || (authenticatedUser as any)?.aadhaar
  );

  const isProfileComplete = Boolean(
    profileCompleted ||
    customer?.profileCompleted ||
    (customer as any)?.registrationCompleted ||
    authenticatedUser?.registrationCompleted ||
    (authenticatedUser?.passcode && authenticatedUser.passcode.length === 6) ||
    (hasBackendIdentity && (hasPanOrAadhaar || Boolean(customer?.dob)))
  );

  useEffect(() => {
    let isMounted = true;
    const checkAndProtect = async () => {
      if (!isLoggedIn) {
        router.replace("/(auth)/login" as any);
        return;
      }

      if (!isProfileComplete) {
        const syncRes = await fetchAndSyncProfile().catch(() => null);
        if (!isMounted) return;
        if (!syncRes?.isComplete) {
          const routeToSave = targetRoute || pathname;
          openCompleteProfileModal(routeToSave);
          router.back();
        }
      }
    };

    checkAndProtect();
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, isProfileComplete, targetRoute, pathname, openCompleteProfileModal, fetchAndSyncProfile, router]);

  return {
    isAuthorized: isLoggedIn && isProfileComplete,
  };
}

export default useServiceAccessGuard;
