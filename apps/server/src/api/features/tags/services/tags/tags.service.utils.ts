import { schemas } from "@scrooge/shared";
import { Tag } from "@scrooge/shared/dist/api-schemas/tags/tags.types.js";

import { RawDefinedTags } from "./tags.service.types.js";

export const parseTags = (rawTags: string[]): Tag[] =>
  rawTags.map((rawTag) => JSON.parse(rawTag));

export const stringifyTags = (tags: Tag[]) =>
  tags.map((tag) => JSON.stringify(tag));

export const findNewTags = <T extends Pick<Tag, "label">>(
  definedTags: T[],
  newTags: T[],
) =>
  newTags.filter(
    (newTag) =>
      definedTags.findIndex(
        (definedTag) => newTag.label === definedTag.label,
      ) === -1,
  );

export const mergeTags = (baseTag: Tag, newTag: Partial<Tag>): Tag => ({
  label: newTag.label || baseTag.label,
  color: newTag.color || baseTag.color,
  icon: newTag.icon || baseTag.icon,
});

export const parseDefinedTagsRecord = (
  rawTags: RawDefinedTags,
): schemas.tags.Tag[] =>
  rawTags.definedTags.flat().map((tag) => ({
    label: tag.label.trim(),
    color: tag.color?.trim() || null,
    icon: tag.icon?.trim() || null,
  }));
