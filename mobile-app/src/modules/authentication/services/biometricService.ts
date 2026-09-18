import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY_BIOMETRIC_ENABLED = "taxedge_biometric_enabled";
const KEY_BIOMETRIC_MOBILE = "taxedge_biometric_mobile";

// In-memory fallback for web or environments where SecureStore isn't available
const memoryStorage: Record<string, string> = {};

const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    }
    const securePromise = SecureStore.getItemAsync(key);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
    const result = await Promise.race([securePromise, timeoutPromise]);
    return result ?? memoryStorage[key] ?? null;
  } catch (e) {
    console.warn("SecureStore.getItemAsync error:", e);
    return memoryStorage[key] || null;
  }
};

const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      memoryStorage[key] = value;
      return;
    }
    await Promise.race([
      SecureStore.setItemAsync(key, value),
      new Promise<void>((resolve) => setTimeout(resolve, 800)),
    ]);
  } catch (e) {
    console.warn("SecureStore.setItemAsync error:", e);
    memoryStorage[key] = value;
  }
};

const deleteSecureItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      delete memoryStorage[key];
      return;
    }
    await Promise.race([
      SecureStore.deleteItemAsync(key),
      new Promise<void>((resolve) => setTimeout(resolve, 800)),
    ]);
  } catch (e) {
    console.warn("SecureStore.deleteItemAsync error:", e);
    delete memoryStorage[key];
  }
};

export type BiometricType =
  | "FINGERPRINT"
  | "FACE_UNLOCK"
  | "BIOMETRIC"
  | "NONE";

export interface AuthenticateOptions {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  cancelled?: boolean;
}

// Global authentication-in-progress guard to prevent concurrent duplicate prompts
let isAuthenticating = false;

export const biometricService = {
  /**
   * Check whether device hardware supports biometric authentication
   */
  async checkHardwareSupport(): Promise<boolean> {
    try {
      return await LocalAuthentication.hasHardwareAsync();
    } catch {
      return false;
    }
  },

  /**
   * Check whether biometrics (fingerprint/face) are enrolled on the device
   */
  async checkEnrollment(): Promise<boolean> {
    try {
      return await LocalAuthentication.isEnrolledAsync();
    } catch {
      return false;
    }
  },

  /**
   * Check whether biometrics are available on current device
   */
  async isBiometricAvailable(): Promise<boolean> {
    const hasHardware = await this.checkHardwareSupport();
    if (!hasHardware) return false;
    return await this.checkEnrollment();
  },

  /**
   * Get the concrete biometric type of the device:
   * 'FINGERPRINT' | 'FACE_UNLOCK' | 'BIOMETRIC' | 'NONE'
   */
  async getBiometricType(): Promise<BiometricType> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) return "NONE";

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const hasFingerprint = types.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      );
      const hasFace = types.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
      );

      if (hasFingerprint) return "FINGERPRINT";
      if (hasFace) return "FACE_UNLOCK";
      return "BIOMETRIC";
    } catch {
      return "NONE";
    }
  },

  /**
   * Detect device biometric type and return a user-friendly label (e.g. "Fingerprint", "Face Unlock", "Biometric")
   */
  async getBiometricTypeLabel(): Promise<string> {
    try {
      const type = await this.getBiometricType();
      switch (type) {
        case "FINGERPRINT":
          return "Fingerprint";
        case "FACE_UNLOCK":
          return "Face Unlock";
        default:
          return "Biometric";
      }
    } catch {
      return "Fingerprint";
    }
  },

  /**
   * Authenticate biometrics (Android Biometric Authentication)
   */
  async authenticate(
    promptOrOptions?: string | AuthenticateOptions,
  ): Promise<BiometricAuthResult> {
    if (isAuthenticating) {
      return { success: false, error: "Authentication is already in progress" };
    }

    try {
      isAuthenticating = true;

      const hasHardware = await this.checkHardwareSupport();
      if (!hasHardware) {
        return {
          success: false,
          error: "Biometric authentication isn't supported on this device.",
        };
      }

      const isEnrolled = await this.checkEnrollment();
      if (!isEnrolled) {
        return {
          success: false,
          error:
            "No fingerprint or biometric has been configured. Please add one in your device settings.",
        };
      }

      let customPrompt: string | undefined;
      let customOptions: AuthenticateOptions = {};

      if (typeof promptOrOptions === "string") {
        customPrompt = promptOrOptions;
      } else if (promptOrOptions) {
        customOptions = promptOrOptions;
        customPrompt = promptOrOptions.promptMessage;
      }

      const typeLabel = await this.getBiometricTypeLabel();
      const prompt = customPrompt || `Authenticate with ${typeLabel}`;

      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: prompt,
        fallbackLabel: customOptions.fallbackLabel ?? "Use Passcode",
        cancelLabel: customOptions.cancelLabel ?? "Cancel",
        disableDeviceFallback: customOptions.disableDeviceFallback ?? false,
      });

      if (res && res.success === true) {
        return { success: true };
      }

      if (
        res.error === "user_cancel" ||
        res.error === "app_cancel" ||
        res.error === "system_cancel"
      ) {
        return { success: false, cancelled: true, error: "Authentication cancelled" };
      }

      return {
        success: false,
        error: "Authentication failed. Please try again.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Authentication error occurred. Please try again.",
      };
    } finally {
      isAuthenticating = false;
    }
  },

  /**
   * Check whether biometric login is enabled for the current device/user
   */
  async isBiometricEnabled(): Promise<boolean> {
    const val = await getSecureItem(KEY_BIOMETRIC_ENABLED);
    return val === "true";
  },

  /**
   * Enable biometric authentication after verifying biometrics
   */
  async enableBiometric(
    mobile?: string,
    customPrompt?: string,
  ): Promise<BiometricAuthResult> {
    const authRes = await this.authenticate(customPrompt);
    if (authRes.success) {
      await this.setBiometricEnabled(true, mobile);
      return { success: true };
    }
    return authRes;
  },

  /**
   * Disable biometric authentication and clear stored credentials
   */
  async disableBiometric(): Promise<void> {
    await this.setBiometricEnabled(false);
  },

  /**
   * Set biometric enabled in SecureStore
   */
  async setBiometricEnabled(enabled: boolean, mobile?: string): Promise<void> {
    if (enabled) {
      await setSecureItem(KEY_BIOMETRIC_ENABLED, "true");
      if (mobile) {
        await setSecureItem(KEY_BIOMETRIC_MOBILE, mobile.replace(/\D/g, ""));
      }
    } else {
      await setSecureItem(KEY_BIOMETRIC_ENABLED, "false");
      await deleteSecureItem(KEY_BIOMETRIC_MOBILE);
    }
  },

  /**
   * Get the registered mobile number tied to biometric login
   */
  async getBiometricMobile(): Promise<string | null> {
    return await getSecureItem(KEY_BIOMETRIC_MOBILE);
  },
};

export default biometricService;
