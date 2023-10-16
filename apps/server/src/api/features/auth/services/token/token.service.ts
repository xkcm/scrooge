import jwt from "jsonwebtoken";

import { env } from "#core/config/env.config.js";
import serverConfig from "#core/config/server.config.js";

import { parseTokenVerificationError } from "./token.service.helpers.js";
import { TokenService } from "./token.service.types.js";

const tokenService: TokenService = {
  createGenericToken(
    tokenPayload,
    additionalClaims = {},
    key = env.AUTH_TOKEN_SECRET,
  ) {
    const expiresIn = additionalClaims.expiresIn
      ? +additionalClaims.expiresIn
      : serverConfig.service_configs.token.expire_time;
    const token = jwt.sign(tokenPayload, key, {
      issuer: env.SERVER_APP_NAME,
      audience: env.SERVER_APP_NAME,
      ...additionalClaims,
    });

    return { token, expiresIn };
  },

  decodeTokenPayload<T>(token: string) {
    return jwt.decode(token) as T;
  },

  verifyGenericToken(token, key = env.AUTH_TOKEN_SECRET) {
    try {
      return jwt.verify(token, key, {
        audience: env.SERVER_APP_NAME,
        issuer: env.SERVER_APP_NAME,
      }) as any;
    } catch (error) {
      throw parseTokenVerificationError(error as Error);
    }
  },

  createAuthToken(tokenPayload) {
    return this.createGenericToken(tokenPayload, {
      expiresIn: serverConfig.service_configs.token.expire_time,
      subject: tokenPayload.userId,
    });
  },

  verifyAuthToken(token) {
    return this.verifyGenericToken(token);
  },

  createRefreshToken(tokenPayload) {
    return this.createGenericToken(
      tokenPayload,
      {
        expiresIn: serverConfig.service_configs.token.refresh_expire_time,
        subject: tokenPayload.userId,
      },
      env.REFRESH_TOKEN_SECRET,
    );
  },

  verifyRefreshToken(token) {
    return this.verifyGenericToken(token, env.REFRESH_TOKEN_SECRET);
  },

  createRegistrationToken(tokenPayload) {
    return this.createGenericToken(
      tokenPayload,
      {
        expiresIn: serverConfig.service_configs.token.registration_expire_time,
      },
      env.REGISTRATION_TOKEN_SECRET,
    );
  },

  verifyRegistrationToken(token) {
    return this.verifyGenericToken(token, env.REGISTRATION_TOKEN_SECRET);
  },

  createRelogToken(tokenPayload) {
    return this.createGenericToken(
      tokenPayload,
      {
        expiresIn: serverConfig.service_configs.token.relog_expire_time,
      },
      env.RELOG_TOKEN_SECRET,
    );
  },

  verifyRelogToken(token) {
    return this.verifyGenericToken(token, env.RELOG_TOKEN_SECRET);
  },
};

export default tokenService;
