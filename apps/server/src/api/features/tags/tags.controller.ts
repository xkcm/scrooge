import {
  ApiControllerObject,
  ApiRequest,
  ApiResponse,
} from "#root/api/api.types.js";
import { AuthLocals } from "#root/api/features/auth/middleware/token/token.middleware.types.js";

import tagsService from "./services/tags/tags.service.js";

import {
  AddTagBody,
  DeleteTagQuery,
  ModifyTag,
} from "./tags.schemas.js";

export const tagsController = {
  async getTags(req, res: ApiResponse<AuthLocals>) {
    const { userId } = res.locals.auth;

    const tags = await tagsService.getUserTags(userId);
    res.json({ tags });
  },

  async addTag(req: ApiRequest<AddTagBody>, res: ApiResponse<AuthLocals>) {
    const { userId } = res.locals.auth;
    const { tag } = req.body;

    const updatedTags = await tagsService.addUserTags(userId, tag);
    res.json({ tags: updatedTags });
  },

  async deleteTag(
    req: ApiRequest<{}, {}, DeleteTagQuery>,
    res: ApiResponse<AuthLocals>,
  ) {
    const { userId } = res.locals.auth;
    const { tagLabel } = req.query;

    const updatedTags = await tagsService.deleteUserTag(userId, tagLabel);
    res.json({ tags: updatedTags });
  },

  async modifyTag(
    req: ApiRequest<ModifyTag.BODY, {}, ModifyTag.QUERY>,
    res: ApiResponse<AuthLocals>,
  ) {
    const { userId } = res.locals.auth;
    const { tagLabel } = req.query;
    const payload = req.body;

    const updatedTags = await tagsService.modifyUserTag(userId, tagLabel, payload);
    res.json({ tags: updatedTags });
  },
} satisfies ApiControllerObject;

export default tagsController;
