import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SERVER_IP = "192.168.88.25";
export const SERVER_PORT = 8086;
export const STORAGE_KEY_SERVER_URL = "@taxedge_server_url";

export function getDefaultBaseUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  if (Platform.OS === "web") {
    const host = typeof window !== "undefined" ? window.location?.hostname : "";
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:${SERVER_PORT}`;
    }
    return "";
  }

  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any).manifest?.debuggerHost ||
      (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
    const ip = hostUri?.split(":")[0];
    if (ip && /^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
      return `http://${ip}:${SERVER_PORT}`;
    }
  } catch {}

  return `http://${SERVER_IP}:${SERVER_PORT}`;
}

export async function getActiveBaseUrl(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY_SERVER_URL);
    if (saved && saved.trim()) {
      let clean = saved.trim().replace(/\/$/, "");
      if (clean.includes(":8081")) {
        clean = clean.replace(":8081", `:${SERVER_PORT}`);
      }
      return clean;
    }
  } catch {}

  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  return getDefaultBaseUrl().replace(/\/$/, "");
}