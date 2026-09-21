import { create } from "zustand";
import { localStorage } from "../../core/storage/localStorage";

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "@taxedge_theme_mode";

export interface ThemeStoreState {
  theme: ThemeMode;
  isDark: boolean;
  isHydrated: boolean;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  // The app ALWAYS launches in Light Mode by default, ignoring the device theme.
  theme: "light",
  isDark: false,
  isHydrated: false,

  setTheme: async (newTheme: ThemeMode) => {
    if (newTheme !== "light" && newTheme !== "dark") return;
    set({ theme: newTheme, isDark: newTheme === "dark" });
    try {
      await localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (err) {
      console.warn("Failed to persist theme preference:", err);
    }
  },

  toggleTheme: async () => {
    const current = get().theme;
    const next: ThemeMode = current === "dark" ? "light" : "dark";
    await get().setTheme(next);
  },

  initializeTheme: async () => {
    try {
      const saved = await localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark") {
        set({ theme: "dark", isDark: true, isHydrated: true });
      } else {
        // If no preference exists or saved as light, keep Light Mode.
        set({ theme: "light", isDark: false, isHydrated: true });
      }
    } catch (err) {
      // In case of error, default to light mode
      set({ theme: "light", isDark: false, isHydrated: true });
    }
  },
}));

// Initialize theme immediately on import so it begins hydration early
useThemeStore.getState().initializeTheme().catch(() => {});

export default useThemeStore;
