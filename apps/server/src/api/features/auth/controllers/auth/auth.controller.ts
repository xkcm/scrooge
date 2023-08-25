import { schemas } from "@scrooge/shared";

import { AuthLocals } from "#api:auth/middleware/token/token.middleware.types.js";
import passwordService from "#api:auth/services/password/password.service.js";
import { env } from "#core/config/env.config.js";
import {
  ApiControllerObject,
  ApiRequest,
  ApiResponse,
} from "#root/api/api.types.js";
import { LoginAttemptFailedError } from "#root/api/features/auth/auth.errors.js";
import sessionService from "#root/api/features/auth/services/session/session.service.js";
import tokenService from "#root/api/features/auth/services/token/token.service.js";
import userService from "#root/api/features/auth/services/user/user.service.js";
import mailService from "#root/api/services/mail/mail.service.js";
import { bindObjectMethods } from "#root/core/utils/utils.js";

import { prepareCreateSessionPayload } from "./auth.controller.utils.js";

const authController = bindObjectMethods({
  async beginRegistration(
    req: ApiRequest<schemas.auth.BeginRegistrationBody>,
    res: ApiResponse<schemas.auth.BeginRegistrationResponse>,
  ) {
    const { email } = req.body;
    const { token } = tokenService.createGenericToken({ email });

    const sendMailResult = await mailService.sendConfirmRegistrationMail(
      email,
      token,
    );

    res.json(sendMailResult);
  },

  async register(
    req: ApiRequest<
      schemas.auth.RegisterUserBody,
      {},
      schemas.auth.RegisterUserQuery
    >,
    res: ApiResponse<schemas.auth.RegisterUserResponse>,
    next,
  ) {
    const decodedToken = tokenService.decodeGenericToken<{ email: string }>(
      req.query.registrationToken,
    );

    const password = await passwordService.createHash(req.body.password);
    await userService.createUser({
      password,
      email: decodedToken.email,
      username: req.body.username,
    });

    const newReq = req as unknown as ApiRequest<schemas.auth.LoginBody>;
    newReq.body = {
      email: decodedToken.email,
      password: req.body.password,
    };

    return this.logIn(newReq, res, next);
  },

  async logOut(req, res: ApiResponse<schemas.auth.GetAuthStateResponse>) {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");

    res.json({ isAuthenticated: false });
  },

  async logIn(
    req: ApiRequest<schemas.auth.LoginBody>,
    res: ApiResponse<schemas.auth.LoginResponse>,
  ) {
    const user = await userService
      .findUserByEmail(req.body.email)
      .catch((error) => {
        if (error?.cause?.code === "P2025") {
          throw new LoginAttemptFailedError();
        }
        throw error;
      });

    const passwordMatches = await passwordService.compare(
      req.body.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new LoginAttemptFailedError();
    }

    const createSessionPayload = await prepareCreateSessionPayload(req);
    const session = await sessionService.createSession(
      user.id,
      createSessionPayload,
    );

    const tokenPayload = {
      userId: user.id,
      sessionId: session.id,
    };
    const { token: authToken, expiresIn: authTokenExpiresIn } =
      tokenService.createAuthToken(tokenPayload);
    const { token: refreshToken, expiresIn: refreshTokenExpiresIn } =
      tokenService.createRefreshToken(tokenPayload);

    res.cookie("authToken", authToken, {
      httpOnly: true,
      domain: env.BACKEND_DOMAIN,
      expires: new Date(Date.now() + authTokenExpiresIn * 1000),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      domain: env.BACKEND_DOMAIN,
      expires: new Date(Date.now() + refreshTokenExpiresIn * 1000),
    });

    return res.json({
      isAuthTokenSet: true,
      isRefreshTokenSet: true,
    });
  },

  async refresh(
    req: ApiRequest<schemas.auth.RefreshBody>,
    res: ApiResponse<schemas.auth.RefreshResponse>,
  ) {
    // todo: refactor refresh flow
    const refreshToken = req.cookies?.refreshToken;

    const { userId, sessionId } = tokenService.decodeRefreshToken(refreshToken);
    await sessionService.verifySessionById(userId, sessionId);

    const authToken = tokenService.createAuthToken({
      userId,
      sessionId,
    });

    res.cookie("authToken", authToken, {
      httpOnly: true,
      domain: env.BACKEND_DOMAIN,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      domain: env.BACKEND_DOMAIN,
    });

    return res.json({
      isAuthTokenSet: true,
      isRefreshTokenSet: true,
    });
  },

  async getAuthState(
    req,
    res: ApiResponse<schemas.auth.GetAuthStateResponse, AuthLocals<"safe">>,
  ) {
    if (!res.locals.auth.isAuthenticated) {
      return res.status(401).json({
        isAuthenticated: false,
        error: res.locals.auth.error.toApiResponse(),
      });
    }

    return res.json({ isAuthenticated: true });
  },
} satisfies ApiControllerObject);

export default authController;
