import type { JwtPayload, SignOptions } from "jsonwebtoken";

export interface GenericTokenPayload {
  iat: number;
  aud: string;
  sub: string;
}

export interface AuthTokenPayload {
  userId: string;
  sessionId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}

export interface RegistrationTokenPayload {
  email: string;
}

export interface TokenService {
  createGenericToken<T extends JwtPayload>(
    tokenPayload: T,
    additionalClaims?: SignOptions,
    key?: string,
  ): string;

  decodeGenericToken<T extends JwtPayload = {}>(
    token: string,
    key?: string,
  ): T & GenericTokenPayload;

  createAuthToken(tokenPayload: AuthTokenPayload): string;

  decodeAuthToken(token: string): AuthTokenPayload & GenericTokenPayload;

  createRefreshToken(tokenPayload: RefreshTokenPayload): string;

  decodeRefreshToken(token: string): RefreshTokenPayload & GenericTokenPayload;

  createRegistrationToken(tokenPayload: RegistrationTokenPayload): string;

  decodeRegistrationToken(
    token: string,
  ): RegistrationTokenPayload & GenericTokenPayload;
}
