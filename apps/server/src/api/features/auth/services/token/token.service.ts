import jwt from "jsonwebtoken";

import { env } from "#core/config/env.config.js";
import serverConfig from "#core/config/server.config.js";

import { InvalidTokenError } from "./token.service.errors.js";
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

  decodeGenericToken(token, key = env.AUTH_TOKEN_SECRET) {
    try {
      return jwt.verify(token, key, {
        audience: env.SERVER_APP_NAME,
        issuer: env.SERVER_APP_NAME,
      }) as any;
    } catch (error) {
      throw new InvalidTokenError({
        cause: error as Error,
        metadata: {
          attachments: [
            {
              type: "public",
              data: (error as Error).message,
            },
          ],
        },
      });
    }
  },

  createAuthToken(tokenPayload) {
    return this.createGenericToken(tokenPayload, {
      subject: tokenPayload.userId,
      expiresIn: serverConfig.service_configs.token.expire_time,
    });
  },

  decodeAuthToken(token) {
    return this.decodeGenericToken(token);
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

  decodeRefreshToken(token) {
    return this.decodeGenericToken(token, env.REFRESH_TOKEN_SECRET);
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

  decodeRegistrationToken(token) {
    return this.decodeGenericToken(token, env.REGISTRATION_TOKEN_SECRET);
  },
};

export default tokenService;
