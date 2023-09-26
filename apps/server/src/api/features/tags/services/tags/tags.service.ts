import { Prisma } from "@prisma/client";
import { schemas } from "@scrooge/shared";

import serverConfig from "#core/config/server.config.js";
import prismaClient from "#core/prisma/prisma.js";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";
import { UserWithGivenIdNotFoundError } from "#root/api/features/auth/services/user/user.service.errors.js";

import { UndefinedTagError } from "../../tags.errors.js";
import { RawDefinedTags, TagsService } from "./tags.service.types.js";
import {
  findNewTags,
  mergeTags,
  parseDefinedTagsRecord,
  parseTags,
  stringifyTags,
} from "./tags.service.utils.js";

const tagsService: TagsService = {
  async getUserTags(userId) {
    const query = Prisma.sql`
      SELECT jsonb_agg("definedTags") as "definedTags" FROM "User" WHERE id = ${userId}
    `;

    const [result] = await prismaClient
      .$queryRaw<RawDefinedTags[]>(query)
      .catch(
        createPrismaErrorParser({
          P2025: UserWithGivenIdNotFoundError.withMetadata({ userId }),
        }),
      );

    return parseDefinedTagsRecord(result);
  },

  async addUserTags(userId, paramTags) {
    const tags = Array.isArray(paramTags) ? paramTags : [paramTags];
    const userTags = await this.getUserTags(userId);

    const newTags = findNewTags(userTags, tags);
    if (newTags.length === 0) {
      return userTags;
    }
    // @ts-ignore
    const { definedTags: updatedTags } = await prismaClient.user.update({
      where: { id: userId },
      data: {
        // @ts-ignore
        definedTags: {
          push: stringifyTags(newTags),
        },
      },
      // @ts-ignore
      select: { definedTags: true },
    });

    return parseTags(updatedTags);
  },

  async deleteUserTag(userId, tagLabel) {
    const userTags = await this.getUserTags(userId);
    const updatedTags = userTags.filter(
      (userTag) => userTag.label !== tagLabel,
    );

    if (userTags.length === updatedTags.length) {
      return userTags;
    }

    // @ts-ignore
    const { definedTags } = await prismaClient.user.update({
      where: { id: userId },
      data: {
        // @ts-ignore
        definedTags: stringifyTags(updatedTags),
      },
      // @ts-ignore
      select: { definedTags: true },
    });

    return parseTags(definedTags);
  },

  async assertUserTags(userId, paramTags) {
    const tags = Array.isArray(paramTags) ? paramTags : [paramTags];
    const userTags = await this.getUserTags(userId);

    const newTags = findNewTags(
      userTags,
      tags.map((label) => ({ label })),
    );
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

    const newTagsWithDefaults: schemas.tags.Tag[] = newTags.map(
      ({ label }) => ({
        label,
        color: serverConfig.service_configs.tags.default_tag_color,
        icon: serverConfig.service_configs.tags.default_tag_icon,
      }),
    );

    return this.addUserTags(userId, newTagsWithDefaults);
  },

  async modifyUserTag(userId, tagLabel, tagPayload) {
    const userTags = await this.getUserTags(userId);
    const matchingTagIndex = userTags.findIndex(
      (tag) => tag.label === tagLabel,
    );

    if (matchingTagIndex === -1) {
      throw new UndefinedTagError({
        metadata: {
          tags: tagLabel,
        },
      });
    }

    const newTag = mergeTags(userTags[matchingTagIndex], tagPayload);
    userTags.splice(matchingTagIndex, 1, newTag);

    // @ts-ignore
    const { definedTags } = await prismaClient.user.update({
      where: { id: userId },
      data: {
        // @ts-ignore
        definedTags: {
          set: stringifyTags(userTags),
        },
      },
    });
    return parseTags(definedTags);
  },
};

export default tagsService;
