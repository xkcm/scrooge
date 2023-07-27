import { schemas } from "@scrooge/shared";

import {
  ApiControllerObject,
  ApiRequest,
  ApiResponse,
} from "#api/api.types.js";
import { AuthLocals } from "#api:auth/middleware/token/token.middleware.types.js";

import tagsService from "./services/tags/tags.service.js";

export const tagsController = {
  async getTags(
    req,
    res: ApiResponse<schemas.tags.GetTagsResponse, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;

    const tags = await tagsService.getUserTags(userId);
    res.json({ tags });
  },

  async addTag(
    req: ApiRequest<schemas.tags.AddTagBody>,
    res: ApiResponse<schemas.tags.AddTagResponse, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;
    const { tag } = req.body;

    const updatedTags = await tagsService.addUserTags(userId, tag);
    res.json({ tags: updatedTags });
  },

  async deleteTag(
    req: ApiRequest<{}, {}, schemas.tags.DeleteTagQuery>,
    res: ApiResponse<schemas.tags.DeleteTagResponse, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;
    const { tagLabel } = req.query;

    const updatedTags = await tagsService.deleteUserTag(userId, tagLabel);
    res.json({ tags: updatedTags });
  },

  async modifyTag(
    req: ApiRequest<
      schemas.tags.ModifyTagBody,
      {},
      schemas.tags.ModifyTagQuery
    >,
    res: ApiResponse<schemas.tags.ModifyTagResponse, AuthLocals>,
  ) {
    const { userId } = res.locals.auth;
    const { tagLabel } = req.query;
    const payload = req.body;

    const updatedTags = await tagsService.modifyUserTag(
      userId,
      tagLabel,
      payload,
    );
    res.json({ tags: updatedTags });
  },
} satisfies ApiControllerObject;

export default tagsController;
