import { bindObjectMethods } from "#core/utils/index.js";
import {
  ApiControllerObject,
  ApiRequest,
  ApiResponse,
} from "#root/api/api.types.js";

import sessionService from "#root/api/features/auth/services/session/session.service.js";
import tokenService from "#root/api/features/auth/services/token/token.service.js";
import userService from "#root/api/features/auth/services/user/user.service.js";
import mailService from "#root/api/services/mail/mail.service.js";

import { LoginAttemptFailedError } from "#root/api/features/auth/auth.errors.js";
import {
  BeginRegistrationBody,
  LoginBody,
  RefreshBody,
  RegisterUser,
} from "#root/api/features/auth/auth.schemas.js";

import { AuthLocals } from "#api:auth/middleware/token/token.middleware.types.js";
import { env } from "#core/config/env.config.js";
import { prepareCreateSessionPayload } from "./auth.controller.utils.js";

const authController = bindObjectMethods({

  async beginRegistration(req: ApiRequest<BeginRegistrationBody>, res: ApiResponse) {
    const { email } = req.body;
    const token = tokenService.createGenericToken({ email });

    const isSent = await mailService.sendConfirmRegistrationMail(email, token);

    res.json({ mailSent: isSent });
  },

  async register(
    req: ApiRequest<RegisterUser.BODY, {}, RegisterUser.QUERY>,
    res: ApiResponse,
    next,
  ) {
    const decodedToken = tokenService.decodeGenericToken<{ email: string }>(
      req.query.registrationToken,
    );

    const password = await userService.hashUserPassword(req.body.password);
    await userService.createUser({
      password,
      email: decodedToken.email,
      username: req.body.username,
    });

    const newReq = (req as unknown) as ApiRequest<LoginBody>;
    newReq.body = {
      email: decodedToken.email,
      password: req.body.password,
    };

    return this.login(newReq, res, next);
  },

  async login(req: ApiRequest<LoginBody>, res) {
    const user = await userService.findUserByEmail(req.body.email).catch((error) => {
      if (error?.cause?.code === "P2025") {
        throw new LoginAttemptFailedError();
      }
      throw error;
    });

    const passwordMatches = await userService.compareUserPassword(req.body.password, user.password);
    if (!passwordMatches) {
      throw new LoginAttemptFailedError();
    }

    const createSessionPayload = await prepareCreateSessionPayload(req);
    const session = await sessionService.createSession(user.id, createSessionPayload);

    const tokenPayload = {
      userId: user.id,
      sessionId: session.id,
    };
    const authToken = tokenService.createAuthToken(tokenPayload);
    const refreshToken = tokenService.createRefreshToken(tokenPayload);

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

  async refresh(req: ApiRequest<RefreshBody>, res) {
    // todo: refactor refresh flow
    const refreshToken = req.cookies?.refreshToken;

    const { userId, sessionId } = tokenService.decodeRefreshToken(refreshToken);
    await sessionService.verifySessionById(userId, sessionId);

    const authToken = tokenService.createAuthToken({
      userId,
      sessionId,
    });

    res.json({ authToken, refreshToken });
  },

  async getAuthState(req, res: ApiResponse<AuthLocals<"safe">>) {
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
