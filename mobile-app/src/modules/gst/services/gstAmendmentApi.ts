import { apiClient, SERVER_IP, SERVER_PORT } from "@/core/api/apiClient";
import { tokenManager } from "@/core/authentication/tokenManager";
import { useAuthStore } from "@/store/authStore";

const formatFile = (file: any) => {
  if (!file) return undefined;
  if (file.uri) {
    return {
      uri: file.uri,
      name: file.name || "proof.jpg",
      type: file.name?.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg",
    } as any;
  }
  return file;
};

const mapNatureOfPremises = (nature?: string): string => {
  const lower = (nature || "").toLowerCase();
  switch (true) {
    case lower.includes("lease"):
      return "LEASED";
    case lower.includes("rent"):
      return "RENTED";
    case lower.includes("consent"):
      return "CONSENT";
    case lower.includes("share"):
      return "SHARED";
    case lower.includes("own"):
      return "OWNED";
    default:
      return "OTHERS";
  }
};

export const gstAmendmentApi = {
  // Utility for XHR Upload
  uploadAmendmentWithFile: async (
    endpoint: string,
    formData: FormData,
    onSuccess: (data: any) => void,
    onError: (error: Error) => void,
    method: "POST" | "PUT" = "POST",
  ) => {
    try {
      const baseUrl =
        apiClient.getBaseUrl() || `http://${SERVER_IP}:${SERVER_PORT}`;
      const url = `${baseUrl}/api/v1/gst/amendments/${endpoint}`;
      console.log(`Submitting amendment via XHR (${method}) to:`, url);

      try {
        const authState = useAuthStore.getState();
        const custId =
          authState.customer?.customerId ||
          authState.authenticatedUser?.customerId ||
          (authState.authenticatedUser as any)?.custId ||
          (authState.customer as any)?.custId;
        if (custId && typeof custId === "string" && custId.trim() !== "") {
          formData.append("customerId", custId.trim());
        }
      } catch {}

      const token = await tokenManager.getAccessToken();

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const parsed = JSON.parse(xhr.responseText);
            onSuccess(parsed);
          } catch {
            onSuccess(xhr.responseText);
          }
        } else {
          onError(new Error(`API Error: ${xhr.status} ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => {
        onError(new Error("Network request failed during amendment upload."));
      };

      xhr.send(formData);
    } catch (err: any) {
      onError(err);
    }
  },

  // ====================================================
  // 1. Legal Name
  // ====================================================
  getExistingLegalName: (gstId: string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/legal-name/${gstId}/existing`);
  },
  submitLegalNameAmendment: (
    gstId: string,
    newLegalName: string,
    file: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newLegalName", newLegalName);
      formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `legal-name/${gstId}`,
        formData,
        resolve,
        reject,
        "POST",
      );
    });
  },
  getLegalNameAmendmentById: (id: number | string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/legal-name/record/${id}`);
  },
  updateLegalNameAmendment: (
    id: number | string,
    newLegalName: string,
    file?: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newLegalName", newLegalName);
      if (file) {
        formData.append("file", formatFile(file));
      }
      gstAmendmentApi.uploadAmendmentWithFile(
        `legal-name/record/${id}`,
        formData,
        resolve,
        reject,
        "PUT",
      );
    });
  },

  // ====================================================
  // 2. Principal Place
  // ====================================================
  getExistingPrincipalPlace: (gstId: string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/principal-place/${gstId}/existing`);
  },
  submitPrincipalPlaceAmendment: (
    gstId: string,
    address: string,
    city: string,
    state: string,
    pinCode: string,
    file: any,
    district?: string,
    natureOfPremises?: string,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newBusinessAddress", address);
      formData.append("newCity", city);
      formData.append("newState", state);
      formData.append("newPinCode", pinCode);
      if (district) formData.append("newDistrict", district);
      formData.append("natureOfPremises", mapNatureOfPremises(natureOfPremises));
      formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `principal-place/${gstId}`,
        formData,
        resolve,
        reject,
        "POST",
      );
    });
  },
  getPrincipalPlaceAmendmentById: (id: number | string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/principal-place/record/${id}`);
  },
  updatePrincipalPlaceAmendment: (
    id: number | string,
    address: string,
    city: string,
    state: string,
    pinCode: string,
    file?: any,
    district?: string,
    natureOfPremises?: string,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newBusinessAddress", address);
      formData.append("newCity", city);
      formData.append("newState", state);
      formData.append("newPinCode", pinCode);
      if (district) formData.append("newDistrict", district);
      if (natureOfPremises) formData.append("natureOfPremises", mapNatureOfPremises(natureOfPremises));
      if (file) formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `principal-place/record/${id}`,
        formData,
        resolve,
        reject,
        "PUT",
      );
    });
  },

  // ====================================================
  // 3. Additional Place
  // ====================================================
  getExistingAdditionalPlace: (gstId: string) => {
    return apiClient.get<any[]>(`/api/v1/gst/amendments/additional-place/${gstId}/existing`);
  },
  submitAdditionalPlaceAmendment: (
    gstId: string,
    address: string,
    city: string,
    pinCode: string,
    natureOfPremises: string,
    file: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("city", city);
      formData.append("pinCode", pinCode);
      formData.append("natureOfPremises", mapNatureOfPremises(natureOfPremises));
      formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `additional-place/${gstId}`,
        formData,
        resolve,
        reject,
        "POST",
      );
    });
  },
  getAdditionalPlaceAmendmentById: (id: number | string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/additional-place/record/${id}`);
  },
  updateAdditionalPlaceAmendment: (
    id: number | string,
    address: string,
    city: string,
    pinCode: string,
    natureOfPremises: string,
    file?: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("city", city);
      formData.append("pinCode", pinCode);
      formData.append("natureOfPremises", mapNatureOfPremises(natureOfPremises));
      if (file) formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `additional-place/record/${id}`,
        formData,
        resolve,
        reject,
        "PUT",
      );
    });
  },

  // ====================================================
  // 4. Bank Accounts
  // ====================================================
  getExistingBankAccount: (gstId: string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/bank-account/${gstId}/existing`);
  },
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
      formData.append("newBankName", bankName);
      formData.append("newBankAccountNumber", accountNumber);
      formData.append("newIfscCode", ifscCode);

      let mappedType = "SAVINGS";
      const rawType = (accountType || "").toLowerCase();
      switch (true) {
        case rawType.includes("current"):
          mappedType = "CURRENT";
          break;
        case rawType.includes("cash") || rawType.includes("credit"):
          mappedType = "CASH_CREDIT_OD";
          break;
        default:
          mappedType = "SAVINGS";
          break;
      }

      formData.append("newAccountType", mappedType);
      formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `bank-account/${gstId}`,
        formData,
        resolve,
        reject,
        "POST",
      );
    });
  },
  getBankAccountAmendmentById: (id: number | string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/bank-account/record/${id}`);
  },
  updateBankAccountAmendment: (
    id: number | string,
    bankName: string,
    accountNumber: string,
    ifscCode: string,
    accountType: string,
    file?: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newBankName", bankName);
      formData.append("newBankAccountNumber", accountNumber);
      formData.append("newIfscCode", ifscCode);

      let mappedType = "SAVINGS";
      const rawType = (accountType || "").toLowerCase();
      switch (true) {
        case rawType.includes("current"):
          mappedType = "CURRENT";
          break;
        case rawType.includes("cash") || rawType.includes("credit"):
          mappedType = "CASH_CREDIT_OD";
          break;
        default:
          mappedType = "SAVINGS";
          break;
      }

      formData.append("newAccountType", mappedType);
      if (file) formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `bank-account/record/${id}`,
        formData,
        resolve,
        reject,
        "PUT",
      );
    });
  },

  // ====================================================
  // 5. Contact Details
  // ====================================================
  getExistingContact: (gstId: string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/contact/${gstId}/existing`);
  },
  submitContactAmendment: (
    gstId: string,
    mobileNumber: string,
    email: string,
    file: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newMobileNumber", mobileNumber);
      formData.append("newEmail", email);
      formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `contact/${gstId}`,
        formData,
        resolve,
        reject,
        "POST",
      );
    });
  },
  getContactAmendmentById: (id: number | string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/contact/record/${id}`);
  },
  updateContactAmendment: (
    id: number | string,
    mobileNumber: string,
    email: string,
    file?: any,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newMobileNumber", mobileNumber);
      formData.append("newEmail", email);
      if (file) formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `contact/record/${id}`,
        formData,
        resolve,
        reject,
        "PUT",
      );
    });
  },

  // ====================================================
  // 6. Authorised Signatories
  // ====================================================
  getExistingSignatory: (gstId: string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/signatory/${gstId}/existing`);
  },
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
      formData.append("newSignatoryName", signatoryName);
      formData.append("newSignatoryPan", signatoryPan);

      if (signatoryDob) {
        const separator = signatoryDob.includes("-") ? "-" : "/";
        const parts = signatoryDob.split(separator);
        switch (parts.length) {
          case 3:
            const d = parts[0].padStart(2, "0");
            const m = parts[1].padStart(2, "0");
            const y = parts[2];
            formData.append("newSignatoryDob", `${y}-${m}-${d}`);
            break;
          default:
            formData.append("newSignatoryDob", signatoryDob);
            break;
        }
      }

      if (designation) {
        formData.append("newDesignation", designation);
        formData.append("newSignatoryDesignation", designation);
        formData.append("designation", designation);
      }
      if (signatoryMobile) formData.append("newSignatoryMobile", signatoryMobile);
      if (signatoryEmail) formData.append("newSignatoryEmail", signatoryEmail);

      formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `signatory/${gstId}`,
        formData,
        resolve,
        reject,
        "POST",
      );
    });
  },
  getSignatoryAmendmentById: (id: number | string) => {
    return apiClient.get<any>(`/api/v1/gst/amendments/signatory/record/${id}`);
  },
  updateSignatoryAmendment: (
    id: number | string,
    signatoryName: string,
    signatoryPan: string,
    file?: any,
    signatoryDob?: string,
    designation?: string,
    signatoryMobile?: string,
    signatoryEmail?: string,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("newSignatoryName", signatoryName);
      formData.append("newSignatoryPan", signatoryPan);

      if (signatoryDob) {
        const separator = signatoryDob.includes("-") ? "-" : "/";
        const parts = signatoryDob.split(separator);
        switch (parts.length) {
          case 3:
            const d = parts[0].padStart(2, "0");
            const m = parts[1].padStart(2, "0");
            const y = parts[2];
            formData.append("newSignatoryDob", `${y}-${m}-${d}`);
            break;
          default:
            formData.append("newSignatoryDob", signatoryDob);
            break;
        }
      }

      if (designation) {
        formData.append("newDesignation", designation);
        formData.append("newSignatoryDesignation", designation);
        formData.append("designation", designation);
      }
      if (signatoryMobile) formData.append("newSignatoryMobile", signatoryMobile);
      if (signatoryEmail) formData.append("newSignatoryEmail", signatoryEmail);

      if (file) formData.append("file", formatFile(file));
      gstAmendmentApi.uploadAmendmentWithFile(
        `signatory/record/${id}`,
        formData,
        resolve,
        reject,
        "PUT",
      );
    });
  },

  // ====================================================
  // Unified polymorphic methods using switch case
  // ====================================================
  saveAmendmentRecord: async (
    sectionId: string,
    targetGstId: string,
    formData: any,
    file: any,
  ): Promise<any> => {
    switch (sectionId) {
      case "legal-name":
        return gstAmendmentApi.submitLegalNameAmendment(
          targetGstId,
          formData.newLegalBusinessName,
          file,
        );
      case "principal-place":
        return gstAmendmentApi.submitPrincipalPlaceAmendment(
          targetGstId,
          formData.newPrincipalAddress,
          formData.newPrincipalCity,
          formData.newPrincipalState,
          formData.newPrincipalPincode,
          file,
          formData.newPrincipalDistrict,
          formData.newPrincipalNatureOfPremises,
        );
      case "additional-place":
        return gstAmendmentApi.submitAdditionalPlaceAmendment(
          targetGstId,
          formData.newAdditionalAddress,
          formData.newAdditionalCity,
          formData.newAdditionalPincode,
          formData.newAdditionalNatureOfPremises,
          file,
        );
      case "bank-accounts":
        return gstAmendmentApi.submitBankAccountAmendment(
          targetGstId,
          formData.newBankName,
          formData.newBankAccountNumber,
          formData.newIfscCode,
          formData.newAccountType,
          file,
        );
      case "contact-details":
        return gstAmendmentApi.submitContactAmendment(
          targetGstId,
          formData.newContactMobile,
          formData.newContactEmail,
          file,
        );
      case "authorised-signatories":
        return gstAmendmentApi.submitSignatoryAmendment(
          targetGstId,
          formData.newSignatoryName,
          formData.newSignatoryPan,
          file,
          formData.newSignatoryDob,
          formData.newSignatoryDesignation || formData.newDesignation || formData.designation,
          formData.newSignatoryMobile,
          formData.newSignatoryEmail,
        );
      default:
        throw new Error(`Unsupported amendment section: ${sectionId}`);
    }
  },

  getAmendmentRecordById: async (
    sectionId: string,
    id: number | string,
  ): Promise<any> => {
    switch (sectionId) {
      case "legal-name":
        return gstAmendmentApi.getLegalNameAmendmentById(id);
      case "principal-place":
        return gstAmendmentApi.getPrincipalPlaceAmendmentById(id);
      case "additional-place":
        return gstAmendmentApi.getAdditionalPlaceAmendmentById(id);
      case "bank-accounts":
        return gstAmendmentApi.getBankAccountAmendmentById(id);
      case "contact-details":
        return gstAmendmentApi.getContactAmendmentById(id);
      case "authorised-signatories":
        return gstAmendmentApi.getSignatoryAmendmentById(id);
      default:
        throw new Error(`Unsupported amendment section: ${sectionId}`);
    }
  },

  updateAmendmentRecord: async (
    sectionId: string,
    id: number | string,
    formData: any,
    file?: any,
  ): Promise<any> => {
    switch (sectionId) {
      case "legal-name":
        return gstAmendmentApi.updateLegalNameAmendment(
          id,
          formData.newLegalBusinessName,
          file,
        );
      case "principal-place":
        return gstAmendmentApi.updatePrincipalPlaceAmendment(
          id,
          formData.newPrincipalAddress,
          formData.newPrincipalCity,
          formData.newPrincipalState,
          formData.newPrincipalPincode,
          file,
          formData.newPrincipalDistrict,
          formData.newPrincipalNatureOfPremises,
        );
      case "additional-place":
        return gstAmendmentApi.updateAdditionalPlaceAmendment(
          id,
          formData.newAdditionalAddress,
          formData.newAdditionalCity,
          formData.newAdditionalPincode,
          formData.newAdditionalNatureOfPremises,
          file,
        );
      case "bank-accounts":
        return gstAmendmentApi.updateBankAccountAmendment(
          id,
          formData.newBankName,
          formData.newBankAccountNumber,
          formData.newIfscCode,
          formData.newAccountType,
          file,
        );
      case "contact-details":
        return gstAmendmentApi.updateContactAmendment(
          id,
          formData.newContactMobile,
          formData.newContactEmail,
          file,
        );
      case "authorised-signatories":
        return gstAmendmentApi.updateSignatoryAmendment(
          id,
          formData.newSignatoryName,
          formData.newSignatoryPan,
          file,
          formData.newSignatoryDob,
          formData.newSignatoryDesignation || formData.newDesignation || formData.designation,
          formData.newSignatoryMobile,
          formData.newSignatoryEmail,
        );
      default:
        throw new Error(`Unsupported amendment section: ${sectionId}`);
    }
  },
};
