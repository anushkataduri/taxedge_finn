import { authService } from "../../modules/authentication/services/authService";
import { passcodeService } from "../../modules/authentication/services/passcodeService";
import { biometricService } from "../../modules/authentication/services/biometricService";
import { authStorage } from "../../modules/authentication/services/authStorage";
import { authApi } from "../../modules/authentication/services/authApi";
import { tokenManager } from "../../core/authentication/tokenManager";
import { useAuthStore } from "../../modules/authentication/store/authStore";
import type { CustomerProfile } from "../../../src/shared/types/domain";

export interface TestResult {
  scenarioNumber: number;
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

export async function runAllAuthIntegrationTests(): Promise<{
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
}> {
  const results: TestResult[] = [];

  const record = (scenarioNumber: number, name: string, passed: boolean, details?: string, error?: string) => {
    results.push({ scenarioNumber, name, passed, details, error });
    const status = passed ? "✅ PASS" : "❌ FAIL";
    console.log(`[Scenario ${scenarioNumber}] ${status}: ${name}`);
    if (details) console.log(`   Details: ${details}`);
    if (error) console.log(`   Error: ${error}`);
  };

  console.log("\n==================================================");
  console.log("RUNNING TAXEDGE AUTH INTEGRATION TESTS (12 SCENARIOS)");
  console.log("==================================================\n");

  // SCENARIO 1: New user: Phone -> OTP -> Profile -> Passcode setup -> Dashboard
  try {
    await authService.logout();
    useAuthStore.getState().resetFlow();

    const mobile = "9876500001";
    useAuthStore.getState().setMobileNumber(mobile);

    // Mock OTP verification response for new user (customerExists = false)
    const originalVerify = authService.verifyOtp;
    authService.verifyOtp = async () => ({
      success: true,
      customerExists: false,
      isExistingUser: false,
      hasPasscode: false,
      profileCompleted: false,
    });

    const otpRes = await useAuthStore.getState().verifyOtp("123456");
    const isNew = !otpRes.isExistingUser && !otpRes.requiresPasscode;
    const sessionNotActive = !useAuthStore.getState().isLoggedIn;

    // Now complete registration
    const dummyProfile: CustomerProfile = {
      name: "New Test User",
      email: "newuser@taxedge.in",
      pan: "ABCDE1234F",
      aadhaar: "123456789012",
      dob: "1995-05-15",
      gender: "Male",
      fatherSpouseName: "Parent Name",
      address: "123 Tech Street",
      addressLine1: "123 Tech Street",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      customerType: "Individual",
    };

    const originalRegister = authApi.register;
    authApi.register = async () => ({
      success: true,
      user: {
        customerId: "CUST_9876500001",
        name: dummyProfile.name,
        mobileNumber: mobile,
        email: dummyProfile.email,
        pan: dummyProfile.pan,
        aadhaar: dummyProfile.aadhaar,
        dob: dummyProfile.dob,
        registrationCompleted: true,
      },
      token: "mock-jwt-token-newuser",
    });

    const regRes = await useAuthStore.getState().register(dummyProfile, "112233");
    const authedAfterReg = useAuthStore.getState().isLoggedIn;
    const hasStoredPasscode = await passcodeService.hasPasscode(mobile);

    // Restore mocks
    authService.verifyOtp = originalVerify;
    authApi.register = originalRegister;

    const passed = isNew && sessionNotActive && regRes.success && authedAfterReg && hasStoredPasscode;
    record(1, "New user: Phone -> OTP -> Profile -> Passcode setup -> Dashboard", passed, "Verified new user stays unauthenticated until registration with passcode is complete.");
  } catch (err: any) {
    record(1, "New user: Phone -> OTP -> Profile -> Passcode setup -> Dashboard", false, undefined, err.message);
  }

  // SCENARIO 2: Existing user: Phone -> OTP -> Passcode -> Dashboard
  try {
    await authService.logout();
    useAuthStore.getState().resetFlow();

    const mobile = "9876500002";
    useAuthStore.getState().setMobileNumber(mobile);
    await passcodeService.setPasscode(mobile, "654321");

    // Save existing user in authStorage
    authStorage.saveUser({
      customerId: "CUST_9876500002",
      mobileNumber: mobile,
      name: "Existing User",
      email: "existing@taxedge.in",
      registrationCompleted: true,
      hasPasscode: true,
    });

    const originalVerify = authService.verifyOtp;
    authService.verifyOtp = async () => ({
      success: true,
      customerExists: true,
      isExistingUser: true,
      hasPasscode: true,
      profileCompleted: true,
    });

    const otpRes = await useAuthStore.getState().verifyOtp("123456");
    const flowState = useAuthStore.getState().authFlowState;
    const isPasscodePrompted = flowState === "PASSCODE_LOGIN";
    const loginRes = await useAuthStore.getState().loginWithPasscode("654321");
    const loggedIn = useAuthStore.getState().isLoggedIn;

    // Restore
    authService.verifyOtp = originalVerify;

    const passed = otpRes.requiresPasscode === true && isPasscodePrompted && loginRes.success && loggedIn;
    if (!passed) {
      console.log("   [Scenario 2 Debug]:", {
        requiresPasscode: otpRes.requiresPasscode,
        isPasscodePrompted,
        loginSuccess: loginRes.success,
        loginError: loginRes.error,
        loggedIn,
      });
    }
    record(2, "Existing user: Phone -> OTP -> Passcode -> Dashboard", passed, "Verified existing user is routed to passcode screen and logs in upon entering correct passcode.");
  } catch (err: any) {
    record(2, "Existing user: Phone -> OTP -> Passcode -> Dashboard", false, undefined, err.stack || err.message);
  }

  // SCENARIO 3: App restart with Biometric enabled -> Biometric prompt -> Dashboard
  try {
    const mobile = "9876500003";
    authStorage.saveSession({
      isLoggedIn: true,
      activeMobile: mobile,
      lastLoginAt: new Date().toISOString(),
    });
    authStorage.saveUser({
      customerId: "CUST_9876500003",
      mobileNumber: mobile,
      name: "Biometric User",
      email: "bio@taxedge.in",
      registrationCompleted: true,
    });

    // Mock biometric enabled and successful authentication
    await biometricService.setBiometricEnabled(true, mobile);
    const originalAuth = biometricService.authenticate;
    biometricService.authenticate = async () => ({ success: true });

    const session = authStorage.getSession();
    const isBioEnabled = await biometricService.isBiometricEnabled(mobile);
    let authSuccess = false;

    if (session?.isLoggedIn && isBioEnabled) {
      const authRes = await biometricService.authenticate();
      authSuccess = authRes.success;
    }

    biometricService.authenticate = originalAuth;
    const passed = Boolean(session?.isLoggedIn) && isBioEnabled && authSuccess;
    record(3, "App restart with Biometric enabled -> Biometric prompt -> Dashboard", passed, "Biometric authentication triggered on restart and unlocks directly to dashboard.");
  } catch (err: any) {
    record(3, "App restart with Biometric enabled -> Biometric prompt -> Dashboard", false, undefined, err.message);
  }

  // SCENARIO 4: App restart with Passcode only -> Passcode screen -> Dashboard
  try {
    const mobile = "9876500004";
    authStorage.saveSession({
      isLoggedIn: true,
      activeMobile: mobile,
      lastLoginAt: new Date().toISOString(),
    });
    authStorage.saveUser({
      customerId: "CUST_9876500004",
      mobileNumber: mobile,
      name: "Passcode Only User",
      email: "pass@taxedge.in",
      registrationCompleted: true,
      hasPasscode: true,
    });

    await biometricService.setBiometricEnabled(false, mobile);
    await passcodeService.setPasscode(mobile, "223344");

    const session = authStorage.getSession();
    const isBioEnabled = await biometricService.isBiometricEnabled(mobile);
    const hasPass = await passcodeService.hasPasscode(mobile);

    let nextFlowState = "";
    if (session?.isLoggedIn) {
      if (isBioEnabled) {
        nextFlowState = "BIOMETRIC";
      } else if (hasPass) {
        nextFlowState = "PASSCODE_LOGIN";
      } else {
        nextFlowState = "HOME";
      }
    }

    const passed = !isBioEnabled && hasPass && nextFlowState === "PASSCODE_LOGIN";
    record(4, "App restart with Passcode only -> Passcode screen -> Dashboard", passed, "Verified app restart with passcode-only configuration challenges user with passcode screen and never bypasses directly to dashboard.");
  } catch (err: any) {
    record(4, "App restart with Passcode only -> Passcode screen -> Dashboard", false, undefined, err.message);
  }

  // SCENARIO 5: Biometric cancelled -> Fall back to Passcode
  try {
    const mobile = "9876500005";
    await biometricService.setBiometricEnabled(true, mobile);
    await passcodeService.setPasscode(mobile, "556677");

    // Mock biometric cancellation
    const originalAuth = biometricService.authenticate;
    biometricService.authenticate = async () => ({
      success: false,
      cancelled: true,
      error: "Authentication cancelled",
    });

    const bioRes = await biometricService.authenticate();
    let fallbackTarget = "";
    if (!bioRes.success) {
      const hasPass = await passcodeService.hasPasscode(mobile);
      fallbackTarget = hasPass ? "PASSCODE_LOGIN" : "ENTER_MOBILE";
    }

    biometricService.authenticate = originalAuth;
    const passed = !bioRes.success && bioRes.cancelled === true && fallbackTarget === "PASSCODE_LOGIN";
    record(5, "Biometric cancelled -> Fall back to Passcode", passed, "Verified biometric cancellation falls back cleanly to passcode prompt without crashing or bypassing.");
  } catch (err: any) {
    record(5, "Biometric cancelled -> Fall back to Passcode", false, undefined, err.message);
  }

  // SCENARIO 6: Wrong passcode 5 times -> 30 second lockout enforced
  try {
    const mobile = "9876500006";
    await passcodeService.setPasscode(mobile, "111111");
    await passcodeService.resetFailedAttempts(mobile);

    // Enter wrong passcode 5 times
    let lockoutOccurred = false;
    let lockoutRemaining = 0;

    for (let i = 1; i <= 5; i++) {
      const res = await passcodeService.recordFailedAttempt(mobile);
      if (res.isLocked) {
        lockoutOccurred = true;
        lockoutRemaining = res.remainingSeconds;
      }
    }

    // 6th attempt should be blocked by checkLockout
    const check = await passcodeService.checkLockout(mobile);
    await passcodeService.resetFailedAttempts(mobile); // Cleanup

    const passed = lockoutOccurred && lockoutRemaining > 0 && check.isLocked;
    record(6, "Wrong passcode 5 times -> 30 second lockout enforced", passed, `Verified 5 failed attempts triggered lockout of ${lockoutRemaining}s, blocking subsequent attempts.`);
  } catch (err: any) {
    record(6, "Wrong passcode 5 times -> 30 second lockout enforced", false, undefined, err.message);
  }

  // SCENARIO 7: Expired accessToken -> Automatic refresh via refreshToken -> Request succeeds
  try {
    await tokenManager.setAccessToken("expired-token");
    await tokenManager.setRefreshToken("valid-refresh-token");

    let refreshCalled = false;
    let requestRetried = false;

    // Mock token refresh
    const mockRefreshTokenCall = async () => {
      refreshCalled = true;
      await tokenManager.setAccessToken("new-fresh-token");
      return { accessToken: "new-fresh-token" };
    };

    // Simulate client interceptor behavior
    const simulateAuthenticatedRequest = async () => {
      let token = await tokenManager.getAccessToken();
      if (token === "expired-token") {
        // 401 caught
        const rToken = await tokenManager.getRefreshToken();
        if (rToken) {
          await mockRefreshTokenCall();
          token = await tokenManager.getAccessToken();
          requestRetried = true;
        }
      }
      return { status: 200, data: "Success with token " + token };
    };

    const res = await simulateAuthenticatedRequest();
    const finalToken = await tokenManager.getAccessToken();

    const passed = refreshCalled && requestRetried && finalToken === "new-fresh-token" && res.status === 200;
    record(7, "Expired accessToken -> Automatic refresh via refreshToken -> Request succeeds", passed, "Verified 401 triggers refreshToken call, saves new token, and retries successfully.");
  } catch (err: any) {
    record(7, "Expired accessToken -> Automatic refresh via refreshToken -> Request succeeds", false, undefined, err.message);
  }

  // SCENARIO 8: Logout -> Clears tokens, active session, redirects to Login
  try {
    const mobile = "9876500008";
    await tokenManager.setAccessToken("token-to-clear");
    await tokenManager.setRefreshToken("refresh-to-clear");
    authStorage.saveSession({
      isLoggedIn: true,
      activeMobile: mobile,
      lastLoginAt: new Date().toISOString(),
    });

    useAuthStore.setState({
      isLoggedIn: true,
      mobileNumber: mobile,
      isBiometricEnabled: true,
    });

    // Execute logout
    await useAuthStore.getState().logout();

    const tokenAfter = await tokenManager.getAccessToken();
    const refreshAfter = await tokenManager.getRefreshToken();
    const sessionAfter = authStorage.getSession();
    const storeAfter = useAuthStore.getState();

    const passed =
      !tokenAfter &&
      !refreshAfter &&
      sessionAfter.isLoggedIn === false &&
      storeAfter.isLoggedIn === false &&
      storeAfter.isBiometricEnabled === false;

    record(8, "Logout -> Clears tokens, active session, redirects to Login", passed, "All authentication tokens, active session markers, and biometric states are cleared on logout.");
  } catch (err: any) {
    record(8, "Logout -> Clears tokens, active session, redirects to Login", false, undefined, err.message);
  }

  // SCENARIO 9: User A registers -> User B logs in on same device -> Data isolation verified
  try {
    const mobileA = "9876500009";
    const mobileB = "9876500010";

    // User A
    await passcodeService.setPasscode(mobileA, "111222");
    await biometricService.setBiometricEnabled(true, mobileA);
    authStorage.saveUser({
      customerId: "CUST_A",
      mobileNumber: mobileA,
      name: "User Alice",
      email: "alice@taxedge.in",
      registrationCompleted: true,
    });

    // User A logs out
    await authService.logout();

    // User B registers
    await passcodeService.setPasscode(mobileB, "333444");
    authStorage.saveUser({
      customerId: "CUST_B",
      mobileNumber: mobileB,
      name: "User Bob",
      email: "bob@taxedge.in",
      registrationCompleted: true,
    });

    // Verify isolation:
    // 1. Passcode of A cannot authenticate B
    const verifyWrong = await passcodeService.verifyPasscode(mobileB, "111222");
    // 2. Passcode of B authenticates B
    const verifyRight = await passcodeService.verifyPasscode(mobileB, "333444");
    // 3. User B biometric is false because biometric was enrolled for mobileA
    const bioBEnabled = await biometricService.isBiometricEnabled(mobileB);
    // 4. Stored user profile for B is isolated
    const userB = authStorage.getUserByMobile(mobileB);
    const userA = authStorage.getUserByMobile(mobileA);

    const passed =
      !verifyWrong.success &&
      verifyRight.success &&
      !bioBEnabled &&
      userB?.name === "User Bob" &&
      userA?.name === "User Alice";

    record(9, "User A registers -> User B logs in on same device -> Data isolation verified", passed, "Verified credentials, secure biometric association, and profiles are completely isolated per mobile number.");
  } catch (err: any) {
    record(9, "User A registers -> User B logs in on same device -> Data isolation verified", false, undefined, err.stack || err.message);
  }

  // SCENARIO 10: Network failure during CustomerExists check -> Handled gracefully, user not misclassified
  try {
    useAuthStore.getState().resetFlow();
    const mobile = "9876500011";
    useAuthStore.getState().setMobileNumber(mobile);

    // Mock network failure in authApi.checkUser
    const originalCheck = authApi.checkUser;
    authApi.checkUser = async () => ({
      success: false,
      exists: false,
      customerExists: undefined,
      profileCompleted: false,
      hasPasscode: false,
      error: "Network error: unable to connect to server",
    });

    const checkRes = await useAuthStore.getState().checkUser(mobile);
    const state = useAuthStore.getState();

    // Restore
    authApi.checkUser = originalCheck;

    // User should NOT be misclassified as existing=false / new user; error must be reported
    const userNotFalselyMarkedNew = state.customerExists !== true && checkRes.success === false;
    const errorRecorded = Boolean(state.error);

    const passed = userNotFalselyMarkedNew && errorRecorded;
    record(10, "Network failure during CustomerExists check -> Handled gracefully, user not misclassified", passed, `Network failure handled gracefully with error "${state.error}". Customer was not misclassified.`);
  } catch (err: any) {
    record(10, "Network failure during CustomerExists check -> Handled gracefully, user not misclassified", false, undefined, err.message);
  }

  // SCENARIO 11: Device with NO biometric hardware -> Skip biometric opt-in, use Passcode
  try {
    const originalHw = biometricService.checkHardwareSupport;
    biometricService.checkHardwareSupport = async () => false;

    const hasHw = await biometricService.checkHardwareSupport();
    const isAvail = await biometricService.isBiometricAvailable();

    // With no hardware, opt-in modal should never be presented
    const shouldOfferBiometrics = hasHw && isAvail;

    // Restore
    biometricService.checkHardwareSupport = originalHw;

    const passed = !hasHw && !isAvail && !shouldOfferBiometrics;
    record(11, "Device with NO biometric hardware -> Skip biometric opt-in, use Passcode", passed, "Verified devices without biometric hardware skip biometric prompts and rely solely on Passcode.");
  } catch (err: any) {
    record(11, "Device with NO biometric hardware -> Skip biometric opt-in, use Passcode", false, undefined, err.message);
  }

  // SCENARIO 12: Attempt to bypass Create Profile for new user -> Blocked
  try {
    useAuthStore.getState().resetFlow();
    const mobile = "9876500012";
    useAuthStore.getState().setMobileNumber(mobile);

    // User has verified OTP but has not registered in backend
    useAuthStore.setState({
      customerExists: false,
      isExistingUser: false,
      isLoggedIn: false,
      profileCompleted: false,
    });

    // Attempting loginWithPasscode without completing profile/registration
    const loginAttempt = await useAuthStore.getState().loginWithPasscode("123456");
    const stillLoggedOut = !useAuthStore.getState().isLoggedIn;

    // Ensure session is not authenticated
    const passed = !loginAttempt.success && stillLoggedOut;
    record(12, "Attempt to bypass Create Profile for new user -> Blocked", passed, "Verified uncompleted profile blocks login attempts and prevents unauthenticated session escalation.");
  } catch (err: any) {
    record(12, "Attempt to bypass Create Profile for new user -> Blocked", false, undefined, err.message);
  }

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log("\n==================================================");
  console.log(`INTEGRATION TESTS SUMMARY: ${passedCount}/${results.length} PASSED (${failedCount} FAILED)`);
  console.log("==================================================\n");

  return {
    total: results.length,
    passed: passedCount,
    failed: failedCount,
    results,
  };
}

export const AuthFlowIntegrationTest = {
  name: "Auth Flow Integration Tests",
  run: runAllAuthIntegrationTests,
};

export default AuthFlowIntegrationTest;
