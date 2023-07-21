import { User } from "@prisma/client";
import { schemas } from "@scrooge/shared";

export interface TagsService {
  getUserTags(userId: User["id"]): Promise<schemas.tags.Tag[]>;

  addUserTags(
    userId: User["id"],
    tags: schemas.tags.Tag[] | schemas.tags.Tag,
  ): Promise<schemas.tags.Tag[]>;

  deleteUserTag(
    userId: User["id"],
    tag: schemas.tags.Tag["label"],
  ): Promise<schemas.tags.Tag[]>;

  assertUserTags(
    userId: User["id"],
    tags: schemas.tags.Tag["label"] | schemas.tags.Tag["label"][],
  ): Promise<schemas.tags.Tag[]>;

  modifyUserTag(
    userId: User["id"],
    tagLabel: schemas.tags.Tag["label"],
    tagPayload: Partial<schemas.tags.Tag>,
  ): Promise<schemas.tags.Tag[]>;
}
