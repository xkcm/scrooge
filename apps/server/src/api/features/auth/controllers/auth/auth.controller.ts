import { schemas } from "@scrooge/shared";

import { clearCookie, setCookie } from "#api/utils/cookies.util.js";
import { AuthLocals } from "#api:auth/middleware/token/token.middleware.types.js";
import passwordService from "#api:auth/services/password/password.service.js";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";
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

import { prepareCreateSessionPayload } from "./auth.controller.helpers.js";

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
      currency: req.body.currency,
      language: req.body.language,
      locale: req.body.locale,
      theme: req.body.theme,
    });

    const newReq = req as unknown as ApiRequest<schemas.auth.LoginBody>;
    newReq.body = {
      email: decodedToken.email,
      password: req.body.password,
    };

    return this.logIn(newReq, res, next);
  },

  async logOut(req, res: ApiResponse<schemas.auth.GetAuthStateResponse>) {
    clearCookie(res, "authToken");
    clearCookie(res, "refreshToken");

    res.json({ isAuthenticated: false });
  },

  async logIn(
    req: ApiRequest<schemas.auth.LoginBody>,
    res: ApiResponse<schemas.auth.LoginResponse>,
  ) {
    const user = await userService.findUserByEmail(req.body.email).catch(
      createPrismaErrorParser({
        P2025: LoginAttemptFailedError,
      }),
    );

    const passwordMatches = await passwordService.compare(
      req.body.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new LoginAttemptFailedError();
    }

    const { relogToken } = req.cookies ?? {};
    let sessionId: string = "";

    if (relogToken) {
      try {
        const relogPayload = tokenService.decodeRelogToken(relogToken);
        sessionId = relogPayload.sessionId;
        clearCookie(res, "relogToken");
      } catch {
        // too bad, new session is created
      }
    }

    if (!sessionId) {
      const createSessionPayload = await prepareCreateSessionPayload(req);
      const session = await sessionService.createSession(
        user.id,
        createSessionPayload,
      );
      sessionId = session.id;
    }

    const tokenPayload = {
      userId: user.id,
      sessionId,
    };
    const authResult = tokenService.createAuthToken(tokenPayload);
    const refreshResult = tokenService.createRefreshToken(tokenPayload);

    setCookie(res, "authToken", authResult.token, authResult.expiresIn);
    setCookie(
      res,
      "refreshToken",
      refreshResult.token,
      refreshResult.expiresIn,
    );

    const preferences = await userService.getPreferences(user.id);

    return res.json({
      isAuthenticated: true,
      preferences,
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

    const preferences = await userService.getPreferences(
      res.locals.auth.userId,
    );

    return res.json({
      isAuthenticated: true,
      preferences,
    });
  },
} satisfies ApiControllerObject);

export default authController;
