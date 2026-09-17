import { authStorage } from "./authStorage";
import { authApi } from "./authApi";
import { tokenManager } from "../../../core/authentication/tokenManager";
import { registerForPushNotificationsAsync } from "../../../utils/pushNotificationService";
import type { DevUser, RegistrationData, AuthResult } from "../types/auth.types";
 
export interface RegisterParams extends Partial<RegistrationData> {
  mobileNumber?: string;
  name: string;
  passcode?: string;
}
 
export const authService = {
  findUserByMobile: (m: string) => authStorage.getUserByMobile(m),
  isUserRegistered: (m: string) => Boolean(authStorage.getUserByMobile(m)?.passcode),
 
  async sendOtp(mobileNumber: string): Promise<{ success: boolean; message?: string }> {
    const clean = mobileNumber.replace(/\D/g, "");
    const res = await authApi.sendOtp(clean);
    return res;
  },
 
  async verifyOtp(mobileNumber: string, otp: string): Promise<AuthResult & { customerExists?: boolean; profileCompleted?: boolean; hasPasscode?: boolean }> {
    const clean = mobileNumber.replace(/\D/g, "");
    const apiRes = await authApi.verifyOtp(clean, otp);
    if (!apiRes.success) {
      return {
        success: false,
        isExistingUser: false,
        customerExists: false,
        profileCompleted: false,
        hasPasscode: false,
        message: apiRes.message || "Invalid OTP code",
      };
    }

    // Direct check in Customer table from backend response
    const customerExists = apiRes.customerExists === true || apiRes.isExistingUser === true;
    const profileCompleted = customerExists && (apiRes.profileCompleted === true || apiRes.hasPasscode === true);
    const hasPasscode = customerExists;

    let user = apiRes.user;
    if (customerExists && !user) {
      user = {
        customerId: `CUST-2026-${clean.slice(-5)}`,
        mobileNumber: clean,
        name: "",
        email: `${clean}@taxedge.in`,
        customerType: "Individual",
        registrationCompleted: profileCompleted,
      };
      authStorage.saveUser(user);
    }

    return {
      success: true,
      isExistingUser: customerExists,
      customerExists,
      profileCompleted,
      hasPasscode,
      user: user || undefined,
    };
  },

  async checkUser(mobileNumber: string): Promise<{ exists: boolean; customerExists: boolean; profileCompleted: boolean; hasPasscode: boolean; user?: DevUser }> {
    const clean = mobileNumber.replace(/\D/g, "");
    try {
      const checkRes = await authApi.checkUser(clean);
      if (checkRes && checkRes.success) {
        return {
          exists: checkRes.exists,
          customerExists: checkRes.customerExists ?? checkRes.exists,
          profileCompleted: checkRes.exists,
          hasPasscode: checkRes.exists,
        };
      }
    } catch (e) {
      console.warn("Error calling backend checkUser:", e);
    }
    return {
      exists: false,
      customerExists: false,
      profileCompleted: false,
      hasPasscode: false,
    };
  },
 
  async registerUser(params: RegisterParams, autoLogin = false): Promise<AuthResult> {
    const mobile = (params.mobileNumber || "").replace(/\D/g, "");
    if (mobile.length !== 10) return { success: false, error: "Please enter a valid 10-digit mobile number" };
    if (!params.name?.trim()) return { success: false, error: "Full name is required" };
 
    const passcode = params.passcode ? params.passcode.replace(/\D/g, "") : "";
 
    // Fetch Push Token from device/Expo push service
    let pushToken: string | undefined = undefined;
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        pushToken = token;
        console.log("📲 Push Token Attached for Registration:", pushToken);
      }
    } catch (e) {
      console.warn("Could not retrieve push token during registration:", e);
    }
 
    const user: DevUser = {
      mobileNumber: mobile,
      passcode,
      name: params.name.trim(),
      email: params.email?.trim() || `${mobile}@taxedge.in`,
      customerType: params.customerType || "Individual",
      dob: params.dob?.trim() || "",
      gender: params.gender?.trim() || "",
      fatherSpouseName: params.fatherSpouseName?.trim() || "",
      pan: params.pan?.trim().toUpperCase() || "",
      aadhaar: params.aadhaar?.trim() || "",
      address: params.address?.trim() || "",
      addressLine1: params.addressLine1?.trim() || "",
      addressLine2: params.addressLine2?.trim() || "",
      city: params.city?.trim() || "",
      pincode: params.pincode?.trim() || "",
      state: params.state?.trim() || "",
      avatarUri: params.avatarUri || null,
      pushToken,
      registrationCompleted: Boolean(passcode),
      createdAt: new Date().toISOString(),
      customerId: `CUST-2026-${mobile.slice(-5) || "00001"}`,
    };
 
    // Execute Backend Fetch Request
    const apiRes = await authApi.register({
      ...user,
      mobileNumber: mobile,
      passcode,
      pushToken,
    });
 
    if (!apiRes.success) {
      return {
        success: false,
        error: apiRes.message || "Failed to register customer on server.",
      };
    }
 
    if (apiRes.user?.customerId) {
      user.customerId = apiRes.user.customerId;
    }
 
    authStorage.saveUser(user);
 
    if (autoLogin && passcode) {
      authStorage.saveSession({
        isLoggedIn: true,
        activeMobile: mobile,
        lastLoginAt: new Date().toISOString(),
      });
    }
 
    return { success: true, user, token: apiRes.token };
  },
 
  async createPasscode(mobileNumber: string, passcode: string): Promise<AuthResult> {
    const clean = mobileNumber.replace(/\D/g, "");
    const pass = passcode.replace(/\D/g, "");
    if (clean.length !== 10) return { success: false, error: "Invalid mobile number" };
    if (pass.length !== 6) return { success: false, error: "Passcode must be exactly 6 digits" };
 
    let user = authStorage.getUserByMobile(clean);
    if (!user) {
      user = {
        customerId: `CUST-2026-${clean.slice(-5)}`,
        mobileNumber: clean,
        name: "Valued Client",
        email: `${clean}@taxedge.in`,
        customerType: "Individual",
      };
    }
 
    user.passcode = pass;
    user.registrationCompleted = true;
    authStorage.saveUser(user);
 
    try {
      await authApi.createPasscode(clean, pass);
    } catch {}
 

    authStorage.saveSession({
      isLoggedIn: true,
      activeMobile: clean,
      lastLoginAt: new Date().toISOString(),
    });
 
    return { success: true, user };
  },
 
  async loginWithPasscode(m: string, p: string): Promise<AuthResult> {
    const clean = (m || "").replace(/\D/g, "");
    const pass = (p || "").replace(/\D/g, "");
    if (clean.length !== 10) return { success: false, error: "Please enter a valid 10-digit mobile number" };
    if (pass.length !== 6) return { success: false, error: "Passcode must be exactly 6 numeric digits" };
 
    const apiRes = await authApi.loginPasscode(clean, pass);
    if (!apiRes.success) {
      return { success: false, error: apiRes.message || "Invalid mobile number or passcode" };
    }
 
    let user = authStorage.getUserByMobile(clean);
    if (!user) {
      user = apiRes.user || {
        customerId: `CUST-2026-${clean.slice(-5)}`,
        mobileNumber: clean,
        name: "Valued Client",
        email: `${clean}@taxedge.in`,
        customerType: "Individual",
      };
      authStorage.saveUser(user);
    }
 
    authStorage.saveSession({
      isLoggedIn: true,
      activeMobile: clean,
      lastLoginAt: new Date().toISOString(),
    });
    return { success: true, user, token: apiRes.token };
  },
 
  async forgotPasscode(mobileNumber: string): Promise<{ success: boolean; message?: string }> {
    const clean = mobileNumber.replace(/\D/g, "");
    return authApi.forgotPasscode(clean);
  },
 
  async updatePassword(mobileNumber: string, newPasscode: string): Promise<AuthResult> {
    const clean = mobileNumber.replace(/\D/g, "");
    const pass = newPasscode.replace(/\D/g, "");
    if (clean.length !== 10) return { success: false, error: "Please enter a valid 10-digit mobile number" };
    if (pass.length !== 6) return { success: false, error: "Passcode must be 6 numeric digits" };
 
    const apiRes = await authApi.updatePassword(clean, pass);
    if (!apiRes.success) {
      return { success: false, error: apiRes.message || "Failed to update password" };
    }
 
    let user = authStorage.getUserByMobile(clean);
    if (user) {
      user.passcode = pass;
      authStorage.saveUser(user);
    }
 
    return { success: true, user: user || undefined, message: apiRes.message };
  },
 
  async resetPasscode(mobileNumber: string, newPasscode: string, _otp?: string): Promise<AuthResult> {
    const clean = mobileNumber.replace(/\D/g, "");
    const pass = newPasscode.replace(/\D/g, "");
    if (clean.length !== 10) return { success: false, error: "Please enter a valid 10-digit mobile number" };
    if (pass.length !== 6) return { success: false, error: "Passcode must be 6 numeric digits" };
 
    const apiRes = await authApi.updatePassword(clean, pass);
    if (!apiRes.success) {
      return { success: false, error: apiRes.message || "Failed to reset passcode" };
    }
 
    let user = authStorage.getUserByMobile(clean);
    if (user) {
      user.passcode = pass;
      authStorage.saveUser(user);
    }
 
    return { success: true, user: user || undefined, message: apiRes.message };
  },
 
  login: (m: string, p: string) => authService.loginWithPasscode(m, p),
  logout: async () => {
    authStorage.clearSession();
    try {
      const refreshToken = await tokenManager.getRefreshToken();
      if (refreshToken) {
        authApi.revokeRefreshToken(refreshToken).catch(() => {});
      }
    } catch (e) {
      console.warn("Error during logout token revocation:", e);
    } finally {
      await tokenManager.clearTokens();
    }
  },
  isAuthenticated: () => Boolean(authStorage.getSession().isLoggedIn && authStorage.getSession().activeMobile),
  getActiveMobile: () => authStorage.getSession().activeMobile,
  getCurrentUser: (): DevUser | null => {
    const session = authStorage.getSession();
    return session.activeMobile ? authStorage.getUserByMobile(session.activeMobile) : null;
  },
  setAvatar: (uri: string | null) => {
    const u = authService.getCurrentUser();
    if (u) {
      u.avatarUri = uri;
      authStorage.saveUser(u);
    }
  },
  resetAccount: () => authStorage.clearAllAuthData(),
};
 
// Aliased for seamless backwards-compatibility
export const devAuthService = authService;
export default authService;
 
 