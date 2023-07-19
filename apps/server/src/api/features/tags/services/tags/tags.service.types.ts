import { User } from "@prisma/client";

export interface Tag {
  label: string;
  icon: string;
  color: string;
}
export interface TagsService {
  getUserTags(userId: User["id"]): Promise<Tag[]>;

  addUserTags(userId: User["id"], tags: Tag[] | Tag): Promise<Tag[]>;

  deleteUserTag(userId: User["id"], tag: Tag["label"]): Promise<Tag[]>;

  assertUserTags(userId: User["id"], tags: Tag["label"] | Tag["label"][]): Promise<Tag[]>;

  modifyUserTag(userId: User["id"], tagLabel: Tag["label"], tagPayload: Partial<Tag>): Promise<Tag[]>;
}
