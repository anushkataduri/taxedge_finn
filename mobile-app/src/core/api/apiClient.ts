import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiError } from "./apiError";
import { InterceptorManager } from "./interceptors";
import { tokenManager } from "../authentication/tokenManager";

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeoutMs?: number;
}

/**
 * Server Network Configuration
 * Change IP and Port here to point the mobile app to your backend.
 */
export const SERVER_IP = "192.168.88.69";

export const SERVER_PORT = 8086;

export const STORAGE_KEY_SERVER_URL = "@taxedge_server_url";

export function getDefaultBaseUrl(): string {
  // 1. Highest priority: environment-driven URL for production/staging/EAS build
  if (
    process.env.EXPO_PUBLIC_API_URL &&
    process.env.EXPO_PUBLIC_API_URL.trim() !== ""
  ) {
    return process.env.EXPO_PUBLIC_API_URL.trim();
  }

  // 2. Default target: Explicitly configured SERVER_IP and SERVER_PORT
  const ip = SERVER_IP as string;
  if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
    return `http://${ip}:${SERVER_PORT}`;
  }

  // 3. Web fallback
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location?.hostname) {
      const host = window.location.hostname;
      if (host && host !== "localhost" && host !== "127.0.0.1") {
        return `http://${host}:${SERVER_PORT}`;
      }
    }
    return `http://${SERVER_IP}:${SERVER_PORT}`;
  }

  // 4. Default fallback
  return `http://${SERVER_IP}:${SERVER_PORT}`;
}

export class ApiClient {
  private baseUrl: string;
  private baseUrlLoaded = false;
  public interceptors: InterceptorManager;
  /** Prevents concurrent 401s from triggering multiple /auth/refresh calls */
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseUrl: string = getDefaultBaseUrl()) {
    this.baseUrl = baseUrl || `http://${SERVER_IP}:${SERVER_PORT}`;
    this.interceptors = new InterceptorManager();
    this.loadCustomBaseUrl().catch(() => {});
  }

  getBaseUrl(): string {
    if (!this.baseUrl || this.baseUrl.trim() === "") {
      this.baseUrl = getDefaultBaseUrl();
    }
    return this.baseUrl;
  }

  setBaseUrl(url: string): void {
    let clean = url.trim();
    // Automatically correct accidental entry of Expo bundler port (8081) to backend port (8088)
    if (clean.includes(":8081")) {
      clean = clean.replace(":8081", `:${SERVER_PORT}`);
    }
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    if (clean.endsWith("/")) {
      clean = clean.slice(0, -1);
    }
    this.baseUrl = clean;
  }

  async ensureBaseUrlLoaded(): Promise<string> {
    if (this.baseUrlLoaded && this.baseUrl && this.baseUrl.trim() !== "") {
      return this.baseUrl;
    }
    await this.loadCustomBaseUrl();
    if (!this.baseUrl || this.baseUrl.trim() === "") {
      this.baseUrl = getDefaultBaseUrl();
    }
    this.baseUrlLoaded = true;
    return this.baseUrl;
  }

  async loadCustomBaseUrl(): Promise<string> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY_SERVER_URL);
      if (saved && saved.trim()) {
        let clean = saved.trim();
        if (clean.includes(":8081")) {
          clean = clean.replace(":8081", `:${SERVER_PORT}`);
          await AsyncStorage.setItem(STORAGE_KEY_SERVER_URL, clean);
        }
        this.setBaseUrl(clean);
      }
    } catch {}
    this.baseUrlLoaded = true;
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
    let base = this.baseUrl;
    if (!base || base.trim() === "") {
      base = getDefaultBaseUrl();
      if (!base || base.trim() === "") {
        base = `http://${SERVER_IP}:${SERVER_PORT}`;
      }
      this.baseUrl = base;
    }

    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    const fullUrl =
      path.startsWith("http://") || path.startsWith("https://")
        ? path
        : `${cleanBase}${cleanPath}`;

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

  /**
   * Silently refreshes the access token using the stored refresh token.
   * Shared promise prevents concurrent 401s from firing multiple refresh calls.
   * Returns the new access token, or null if refresh failed (user must re-login).
   */
  private async tryRefreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async (): Promise<string | null> => {
      try {
        const refreshToken = await tokenManager.getRefreshToken();
        if (!refreshToken) {
          return null;
        }

        const refreshUrl = this.buildUrl("/auth/refresh");
        const response = await fetch(refreshUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          // Refresh token is also expired — clear everything so login screen shows
          await tokenManager.clearTokens();
          return null;
        }

        const data = await response.json();
        const newAccessToken: string = data.accessToken;
        const newRefreshToken: string | undefined = data.refreshToken;

        if (!newAccessToken) {
          await tokenManager.clearTokens();
          return null;
        }

        await tokenManager.setAccessToken(newAccessToken);
        if (newRefreshToken) {
          await tokenManager.setRefreshToken(newRefreshToken);
        }

        console.log("🔄 [ApiClient] Access token refreshed successfully.");
        return newAccessToken;
      } catch {
        await tokenManager.clearTokens();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
    isRetry = false,
  ): Promise<T> {
    try {
      await this.ensureBaseUrlLoaded();
      const initialUrl = this.buildUrl(path, options?.params);
      const initialHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
      };

      if (body instanceof FormData) {
        delete initialHeaders["Content-Type"];
      }

      try {
        const token = await tokenManager.getAccessToken();
        if (token && !initialHeaders["Authorization"]) {
          initialHeaders["Authorization"] = `Bearer ${token}`;
        }
      } catch {}

      const interceptedConfig = await this.interceptors.runRequestInterceptors({
        url: initialUrl,
        headers: initialHeaders,
        method,
      });

      if (__DEV__) {
        console.log(
          `🌐 [API] ${interceptedConfig.method} ${interceptedConfig.url}`,
        );
      }

      const controller = new AbortController();
      const timeoutMs = options?.timeoutMs || 30000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      let response: Response;
      try {
        let fetchBody: any = undefined;
        if (body) {
          fetchBody = body instanceof FormData ? body : JSON.stringify(body);
        }

        response = await fetch(interceptedConfig.url, {
          method: interceptedConfig.method,
          headers: interceptedConfig.headers,
          body: fetchBody,
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

      // ── Auto token-refresh on 401 ──────────────────────────────────────────
      // Only attempt once (isRetry guard) and never on the refresh endpoint itself
      if (response.status === 401 && !isRetry && !path.includes("/auth/refresh")) {
        const newToken = await this.tryRefreshToken();
        if (newToken) {
          // Retry the original request with the fresh access token
          return this.request<T>(method, path, body, options, true);
        }
        // Refresh also failed — session is dead
        throw new ApiError(
          "Session expired. Please log in again.",
          401,
          "SESSION_EXPIRED",
        );
      }
      // ──────────────────────────────────────────────────────────────────────

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
        errMessage =
          "Unable to connect to server. Please check your internet connection.";
      }
      return this.interceptors.runErrorInterceptors(
        new ApiError(errMessage, 500, "NETWORK_ERROR"),
      );
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
