import { z } from "zod";

const TagSchema = z.object({
  label: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const AddTagBodySchema = z
  .object({
    tag: TagSchema,
  })
  .strict();

export const DeleteTagQuerySchema = z
  .object({
    tagLabel: z.string(),
  })
  .strict();

export const ModifyTagBodySchema = TagSchema.partial().strict();
export const ModifyTagQuerySchema = DeleteTagQuerySchema;
