import { Platform } from "react-native";
import { apiClient } from "@/core/api/apiClient";
import { SERVER_IP } from "@/core/api/apiClient"; // Assuming SERVER_IP is exported or hardcode it

const BASE_URL = `http://${SERVER_IP || "192.168.29.65"}:8086/gst/amendments`;

export const gstAmendmentApi = {
  // Utility for XHR Upload
  uploadAmendmentWithFile: (
    endpoint: string,
    formData: FormData,
    onSuccess: (data: any) => void,
    onError: (error: Error) => void,
  ) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/${endpoint}`);

    // Do NOT set Content-Type, XHR sets it automatically with boundary for FormData

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onSuccess(xhr.responseText);
      } else {
        onError(new Error(`API Error: ${xhr.status} ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => {
      onError(new Error("Network request failed during amendment upload."));
    };

    xhr.send(formData);
  },

  // 1. Legal Name
  submitLegalNameAmendment: (
    gstId: string,
    newLegalName: string,
    file: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newLegalName", newLegalName);
      formData.append("file", file);
      gstAmendmentApi.uploadAmendmentWithFile(
        `legal-name/${gstId}`,
        formData,
        resolve,
        reject,
      );
    });
  },

  // 2. Principal Place
  submitPrincipalPlaceAmendment: (
    gstId: string,
    address: string,
    city: string,
    state: string,
    pinCode: string,
    file: any,
    district?: string,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pinCode", pinCode);
      if (district) formData.append("district", district);
      formData.append("file", file);
      gstAmendmentApi.uploadAmendmentWithFile(
        `principal-place/${gstId}`,
        formData,
        resolve,
        reject,
      );
    });
  },

  // 3. Additional Place
  submitAdditionalPlaceAmendment: (
    gstId: string,
    address: string,
    city: string,
    pinCode: string,
    natureOfBusiness: string,
    file: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("city", city);
      formData.append("pinCode", pinCode);
      // Map UI string to backend Enum
      let mappedNature = "SERVICE_PROVIDER";
      const lower = natureOfBusiness.toLowerCase();
      if (lower.includes("manufactur")) mappedNature = "MANUFACTURER";
      else if (lower.includes("trade") || lower.includes("retail"))
        mappedNature = "TRADER";
      else if (lower.includes("ware")) mappedNature = "WARE_HOUSE_DEPOT";
      else if (lower.includes("e-com")) mappedNature = "E_COMMERCE";

      formData.append("natureOfBusiness", mappedNature);
      formData.append("file", file);
      gstAmendmentApi.uploadAmendmentWithFile(
        `additional-place/${gstId}`,
        formData,
        resolve,
        reject,
      );
    });
  },

  // 4. Bank Accounts
  submitBankAccountAmendment: (
    gstId: string,
    bankName: string,
    accountNumber: string,
    ifscCode: string,
    accountType: string,
    file: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("bankName", bankName);
      formData.append("accountNumber", accountNumber);
      formData.append("ifscCode", ifscCode);

      let mappedType = "SAVINGS";
      if (accountType.toLowerCase().includes("current")) mappedType = "CURRENT";

      formData.append("accountType", mappedType);
      formData.append("file", file);
      gstAmendmentApi.uploadAmendmentWithFile(
        `bank-account/${gstId}`,
        formData,
        resolve,
        reject,
      );
    });
  },

  // 5. Contact Details
  submitContactAmendment: (
    gstId: string,
    mobileNumber: string,
    email: string,
    file: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("mobileNumber", mobileNumber);
      formData.append("email", email);
      formData.append("file", file);
      gstAmendmentApi.uploadAmendmentWithFile(
        `contact/${gstId}`,
        formData,
        resolve,
        reject,
      );
    });
  },

  // 6. Authorised Signatories
  submitSignatoryAmendment: (
    gstId: string,
    signatoryName: string,
    signatoryPan: string,
    file: any,
    signatoryDob?: string,
    designation?: string,
    signatoryMobile?: string,
    signatoryEmail?: string,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("signatoryName", signatoryName);
      formData.append("signatoryPan", signatoryPan);

      // Parse DD-MM-YYYY to YYYY-MM-DD for ISO date (with zero padding)
      if (signatoryDob) {
        const parts = signatoryDob.split("-");
        if (parts.length === 3) {
          const d = parts[0].padStart(2, "0");
          const m = parts[1].padStart(2, "0");
          const y = parts[2];
          formData.append("signatoryDob", `${y}-${m}-${d}`);
        } else {
          formData.append("signatoryDob", signatoryDob);
        }
      }

      if (designation) formData.append("designation", designation);
      if (signatoryMobile) formData.append("signatoryMobile", signatoryMobile);
      if (signatoryEmail) formData.append("signatoryEmail", signatoryEmail);

      formData.append("file", file);
      gstAmendmentApi.uploadAmendmentWithFile(
        `signatory/${gstId}`,
        formData,
        resolve,
        reject,
      );
    });
  },
};
