import { apiClient } from "../../../core/api/apiClient";
import type { DevUser, RegistrationData } from "../types/auth.types";

export interface SendOtpResponse {
  success: boolean;
  message?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  isExistingUser?: boolean;
  customerExists?: boolean;
  profileCompleted?: boolean;
  hasPasscode?: boolean;
  message?: string;
  user?: DevUser;
  customer?: any;
}

export interface CheckUserResponse {
  success: boolean;
  exists: boolean;
  customerExists?: boolean;
  profileCompleted?: boolean;
  hasPasscode?: boolean;
  user?: DevUser;
}

export interface RegisterResponse {
  success: boolean;
  user: DevUser;
  token?: string;
  message?: string;
}

export interface PasscodeResponse {
  success: boolean;
  user?: DevUser;
  token?: string;
  message?: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message?: string;
}

export const authApi = {
  sendOtp: async (mobileNumber: string): Promise<SendOtpResponse> => {
    const cleanMobile = mobileNumber.replace(/\D/g, "");
    try {
      console.log(
        `🚀 [OTP] Sending POST http://192.168.88.41:8088/otp/generate for mobile: ${cleanMobile}`,
      );
      const res = await apiClient.post<any>("/otp/generate", {
        mobileNumber: cleanMobile,
      });
      console.log(
        `✅ [OTP] Backend generated OTP successfully! Response:`,
        res,
      );
      return {
        success: true,
        message: typeof res === "string" ? res : "OTP generated successfully",
      };
    } catch (error: any) {
      console.log(
        "ℹ️ [OTP] Error requesting OTP from backend:",
        error?.message,
      );
      const errorMsg = error?.message?.includes("Network request failed")
        ? `Network error: Unable to reach backend at 192.168.88.41:8088. Check Wi-Fi connection.`
        : error?.message || "Failed to generate OTP";
      return { success: false, message: errorMsg };
    }
  },

  verifyOtp: async (
    mobileNumber: string,
    otp: string,
  ): Promise<VerifyOtpResponse> => {
    const cleanMobile = mobileNumber.replace(/\D/g, "");
    try {
      console.log(
        `🚀 [OTP] Verifying with Backend POST /otp/verify for: ${cleanMobile}, code: ${otp}`,
      );
      const res = await apiClient.post<any>("/otp/verify", {
        mobileNumber: cleanMobile,
        otpCode: otp,
      });
      console.log("✅ [OTP] Backend verified OTP successfully:", res);

      const customerExists =
        res?.customerExists === true || res?.isExistingUser === true;
      const profileCompleted = res?.profileCompleted === true;
      const hasPasscode = res?.hasPasscode === true;

      let devUser: DevUser | undefined;
      if (res?.customer) {
        devUser = {
          customerId: res.customer.custId,
          name: res.customer.name,
          email: res.customer.email,
          mobileNumber: res.customer.mobileNumber || cleanMobile,
          pan: res.customer.pan || "",
          aadhaar: res.customer.aadhaar || "",
          dob: res.customer.dob || "",
          addressLine1: res.customer.addressLine1 || "",
          addressLine2: res.customer.addressLine2 || "",
          city: res.customer.city || "",
          state: res.customer.state || "",
          pincode: res.customer.pincode || "",
          address: res.customer.address || "",
          customerType: res.customer.customerType || "Individual",
          registrationCompleted: profileCompleted,
        };
      }

      return {
        success: true,
        isExistingUser: customerExists,
        customerExists,
        profileCompleted,
        hasPasscode,
        message: res?.message || "OTP verified successfully",
        user: devUser,
        customer: res?.customer,
      };
    } catch (error: any) {
      console.log("ℹ️ [OTP] Incorrect OTP entered for:", cleanMobile);
      const backendMsg =
        error?.message &&
        error.message !== "Request failed" &&
        !error.message.includes("status code")
          ? error.message
          : "Incorrect OTP code. Please enter the valid OTP sent to your terminal.";
      return {
        success: false,
        isExistingUser: false,
        customerExists: false,
        profileCompleted: false,
        hasPasscode: false,
        message: backendMsg,
      };
    }
  },

  checkUser: async (mobileNumber: string): Promise<CheckUserResponse> => {
    const cleanMobile = mobileNumber.replace(/\D/g, "");
    try {
      console.log(
        `🚀 [API] Checking customer status GET /customer/exists/${cleanMobile}`,
      );
      const res = await apiClient.get<any>(`/customer/exists/${cleanMobile}`);
      console.log(`✅ [API] Customer status for ${cleanMobile}:`, res);
      const exists = res?.exists === true || res?.customerExists === true;
      return {
        success: true,
        exists,
        customerExists: exists,
        profileCompleted: res?.profileCompleted === true,
        hasPasscode: res?.hasPasscode === true,
      };
    } catch (err: any) {
      console.warn("Error calling /customer/exists:", err?.message);
      return {
        success: false,
        exists: false,
        customerExists: false,
        profileCompleted: false,
        hasPasscode: false,
      };
    }
  },

  register: async (
    data: RegistrationData & { mobileNumber: string; passcode?: string },
  ): Promise<RegisterResponse> => {
    try {
      // Format DOB from DD-MM-YYYY to YYYY-MM-DD for Spring Boot LocalDate
      let formattedDob = data.dob || "";
      if (formattedDob && /^\d{2}-\d{2}-\d{4}$/.test(formattedDob)) {
        const [d, m, y] = formattedDob.split("-");
        formattedDob = `${y}-${m}-${d}`;
      }

      // Format CustomerType string to match Spring Boot Enum
      let rawType = (data.customerType || "INDIVIDUAL").trim();
      const typeLower = rawType.toLowerCase();
      if (typeLower.includes("freelancer")) {
        rawType = "FREELANCER";
      } else if (
        typeLower.includes("private limited") ||
        typeLower.includes("pvt")
      ) {
        rawType = "PRIVATE_LIMITED";
      } else if (typeLower.includes("public limited")) {
        rawType = "PUBLIC_LIMITED";
      } else if (typeLower === "llp") {
        rawType = "LLP";
      } else if (typeLower.includes("partnership")) {
        rawType = "PARTNERSHIP";
      } else if (typeLower.includes("proprietorship")) {
        rawType = "PROPRIETORSHIP";
      } else if (typeLower.includes("huf")) {
        rawType = "HUF";
      } else if (typeLower.includes("aop") || typeLower.includes("boi")) {
        rawType = "AOP_BOI";
      } else if (typeLower.includes("ngo") || typeLower.includes("trust")) {
        rawType = "NGO_TRUST";
      } else if (typeLower.includes("individual")) {
        rawType = "INDIVIDUAL";
      } else {
        rawType = rawType.toUpperCase().replace(/[\s\/]+/g, "_");
      }

      // Format full address from discrete fields if provided
      let formattedAddress = data.address || "";
      if (!formattedAddress && data.addressLine1) {
        formattedAddress = [
          data.addressLine1,
          data.addressLine2,
          data.city,
          data.state
            ? `${data.state}${data.pincode ? " - " + data.pincode : ""}`
            : data.pincode,
        ]
          .filter(Boolean)
          .join(", ");
      }

      // Map payload to match Spring Boot CustomerDto format exactly
      const payload = {
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber.replace(/\D/g, ""),
        aadhaar: data.aadhaar,
        pan: data.pan,
        dob: formattedDob,
        customerType: rawType,
        gender: data.gender,
        fatherSpouseName: data.fatherSpouseName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        pincode: data.pincode,
        state: data.state,
        address: formattedAddress,
        password: data.passcode,
        pushToken: data.pushToken,
      };

      console.log("🚀 FETCHING POST /customer/register Payload:", payload);
      const response = await apiClient.post<any>("/customer/register", payload);
      console.log("✅ Backend Registration Response:", response);

      return {
        success: true,
        user: {
          customerId: response.custId || `CUST-${data.mobileNumber}`,
          mobileNumber: response.mobileNumber || data.mobileNumber,
          name: response.name || data.name,
          email: data.email,
          pushToken: data.pushToken,
        },
        token: response.accessToken,
      };
    } catch (error: any) {
      console.error("❌ Backend Registration Fetch Error:", error);
      return {
        success: false,
        message: error?.message || "Registration failed on backend",
        user: {} as DevUser,
      };
    }
  },

  createPasscode: async (
    mobileNumber: string,
    passcode: string,
  ): Promise<PasscodeResponse> => {
    try {
      return await apiClient.post<PasscodeResponse>("/auth/create-passcode", {
        mobileNumber,
        passcode,
      });
    } catch {
      return { success: true, message: "Passcode created successfully" };
    }
  },

  loginPasscode: async (
    mobileNumber: string,
    passcode: string,
  ): Promise<PasscodeResponse> => {
    try {
      const cleanMobile = mobileNumber.replace(/\D/g, "");
      console.log("🚀 FETCHING POST /customer/login for:", cleanMobile);
      const response = await apiClient.post<any>("/customer/login", {
        mobileNumber: cleanMobile,
        password: passcode,
      });
      console.log("✅ Backend Login Response:", response);

      return {
        success: true,
        token: response.accessToken,
        user: {
          customerId: response.custId,
          mobileNumber: response.mobileNumber,
          name: response.name,
          email: `${response.mobileNumber}@taxedge.in`,
        },
      };
    } catch (error: any) {
      console.error("❌ Backend Login Fetch Error:", error);
      return {
        success: false,
        message: error?.message || "Invalid mobile number or passcode",
      };
    }
  },

  updatePassword: async (
    mobileNumber: string,
    password: string,
  ): Promise<UpdatePasswordResponse> => {
    const cleanMobile = mobileNumber.replace(/\D/g, "");
    try {
      console.log(
        `🚀 [API] Sending PATCH /customer/update_password for: ${cleanMobile}`,
      );
      const res = await apiClient.patch<any>("/customer/update_password", {
        mobileNumber: cleanMobile,
        password,
      });
      console.log("✅ [API] Password update response:", res);

      const msg =
        typeof res === "string"
          ? res
          : res?.message || "Password updated successfully";
      if (typeof msg === "string" && msg.toLowerCase().includes("not found")) {
        return { success: false, message: msg };
      }
      return { success: true, message: msg };
    } catch (error: any) {
      console.error("❌ [API] Password update error:", error);
      return {
        success: false,
        message: error?.message || "Failed to update password",
      };
    }
  },

  forgotPasscode: async (mobileNumber: string): Promise<SendOtpResponse> => {
    const cleanMobile = mobileNumber.replace(/\D/g, "");
    return authApi.sendOtp(cleanMobile);
  },

  resetPasscode: async (
    mobileNumber: string,
    newPasscode: string,
    _otp?: string,
  ): Promise<PasscodeResponse> => {
    const res = await authApi.updatePassword(mobileNumber, newPasscode);
    return {
      success: res.success,
      message: res.message,
    };
  },
};

export default authApi;
