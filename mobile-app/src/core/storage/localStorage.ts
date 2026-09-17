import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

class LocalStorageService {
  private memoryFallback: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      const val = await AsyncStorage.getItem(key);
      if (val !== null) return val;
      return this.memoryFallback.get(key) ?? null;
    } catch {
      return this.memoryFallback.get(key) ?? null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    this.memoryFallback.set(key, value);
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch {
      // Memory fallback is already updated
    }
  }

  async removeItem(key: string): Promise<void> {
    this.memoryFallback.delete(key);
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      // Memory fallback is already updated
    }
  }

  async clear(): Promise<void> {
    this.memoryFallback.clear();
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      } else {
        await AsyncStorage.clear();
      }
    } catch {
      // Memory fallback is already updated
    }
  }
}

export const localStorage = new LocalStorageService();
export default localStorage;
