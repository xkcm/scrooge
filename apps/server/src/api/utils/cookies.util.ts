import { ApiResponse } from "#api/api.types.js";

type SupportedCookieKey = "relogToken" | "authToken" | "refreshToken";

export function setCookie(
  res: ApiResponse,
  key: SupportedCookieKey,
  value: string,
  expiresIn: number,
) {
  return res.cookie(key, value, {
    expires: new Date(Date.now() + expiresIn * 1000),
  });
}

export function clearCookie(res: ApiResponse, key: SupportedCookieKey) {
  return res.clearCookie(key);
}
