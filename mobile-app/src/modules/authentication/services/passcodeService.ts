import { secureStorage } from "../../../core/storage/secureStorage";
import { apiClient } from "../../../core/api/apiClient";
import { tokenManager } from "../../../core/authentication/tokenManager";
import { authStorage } from "./authStorage";
import type { DevUser } from "../types/auth.types";

const KEY_PREFIX = "passcode_";
const KEY_FAILED_ATTEMPTS = "passcode_failed_attempts_";
const KEY_LOCKOUT_UNTIL = "passcode_lockout_until_";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

export interface PasscodeVerificationResult {
  success: boolean;
  error?: string;
  isLockedOut?: boolean;
  lockoutRemainingSeconds?: number;
  user?: DevUser;
  token?: string;
}

class PasscodeService {
  private clean(mobile: string): string {
    return (mobile || "").replace(/\D/g, "");
  }

  /**
   * Check if a lockout is currently active for this mobile number
   */
  async checkLockout(mobile: string): Promise<{ isLocked: boolean; remainingSeconds: number }> {
    const cleanMobile = this.clean(mobile);
    if (!cleanMobile) return { isLocked: false, remainingSeconds: 0 };

    const lockoutStr = await secureStorage.getItem(`${KEY_LOCKOUT_UNTIL}${cleanMobile}`);
    if (!lockoutStr) return { isLocked: false, remainingSeconds: 0 };

    const lockoutUntil = parseInt(lockoutStr, 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }

    // Lockout expired; clear lockout record
    await secureStorage.removeItem(`${KEY_LOCKOUT_UNTIL}${cleanMobile}`);
    await secureStorage.removeItem(`${KEY_FAILED_ATTEMPTS}${cleanMobile}`);
    return { isLocked: false, remainingSeconds: 0 };
  }

