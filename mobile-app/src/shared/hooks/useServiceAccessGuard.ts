import { useCallback, useEffect } from "react";
import { useRouter, usePathname } from "expo-router";
import { useAuthStore } from "../../modules/authentication/store/authStore";

export function useServiceAccessGuard() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const profileCompleted = useAuthStore((s) => s.profileCompleted);
  const isExistingUser = useAuthStore((s) => s.isExistingUser);
  const customerExists = useAuthStore((s) => s.customerExists);
  const customer = useAuthStore((s) => s.customer);
  const authenticatedUser = useAuthStore((s) => s.authenticatedUser);
  const openCompleteProfileModal = useAuthStore((s) => s.openCompleteProfileModal);

  const rawName = customer?.name || authenticatedUser?.name || "";
  const hasValidName = Boolean(
    rawName &&
    rawName.trim() !== "" &&
    rawName.toLowerCase() !== "valued client" &&
    rawName.toLowerCase() !== "client" &&
    rawName.toLowerCase() !== "valued"
  );

  const hasCustomerId = Boolean(
    (customer?.customerId && customer.customerId.trim() !== "") ||
    (authenticatedUser?.customerId && authenticatedUser.customerId.trim() !== "")
  );

  const hasPanOrAadhaar = Boolean(
    (customer?.pan && customer.pan.trim() !== "") ||
    ((customer as any)?.aadhaar && (customer as any).aadhaar.trim() !== "") ||
    (authenticatedUser?.pan && authenticatedUser.pan.trim() !== "") ||
    ((authenticatedUser as any)?.aadhaar && (authenticatedUser as any).aadhaar.trim() !== "")
  );

  const isProfileComplete = Boolean(
    (hasValidName && (profileCompleted || customer?.profileCompleted || authenticatedUser?.registrationCompleted || isExistingUser || customerExists)) ||
    (hasValidName && hasCustomerId) ||
    (hasValidName && hasPanOrAadhaar)
  );

  const accessService = useCallback(
    async (targetRoute: any, params?: Record<string, any>): Promise<boolean> => {
      // 1. Checks authentication
      if (!isLoggedIn) {
        router.push("/(auth)/login" as any);
        return false;
      }

      // 2. Checks profile completion
      if (!isProfileComplete) {
        const routeToSave = typeof targetRoute === "string" ? targetRoute : targetRoute?.pathname || "/service/gst";
        openCompleteProfileModal(routeToSave);
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
  const isExistingUser = useAuthStore((s) => s.isExistingUser);
  const customerExists = useAuthStore((s) => s.customerExists);
  const customer = useAuthStore((s) => s.customer);
  const authenticatedUser = useAuthStore((s) => s.authenticatedUser);
  const openCompleteProfileModal = useAuthStore((s) => s.openCompleteProfileModal);

  const rawName = customer?.name || authenticatedUser?.name || "";
  const hasValidName = Boolean(
    rawName &&
    rawName.trim() !== "" &&
    rawName.toLowerCase() !== "valued client" &&
    rawName.toLowerCase() !== "client" &&
    rawName.toLowerCase() !== "valued"
  );

  const hasCustomerId = Boolean(
    (customer?.customerId && customer.customerId.trim() !== "") ||
    (authenticatedUser?.customerId && authenticatedUser.customerId.trim() !== "")
  );

  const hasPanOrAadhaar = Boolean(
    (customer?.pan && customer.pan.trim() !== "") ||
    ((customer as any)?.aadhaar && (customer as any).aadhaar.trim() !== "") ||
    (authenticatedUser?.pan && authenticatedUser.pan.trim() !== "") ||
    ((authenticatedUser as any)?.aadhaar && (authenticatedUser as any).aadhaar.trim() !== "")
  );

  const isProfileComplete = Boolean(
    (hasValidName && (profileCompleted || customer?.profileCompleted || authenticatedUser?.registrationCompleted || isExistingUser || customerExists)) ||
    (hasValidName && hasCustomerId) ||
    (hasValidName && hasPanOrAadhaar)
  );

  useEffect(() => {
    let isMounted = true;
    const checkAndProtect = async () => {
      if (!isLoggedIn) {
        router.replace("/(auth)/login" as any);
        return;
      }

      if (!isProfileComplete) {
        if (!isMounted) return;
        const routeToSave = targetRoute || pathname;
        openCompleteProfileModal(routeToSave);
        router.back();
      }
    };

    checkAndProtect();
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, isProfileComplete, targetRoute, pathname, openCompleteProfileModal, router]);

  return {
    isAuthorized: isLoggedIn && isProfileComplete,
  };
}

export default useServiceAccessGuard;
