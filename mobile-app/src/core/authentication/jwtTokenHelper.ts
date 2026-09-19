/**
 * JWT Token Helper for TaxEdge Mobile Client
 * Generates and validates JWT tokens matching the Spring Boot backend contract.
 *
 * Backend Contract:
 * - Secret: 7fK9mQ2xV8pL4zR6tY13sH8jA0eB6uI9oP2vX4kG7nM5qZ1rT8
 * - Algorithm: HMAC-SHA384 (Keys.hmacShaKeyFor with 432-bit key)
 * - Claims: sub (custId), name, mobileNumber, iat, exp (1 hour)
 */

export const JWT_SECRET = "7fK9mQ2xV8pL4zR6tY13sH8jA0eB6uI9oP2vX4kG7nM5qZ1rT8";
const TOKEN_EXPIRY_SECONDS = 3600; // 1 hour

declare const Buffer: any;
declare const require: any;

function base64UrlEncode(strOrBytes: string | Uint8Array): string {
  let base64 = "";
  if (typeof strOrBytes === "string") {
    if (typeof btoa !== "undefined") {
      base64 = btoa(unescape(encodeURIComponent(strOrBytes)));
    } else if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(strOrBytes, "utf-8").toString("base64");
    } else {
      const bytes = new TextEncoder().encode(strOrBytes);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64 = btoa(binary);
    }
  } else {
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(strOrBytes).toString("base64");
    } else {
      let binary = "";
      for (let i = 0; i < strOrBytes.length; i++) {
        binary += String.fromCharCode(strOrBytes[i]);
      }
      base64 = btoa(binary);
    }
  }
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  if (typeof atob !== "undefined") {
    return decodeURIComponent(escape(atob(base64)));
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
  return "";
}

export interface CustomerTokenPayload {
  customerId: string;
  name?: string;
  mobileNumber?: string;
}

export async function createCustomerJwt(customer: CustomerTokenPayload): Promise<string> {
  const header = { alg: "HS384", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: customer.customerId,
    name: customer.name || "Customer",
    mobileNumber: (customer.mobileNumber || "").replace(/\D/g, ""),
    iat: now,
    exp: now + TOKEN_EXPIRY_SECONDS,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${headerB64}.${payloadB64}`;

  // Use Web Crypto API (supported across Hermes, React Native 0.76+, Expo, Browsers, Node)
  const subtle =
    typeof globalThis !== "undefined" && globalThis.crypto?.subtle
      ? globalThis.crypto.subtle
      : typeof crypto !== "undefined" && (crypto as any).subtle
        ? (crypto as any).subtle
        : null;

  if (subtle) {
    const enc = new TextEncoder();
    const key = await subtle.importKey(
      "raw",
      enc.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-384" },
      false,
      ["sign"],
    );
    const sigBuffer = await subtle.sign("HMAC", key, enc.encode(dataToSign));
    const sigB64 = base64UrlEncode(new Uint8Array(sigBuffer));
    return `${dataToSign}.${sigB64}`;
  }

  // Fallback for Node test environments if subtle not directly on globalThis
  try {
    const nodeCrypto = require("crypto");
    const sig = nodeCrypto
      .createHmac("sha384", JWT_SECRET)
      .update(dataToSign)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    return `${dataToSign}.${sig}`;
  } catch {
    throw new Error("No cryptographic subsystem available for JWT signing.");
  }
}

export function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson);
    if (!payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    // Buffer by 30 seconds to prevent edge-of-expiry failures
    return payload.exp <= now + 30;
  } catch {
    return true;
  }
}

export function extractSubFromJwt(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson);
    return payload.sub || null;
  } catch {
    return null;
  }
}
