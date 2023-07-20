import serverConfig from "#core/config/server.config.js";
import prismaClient from "#core/prisma/prisma.js";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";
import { UserWithGivenIdNotFoundError } from "#root/api/features/auth/services/user/user.service.errors.js";

import { UndefinedTagError } from "../../tags.errors.js";
import { Tag, TagsService } from "./tags.service.types.js";
import {
  findNewTags,
  mergeTags,
  parseTags,
  stringifyTags,
} from "./tags.service.utils.js";

const tagsService: TagsService = {
  async getUserTags(userId) {
    const { definedTags } = await prismaClient.user.findFirstOrThrow({
      where: { id: userId },
      select: { definedTags: true },
    }).catch(createPrismaErrorParser({
      P2025: UserWithGivenIdNotFoundError.withMetadata({ userId }),
    }));

    return parseTags(definedTags);
  },

  async addUserTags(userId, paramTags) {
    const tags = Array.isArray(paramTags) ? paramTags : [paramTags];
    const userTags = await this.getUserTags(userId);

    const newTags = findNewTags(userTags, tags);
    if (newTags.length === 0) {
      return userTags;
    }

    const { definedTags: updatedTags } = await prismaClient.user.update({
      where: { id: userId },
      data: {
        definedTags: {
          push: stringifyTags(newTags),
        },
      },
      select: { definedTags: true },
    });

    return parseTags(updatedTags);
  },

  async deleteUserTag(userId, tagLabel) {
    const userTags = await this.getUserTags(userId);
    const updatedTags = userTags.filter((userTag) => userTag.label !== tagLabel);

    if (userTags.length === updatedTags.length) {
      return userTags;
    }

    const { definedTags } = await prismaClient.user.update({
      where: { id: userId },
      data: {
        definedTags: stringifyTags(updatedTags),
      },
      select: { definedTags: true },
    });

    return parseTags(definedTags);
  },

  async assertUserTags(userId, paramTags) {
    const tags = Array.isArray(paramTags) ? paramTags : [paramTags];
    const userTags = await this.getUserTags(userId);

    const newTags = findNewTags(userTags, tags.map((label) => ({ label })));
    if (newTags.length === 0) {
      return userTags;
    }

    if (!serverConfig.service_configs.tags.create_undefined) {
      throw new UndefinedTagError({
        metadata: {
          tags: tags.map((tag) => JSON.stringify(tag)).join(", "),
        },
      });
    }

    const newTagsWithDefaults: Tag[] = newTags.map(({ label }) => ({
      label,
      color: serverConfig.service_configs.tags.default_tag_color,
      icon: serverConfig.service_configs.tags.default_tag_icon,
    }));

    return this.addUserTags(userId, newTagsWithDefaults);
  },

  async modifyUserTag(userId, tagLabel, tagPayload) {
    const userTags = await this.getUserTags(userId);
    const matchingTagIndex = userTags.findIndex((tag) => tag.label === tagLabel);

    if (matchingTagIndex === -1) {
      throw new UndefinedTagError({
        metadata: {
          tags: tagLabel,
        },
      });
    }

    const newTag = mergeTags(userTags[matchingTagIndex], tagPayload);
    userTags.splice(matchingTagIndex, 1, newTag);

    const { definedTags } = await prismaClient.user.update({
      where: { id: userId },
      data: {
        definedTags: {
          set: stringifyTags(userTags),
        },
      },
    });
    return parseTags(definedTags);
  },
};

export default tagsService;
