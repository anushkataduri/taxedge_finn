import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_PREFIX = "@taxedge_draft_project_finance_";

export const getDraftKey = (mobile?: string): string => {
  const cleanMobile = mobile ? String(mobile).replace(/\D/g, "") : "guest";
  return `${DRAFT_PREFIX}${cleanMobile}`;
};

export const saveProjectFinanceDraft = async (
  mobile: string | undefined,
  data: Record<string, unknown>
): Promise<void> => {
  try {
    const key = getDraftKey(mobile);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to persist Project Finance draft:", error);
  }
};

export const loadProjectFinanceDraft = async (
  mobile: string | undefined
): Promise<Record<string, unknown> | null> => {
  try {
    const key = getDraftKey(mobile);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Failed to load Project Finance draft:", error);
    return null;
  }
};

export const clearProjectFinanceDraft = async (
  mobile: string | undefined
): Promise<void> => {
  try {
    const key = getDraftKey(mobile);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn("Failed to clear Project Finance draft:", error);
  }
};