  /**
   * Record a failed passcode attempt and trigger lockout if limit reached
   */
  async recordFailedAttempt(mobile: string): Promise<{ isLocked: boolean; remainingSeconds: number; remainingAttempts: number }> {
    const cleanMobile = this.clean(mobile);
    const attemptsStr = await secureStorage.getItem(`${KEY_FAILED_ATTEMPTS}${cleanMobile}`);
    const attempts = (attemptsStr ? parseInt(attemptsStr, 10) : 0) + 1;

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      await secureStorage.setItem(`${KEY_LOCKOUT_UNTIL}${cleanMobile}`, String(lockoutUntil));
      await secureStorage.setItem(`${KEY_FAILED_ATTEMPTS}${cleanMobile}`, String(attempts));
      return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000), remainingAttempts: 0 };
    }

    await secureStorage.setItem(`${KEY_FAILED_ATTEMPTS}${cleanMobile}`, String(attempts));
    return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_FAILED_ATTEMPTS - attempts };
  }

  /**
   * Reset failed attempt counters on successful passcode entry
   */
  async resetFailedAttempts(mobile: string): Promise<void> {
    const cleanMobile = this.clean(mobile);
    await secureStorage.removeItem(`${KEY_FAILED_ATTEMPTS}${cleanMobile}`);
    await secureStorage.removeItem(`${KEY_LOCKOUT_UNTIL}${cleanMobile}`);
  }

  /**
   * Check whether a passcode is configured in SecureStore for this mobile number
   */
  async hasPasscode(mobile: string): Promise<boolean> {
    const cleanMobile = this.clean(mobile);
    if (!cleanMobile) return false;
    const stored = await secureStorage.getItem(`${KEY_PREFIX}${cleanMobile}`);
    return Boolean(stored && stored.length === 6);
  }

  /**
   * Save passcode securely in SecureStore (never in AsyncStorage)
   */
  async setPasscode(mobile: string, passcode: string): Promise<boolean> {
    const cleanMobile = this.clean(mobile);
    const cleanPasscode = (passcode || "").replace(/\D/g, "");
    if (cleanMobile.length !== 10 || cleanPasscode.length !== 6) {
      return false;
    }
    await secureStorage.setItem(`${KEY_PREFIX}${cleanMobile}`, cleanPasscode);
    await this.resetFailedAttempts(cleanMobile);
    return true;
  }

  /**
   * Remove passcode from SecureStore
   */
  async removePasscode(mobile: string): Promise<void> {
    const cleanMobile = this.clean(mobile);
    if (cleanMobile) {
      await secureStorage.removeItem(`${KEY_PREFIX}${cleanMobile}`);
      await secureStorage.removeItem(`${KEY_FAILED_ATTEMPTS}${cleanMobile}`);
      await secureStorage.removeItem(`${KEY_LOCKOUT_UNTIL}${cleanMobile}`);
    }
  }

  /**
   * Verify passcode:
   * First checks lockout state.
   * If local passcode matches OR backend POST /customer/login succeeds, authorizes session.
   */
  async verifyPasscode(mobile: string, passcode: string): Promise<PasscodeVerificationResult> {
    const cleanMobile = this.clean(mobile);
    const cleanPasscode = (passcode || "").replace(/\D/g, "");

    if (cleanMobile.length !== 10) {
      return { success: false, error: "Please enter a valid 10-digit mobile number" };
    }
    if (cleanPasscode.length !== 6) {
      return { success: false, error: "Passcode must be exactly 6 numeric digits" };
    }

    // 1. Lockout check
    const lockout = await this.checkLockout(cleanMobile);
    if (lockout.isLocked) {
      return {
        success: false,
        isLockedOut: true,
        lockoutRemainingSeconds: lockout.remainingSeconds,
        error: `Too many failed attempts. Please try again in ${lockout.remainingSeconds}s.`,
      };
    }

    // 2. Check local SecureStore passcode first (fast, secure, offline-first unlock)
    const localPasscode = await secureStorage.getItem(`${KEY_PREFIX}${cleanMobile}`);
    if (localPasscode && localPasscode === cleanPasscode) {
      await this.resetFailedAttempts(cleanMobile);
      const user = authStorage.getUserByMobile(cleanMobile);
      const existingToken = await tokenManager.getAccessToken();

      // Refresh backend session in background if possible
      apiClient
        .post<any>("/customer/login", {
          mobileNumber: cleanMobile,
          password: cleanPasscode,
        })
        .then(async (response) => {
          if (response?.accessToken) {
            await tokenManager.setAccessToken(response.accessToken);
          }
          if (response?.refreshToken) {
            await tokenManager.setRefreshToken(response.refreshToken);
          }
        })
        .catch(() => {});

      return {
        success: true,
        token: existingToken || undefined,
        user: user || undefined,
      };
    }

    // 3. If not matched locally or first time on device, authenticate with backend POST /customer/login
    try {
      const response = await apiClient.post<any>("/customer/login", {
        mobileNumber: cleanMobile,
        password: cleanPasscode,
      });

      if (response && (response.accessToken || response.custId)) {
        // Backend authentication succeeded
        if (response.accessToken) {
          await tokenManager.setAccessToken(response.accessToken);
        }
        if (response.refreshToken) {
          await tokenManager.setRefreshToken(response.refreshToken);
        }

        // Save passcode locally in SecureStore for subsequent quick unlocks
        await this.setPasscode(cleanMobile, cleanPasscode);
        await this.resetFailedAttempts(cleanMobile);

        const devUser: DevUser = {
          customerId: response.custId || "",
          mobileNumber: response.mobileNumber || cleanMobile,
          name: response.name || "",
          email: `${cleanMobile}@taxedge.in`,
          customerType: "Individual",
          registrationCompleted: true,
        };

        return {
          success: true,
          token: response.accessToken,
          user: devUser,
        };
      }
    } catch (apiError: any) {
      // If network error occurred and local passcode wasn't configured, fall through to failure
    }

    // Passcode incorrect
    const attemptInfo = await this.recordFailedAttempt(cleanMobile);
    if (attemptInfo.isLocked) {
      return {
        success: false,
        isLockedOut: true,
        lockoutRemainingSeconds: attemptInfo.remainingSeconds,
        error: `Account locked due to multiple incorrect attempts. Try again in ${attemptInfo.remainingSeconds}s.`,
      };
    }

    return {
      success: false,
      error: `Incorrect passcode. ${attemptInfo.remainingAttempts} attempt(s) remaining.`,
    };
  }
}

export const passcodeService = new PasscodeService();
export default passcodeService;
