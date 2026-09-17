import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiError } from "./apiError";
import { InterceptorManager } from "./interceptors";

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeoutMs?: number;
}

export const STORAGE_KEY_SERVER_URL = "@taxedge_server_url";

export function getDefaultBaseUrl(): string {
  // 1. Highest priority: environment-driven URL for production/staging
  if (process.env.EXPO_PUBLIC_API_URL && process.env.EXPO_PUBLIC_API_URL.trim() !== "") {
    return process.env.EXPO_PUBLIC_API_URL.trim();
  }

  // 2. Development fallbacks only
  if (__DEV__) {
    if (Platform.OS === "web") {
      return "http://localhost:8088";
    }

    try {
      const hostUri =
        Constants.expoConfig?.hostUri ||
        (Constants as any).manifest?.debuggerHost ||
        (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

      if (hostUri) {
        const ip = hostUri.split(":")[0];
        if (ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
          return `http://${ip}:8088`;
        }
      }
    } catch {}

    return "http://localhost:8088";
  }

  return "";
}

export class ApiClient {
  private baseUrl: string;
  public interceptors: InterceptorManager;

  constructor(baseUrl: string = getDefaultBaseUrl()) {
    this.baseUrl = baseUrl;
    this.interceptors = new InterceptorManager();
    if (__DEV__) {
      this.loadCustomBaseUrl();
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string): void {
    let clean = url.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    if (clean.endsWith("/")) {
      clean = clean.slice(0, -1);
    }
    this.baseUrl = clean;
  }

  async loadCustomBaseUrl(): Promise<string> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY_SERVER_URL);
      if (saved && saved.trim()) {
        this.setBaseUrl(saved.trim());
      }
    } catch {}
    return this.baseUrl;
  }

  async saveCustomBaseUrl(url: string): Promise<string> {
    this.setBaseUrl(url);
    await AsyncStorage.setItem(STORAGE_KEY_SERVER_URL, this.baseUrl);
    return this.baseUrl;
  }

  async resetCustomBaseUrl(): Promise<string> {
    this.baseUrl = getDefaultBaseUrl();
    await AsyncStorage.removeItem(STORAGE_KEY_SERVER_URL);
    return this.baseUrl;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    const fullUrl = path.startsWith("http")
      ? path
      : `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    if (!params || Object.keys(params).length === 0) {
      return fullUrl;
    }
    const query = Object.entries(params)
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      )
      .join("&");
    return fullUrl.includes("?")
      ? `${fullUrl}&${query}`
      : `${fullUrl}?${query}`;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  async patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("PATCH", path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    try {
      const initialUrl = this.buildUrl(path, options?.params);
      const initialHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      };

      const interceptedConfig = await this.interceptors.runRequestInterceptors({
        url: initialUrl,
        headers: initialHeaders,
        method,
      });

      if (__DEV__) {
        console.log(`🌐 [API] ${interceptedConfig.method} ${interceptedConfig.url}`);
      }

      const controller = new AbortController();
      const timeoutMs = options?.timeoutMs || 10000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      let response: Response;
      try {
        response = await fetch(interceptedConfig.url, {
          method: interceptedConfig.method,
          headers: interceptedConfig.headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (__DEV__) {
        console.log(
          `🌐 [API] Response status: ${response.status} for ${interceptedConfig.url}`,
        );
      }

      if (!response.ok) {
        let errorData: any = {};
        try {
          const errText = await response.text();
          try {
            errorData = JSON.parse(errText);
          } catch {
            errorData = { message: errText || response.statusText };
          }
        } catch {
          errorData = { message: response.statusText };
        }
        const message =
          errorData.message ||
          errorData.error ||
          response.statusText ||
          "Request failed";
        throw new ApiError(
          message,
          response.status,
          errorData.code || "API_ERROR",
          errorData.errors,
        );
      }

      const rawText = await response.text();
      let responseData: any;
      try {
        responseData = JSON.parse(rawText);
      } catch {
        // Plain text response from backend (e.g. "OTP sent successfully")
        responseData = rawText;
      }
      return await this.interceptors.runResponseInterceptors<T>(responseData);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      let errMessage = (error as any)?.message || "Request failed";
      if (
        errMessage.includes("canceled") ||
        errMessage.includes("aborted") ||
        errMessage.includes("Network request failed") ||
        errMessage.includes("fetch failed")
      ) {
        errMessage = "Unable to connect to server. Please check your internet connection.";
      }
      return this.interceptors.runErrorInterceptors(
        new ApiError(errMessage, 500, "NETWORK_ERROR"),
      );
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
