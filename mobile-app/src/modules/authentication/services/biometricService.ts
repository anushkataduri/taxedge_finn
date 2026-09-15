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
    return await SecureStore.getItemAsync(key);
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
    await SecureStore.setItemAsync(key, value);
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
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.warn("SecureStore.deleteItemAsync error:", e);
    delete memoryStorage[key];
  }
};

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
   * Check whether fingerprints or Face ID are enrolled on the device
   */
  async checkEnrollment(): Promise<boolean> {
    try {
      return await LocalAuthentication.isEnrolledAsync();
    } catch {
      return false;
    }
  },

  /**
   * Detect device biometric type and return a user-friendly label (e.g. "Face ID", "Touch ID", "Fingerprint")
   */
  async getBiometricTypeLabel(): Promise<string> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const hasFace = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      const hasFingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

      if (Platform.OS === "ios") {
        if (hasFace) return "Face ID";
        if (hasFingerprint) return "Touch ID";
      } else {
        if (hasFingerprint) return "Fingerprint";
        if (hasFace) return "Face Unlock";
      }
      return "Biometric";
    } catch {
      return Platform.OS === "ios" ? "Face ID / Touch ID" : "Fingerprint";
    }
  },

  /**
   * Prompt the OS biometric authentication dialog
   */
  async authenticate(customPrompt?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const hasHardware = await this.checkHardwareSupport();
      if (!hasHardware) {
        return { success: false, error: "Biometric authentication isn't supported on this device." };
      }

      const isEnrolled = await this.checkEnrollment();
      if (!isEnrolled) {
        return {
          success: false,
          error: "No fingerprint or Face ID has been configured. Please add one in your device settings.",
        };
      }

      const typeLabel = await this.getBiometricTypeLabel();
      const prompt = customPrompt || `Authenticate with ${typeLabel}`;

      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: prompt,
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (res.success) {
        return { success: true };
      }

      if (res.error === "user_cancel" || res.error === "app_cancel" || res.error === "system_cancel") {
        return { success: false, error: "Authentication cancelled" };
      }

      return {
        success: false,
        error: "Authentication failed. Please try again or use your passcode.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Authentication failed. Please try again or use your passcode.",
      };
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
   * Enable or disable biometric login
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
