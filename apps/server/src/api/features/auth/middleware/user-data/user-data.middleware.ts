import { ApiHandler } from "#root/api/api.types.js";
import { UserWithGivenIdNotFoundError } from "#root/api/features/auth/services/user/user.service.errors.js";
import userService from "#root/api/features/auth/services/user/user.service.js";
import { wrapMiddlewareWithSafeVariant } from "#root/api/utils/middleware.utils.js";

const userDataMiddlewareHandler: ApiHandler = async (req, res, next) => {
  const { userId } = res.locals.auth.token.payload;
  const foundUser = await userService.findUserById(userId);
  if (!foundUser) {
    throw new UserWithGivenIdNotFoundError({
      metadata: { userId },
    });
  }

  res.locals.user = {
    data: foundUser,
  };
  return next();
};

const userDataMiddleware = wrapMiddlewareWithSafeVariant({
  strictHandler: userDataMiddlewareHandler,
  errorCallback: (req, res, next, error) => {
    res.locals.user = { error };
  },
});

export default userDataMiddleware;
