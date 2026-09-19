import { secureStorage } from "../storage/secureStorage";
import {
  createCustomerJwt,
  isJwtExpired,
  extractSubFromJwt,
  CustomerTokenPayload,
} from "./jwtTokenHelper";
import { authStorage } from "../../modules/authentication/services/authStorage";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

class TokenManager {
  private static ACCESS_TOKEN_KEY = "auth_access_token";
  private static REFRESH_TOKEN_KEY = "auth_refresh_token";

  async getAccessToken(): Promise<string | null> {
    const existing = await secureStorage.getItem(TokenManager.ACCESS_TOKEN_KEY);

    // If an existing token is present and not expired, return it
    if (existing && !isJwtExpired(existing)) {
      // Also verify if the token matches current active user
      const currentUser = authStorage.getUser();
      const currentCustId = currentUser?.customerId;
      if (currentCustId) {
        const tokenCustId = extractSubFromJwt(existing);
        if (tokenCustId === currentCustId) {
          return existing;
        }
      } else {
        return existing;
      }
    }

    // Attempt automatic generation/renewal for active authenticated session
    const activeUser = authStorage.getUser();
    if (activeUser && activeUser.customerId) {
      try {
        const freshToken = await this.generateTokenForCustomer({
          customerId: activeUser.customerId,
          name: activeUser.name,
          mobileNumber: activeUser.mobileNumber,
        });
        return freshToken;
      } catch (err) {
        console.warn("[TokenManager] Failed to auto-generate token:", err);
      }
    }

    return existing && !isJwtExpired(existing) ? existing : null;
  }

  async setAccessToken(token: string): Promise<void> {
    await secureStorage.setItem(TokenManager.ACCESS_TOKEN_KEY, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return secureStorage.getItem(TokenManager.REFRESH_TOKEN_KEY);
  }

  async setRefreshToken(token: string): Promise<void> {
    await secureStorage.setItem(TokenManager.REFRESH_TOKEN_KEY, token);
  }

  async clearTokens(): Promise<void> {
    await secureStorage.removeItem(TokenManager.ACCESS_TOKEN_KEY);
    await secureStorage.removeItem(TokenManager.REFRESH_TOKEN_KEY);
  }

  async hasValidToken(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token && !isJwtExpired(token);
  }

  async generateTokenForCustomer(customer: CustomerTokenPayload): Promise<string> {
    const token = await createCustomerJwt(customer);
    await this.setAccessToken(token);
    return token;
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;
