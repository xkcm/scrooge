import { ApiControllerObject, ApiResponse } from "#root/api/api.types.js";
import { AuthLocals } from "#root/api/features/auth/middleware/token/token.middleware.types.js";
import userService from "#root/api/features/auth/services/user/user.service.js";

export const userController = {
  async getUserInfo(req, res: ApiResponse<AuthLocals>) {
    const { userId } = res.locals.auth;
    const foundUser = await userService.findUserById(userId);

    return res.json(foundUser);
  },
} satisfies ApiControllerObject;

export default userController;
