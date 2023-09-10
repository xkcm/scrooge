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

type CreateTokenResult = {
  token: string;
  expiresIn: number;
};

export interface TokenService {
  extractTokenPayload<T extends Record<PropertyKey, any>>(
    token: string,
  ): T & GenericTokenPayload;

  createGenericToken<T extends JwtPayload>(
    tokenPayload: T,
    additionalClaims?: SignOptions,
    key?: string,
  ): CreateTokenResult;

  decodeGenericToken<T extends JwtPayload = {}>(
    token: string,
    key?: string,
  ): T & GenericTokenPayload;

  createAuthToken(tokenPayload: AuthTokenPayload): CreateTokenResult;

  decodeAuthToken(token: string): AuthTokenPayload & GenericTokenPayload;

  createRefreshToken(tokenPayload: RefreshTokenPayload): CreateTokenResult;

  decodeRefreshToken(token: string): RefreshTokenPayload & GenericTokenPayload;

  createRegistrationToken(
    tokenPayload: RegistrationTokenPayload,
  ): CreateTokenResult;

  decodeRegistrationToken(
    token: string,
  ): RegistrationTokenPayload & GenericTokenPayload;

  createRelogToken(tokenPayload: RelogTokenPayload): CreateTokenResult;

  decodeRelogToken(token: string): RelogTokenPayload & GenericTokenPayload;
}
