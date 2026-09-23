import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DevUser } from "../types/auth.types";

const KEY_USERS = "taxEdgeDevUsersMap";
const KEY_SESSION = "taxEdgeDevSession";
const memory: Record<string, string> = {};

// Eagerly pre-populate in-memory cache from AsyncStorage on app launch
AsyncStorage.getItem(KEY_SESSION).then((val) => {
  if (val) memory[KEY_SESSION] = val;
}).catch(() => {});

AsyncStorage.getItem(KEY_USERS).then((val) => {
  if (val) memory[KEY_USERS] = val;
}).catch(() => {});

const get = (k: string) => {
  if (memory[k]) return memory[k];
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(k);
    }
  } catch {}
  return null;
};

const set = (k: string, v: string) => {
  memory[k] = v;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(k, v);
    }
  } catch {}
  AsyncStorage.setItem(k, v).catch(() => {});
};

const del = (k: string) => {
  delete memory[k];
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(k);
    }
  } catch {}
  AsyncStorage.removeItem(k).catch(() => {});
};

export const authStorage = {
  initAsync: async (): Promise<void> => {
    try {
      const [session, users] = await Promise.all([
        AsyncStorage.getItem(KEY_SESSION),
        AsyncStorage.getItem(KEY_USERS),
      ]);
      if (session) memory[KEY_SESSION] = session;
      if (users) memory[KEY_USERS] = users;
    } catch {}
  },
  getUsersMap: (): Record<string, DevUser> => {
    try {
      return JSON.parse(get(KEY_USERS) || "{}");
    } catch {
      return {};
    }
  },
  getUserByMobile: (mobile: string): DevUser | null =>
    authStorage.getUsersMap()[mobile.replace(/\D/g, "")] || null,
  getUser: (): DevUser | null => {
    const s = authStorage.getSession();
    return s.activeMobile ? authStorage.getUserByMobile(s.activeMobile) : null;
  },
  saveUser: (user: DevUser) => {
    const cleanMobile = user.mobileNumber.replace(/\D/g, "");
    const map = authStorage.getUsersMap();
    const existing = map[cleanMobile] || {};
    const regCompleted =
      typeof user.registrationCompleted === "boolean"
        ? user.registrationCompleted
        : Boolean(existing.registrationCompleted);
    map[cleanMobile] = {
      ...existing,
      ...user,
      mobileNumber: cleanMobile,
      registrationCompleted: regCompleted,
    };
    set(KEY_USERS, JSON.stringify(map));
  },
  getSession: () => {
    try {
      return JSON.parse(get(KEY_SESSION) || '{"isLoggedIn":false,"activeMobile":null}');
    } catch {
      return { isLoggedIn: false, activeMobile: null, lastLoginAt: null };
    }
  },
  saveSession: (s: any) => set(KEY_SESSION, JSON.stringify(s)),
  clearSession: () =>
    set(KEY_SESSION, JSON.stringify({ isLoggedIn: false, activeMobile: null, lastLoginAt: null })),
  clearAllAuthData: () => {
    del(KEY_USERS);
    del(KEY_SESSION);
    del("taxEdgeDevUser");
  },
};

export default authStorage;
