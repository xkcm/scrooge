import { z } from "zod";

export const AddTagSchema = z.object({
  tag: z.object({
    label: z.string(),
    icon: z.string(),
    color: z.string(),
  }),
}).strict();

export const DeleteTagSchema = z.object({
  tagLabel: z.string(),
}).strict();

export const ModifyTagSchema = {
  BODY: AddTagSchema.shape.tag.partial().strict(),
  QUERY: DeleteTagSchema,
};

export type AddTagBody = z.infer<typeof AddTagSchema>;
export type DeleteTagQuery = z.infer<typeof DeleteTagSchema>;
export namespace ModifyTag {
  export type QUERY = z.infer<typeof ModifyTagSchema["QUERY"]>;
  export type BODY = z.infer<typeof ModifyTagSchema["BODY"]>;
}
