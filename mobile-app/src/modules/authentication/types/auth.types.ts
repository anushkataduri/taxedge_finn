import type { Customer, CustomerProfile } from "../../../shared/types/domain";

export type AuthFlowState =
  | "ENTER_MOBILE"
  | "OTP_VERIFICATION"
  | "PASSCODE_LOGIN"
  | "FORGOT_PASSCODE_OTP"
  | "RESET_PASSCODE";

export interface RegistrationData {
  name: string;
  email: string;
  customerType?: string;
  dob?: string;
  gender?: string;
  fatherSpouseName?: string;
  pan?: string;
  aadhaar?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  pincode?: string;
  state?: string;
  avatarUri?: string | null;
  pushToken?: string;
}

export interface DevUser {
  customerId: string;
  mobileNumber: string;
  name: string;
  email: string;
  gender?: string;
  fatherSpouseName?: string;
  pan?: string;
  aadhaar?: string;
  dob?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  pincode?: string;
  state?: string;
  customerType?: string;
  avatarUri?: string | null;
  passcode?: string;
  pushToken?: string;
  registrationCompleted?: boolean;
  createdAt?: string;
}

export interface AuthResult {
  success: boolean;
  user?: DevUser;
  isExistingUser?: boolean;
  customerExists?: boolean;
  profileCompleted?: boolean;
  hasPasscode?: boolean;
  message?: string;
  error?: string;
  token?: string;
}

export interface AuthStoreState {
  // Session & user
  isLoggedIn: boolean;
  mobileNumber: string;
  customer: Customer | null;
  authenticatedUser: DevUser | null;

  // Flow State
  authFlowState: AuthFlowState;
  isExistingUser: boolean;
  customerExists: boolean;
  profileCompleted: boolean;
  hasPasscode: boolean;
  isLoading: boolean;
  error: string | null;

  // OTP State
  otp: string;
  otpTimer: number;
  canResendOTP: boolean;

  // Passcode State
  passcode: string;
  confirmPasscode: string;

  // Onboarding & Service Access
  pendingServiceRoute: string | null;
  isCompleteProfileModalOpen: boolean;

  // Biometric Authentication
  isBiometricEnabled: boolean;
  biometricTypeLabel: string;
}


export interface AuthStoreActions {
  // Field updaters
  setMobileNumber: (m: string) => void;
  setOtp: (otp: string) => void;
  setPasscode: (p: string) => void;
  setConfirmPasscode: (cp: string) => void;
  setAuthFlowState: (state: AuthFlowState) => void;
  setError: (err: string | null) => void;
  setIsLoading: (loading: boolean) => void;

  // Onboarding & Service Access actions
  setProfileCompleted: (completed: boolean) => void;
  setPendingServiceRoute: (route: string | null) => void;
  openCompleteProfileModal: (targetRoute?: string) => void;
  closeCompleteProfileModal: () => void;

  // Biometric actions
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  syncBiometricState: () => Promise<void>;

  // Timer actions
  setOtpTimer: (t: number) => void;
  decrementTimer: () => void;
  resetTimer: (initialSeconds?: number) => void;

  // Business Flow Operations
  sendOtp: (overrideMobile?: string) => Promise<boolean>;
  verifyOtp: (codeToVerify?: string) => Promise<{ success: boolean; isExistingUser?: boolean; requiresPasscode?: boolean; profileCompleted?: boolean }>;
  loginWithPasscode: (passcodeToUse?: string) => Promise<{ success: boolean; error?: string }>;
  startForgotPasscode: () => Promise<boolean>;
  verifyForgotPasscodeOtp: (codeToVerify?: string) => Promise<boolean>;
  resetPasscodeAndProceed: () => Promise<boolean>;
  updatePassword: (mobileNumber: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  resendOtp: () => Promise<boolean>;
  changeNumber: () => void;
  resetFlow: () => void;

  // Registration & Session actions
  login: (p?: string) => Promise<{ success: boolean; error?: string }>;
  register: (profile: CustomerProfile, passcode?: string, autoLogin?: boolean) => Promise<{ success: boolean; error?: string }>;
  setAvatar: (uri: string | null) => void;
  logout: () => void;
  syncFromDevAuth: () => void;
}

export type AuthState = AuthStoreState & AuthStoreActions;
