import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LoanDraftStorageKey } from "../constants/loanDraftKeys";

/** A draft as persisted: the screen's data plus the time it was saved. */
export type StoredLoanDraft<TDraft extends object> = TDraft & { savedAt: string };

export interface LoanDraftStorage<TDraft extends object> {
  saveDraft: (draft: TDraft) => Promise<void>;
  loadDraft: () => Promise<StoredLoanDraft<TDraft> | null>;
  clearDraft: () => Promise<void>;
  hasDraft: () => Promise<boolean>;
}

/**
 * Same read/write behaviour as `homeLoanDraftService` and `vehicleLoanDraftService`:
 * JSON of `{ ...draft, savedAt }` under a fixed key, storage errors swallowed.
 */
export function createLoanDraftStorage<TDraft extends object>(
  storageKey: LoanDraftStorageKey
): LoanDraftStorage<TDraft> {
  return {
    saveDraft: async (draft) => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify({ ...draft, savedAt: new Date().toISOString() }));
      } catch {
        // Ignore storage errors
      }
    },

    loadDraft: async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!raw) return null;
        // Trust boundary: the stored JSON was written by `saveDraft` for this key.
        const draft: StoredLoanDraft<TDraft> = JSON.parse(raw);
        return draft;
      } catch {
        return null;
      }
    },

    clearDraft: async () => {
      try {
        await AsyncStorage.removeItem(storageKey);
      } catch {
        // Ignore storage errors
      }
    },

    hasDraft: async () => {
      try {
        return Boolean(await AsyncStorage.getItem(storageKey));
      } catch {
        return false;
      }
    },
  };
}
