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
export interface RefreshTokenPayload extends AuthTokenPayload {}
export interface RelogTokenPayload extends AuthTokenPayload {}
export interface RegistrationTokenPayload {
  email: string;
}

export type CreateTokenResult = {
  token: string;
  expiresIn: number;
};

export interface TokenService {
  decodeTokenPayload<T extends Record<PropertyKey, any>>(
    token: string,
  ): T & GenericTokenPayload;

  createGenericToken<T extends JwtPayload>(
    tokenPayload: T,
    additionalClaims?: SignOptions,
    key?: string,
  ): CreateTokenResult;

  verifyGenericToken<T extends JwtPayload = {}>(
    token: string,
    key?: string,
  ): T & GenericTokenPayload;

  createAuthToken(tokenPayload: AuthTokenPayload): CreateTokenResult;

  verifyAuthToken(token: string): AuthTokenPayload & GenericTokenPayload;

  createRefreshToken(tokenPayload: RefreshTokenPayload): CreateTokenResult;

  verifyRefreshToken(token: string): RefreshTokenPayload & GenericTokenPayload;

  createRegistrationToken(
    tokenPayload: RegistrationTokenPayload,
  ): CreateTokenResult;

  verifyRegistrationToken(
    token: string,
  ): RegistrationTokenPayload & GenericTokenPayload;

  createRelogToken(tokenPayload: RelogTokenPayload): CreateTokenResult;

  verifyRelogToken(token: string): RelogTokenPayload & GenericTokenPayload;
}
