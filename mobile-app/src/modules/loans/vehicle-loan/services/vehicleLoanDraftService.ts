import AsyncStorage from "@react-native-async-storage/async-storage";
import { VehicleLoanDraftData } from "../types/vehicleLoan.types";

export type { VehicleLoanDraftData };

const VEHICLE_LOAN_DRAFT_KEY = "@taxedge_vehicle_loan_draft_v1";

export const vehicleLoanDraftService = {
  saveDraft: async (draft: VehicleLoanDraftData): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        VEHICLE_LOAN_DRAFT_KEY,
        JSON.stringify({ ...draft, savedAt: new Date().toISOString() })
      );
    } catch {
      // Ignore storage errors
    }
  },

  loadDraft: async (): Promise<VehicleLoanDraftData | null> => {
    try {
      const raw = await AsyncStorage.getItem(VEHICLE_LOAN_DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as VehicleLoanDraftData;
    } catch {
      return null;
    }
  },

  clearDraft: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(VEHICLE_LOAN_DRAFT_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  hasDraft: async (): Promise<boolean> => {
    try {
      const raw = await AsyncStorage.getItem(VEHICLE_LOAN_DRAFT_KEY);
      return Boolean(raw);
    } catch {
      return false;
    }
  },
};
