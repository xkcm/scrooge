import { z } from "zod";

import {
  AddTagBodySchema,
  DeleteTagQuerySchema,
  ModifyTagBodySchema,
  ModifyTagQuerySchema,
} from "./tags.schemas.js";

export type AddTagBody = z.infer<typeof AddTagBodySchema>;
export type DeleteTagQuery = z.infer<typeof DeleteTagQuerySchema>;
export type ModifyTagQuery = z.infer<typeof ModifyTagQuerySchema>;
export type ModifyTagBody = z.infer<typeof ModifyTagBodySchema>;

export interface Tag {
  label: string;
  icon: string | null;
  color: string | null;
}
export type GetTagsResponse = {
  tags: Tag[];
};
export type AddTagResponse = GetTagsResponse;
export type DeleteTagResponse = GetTagsResponse;
export type ModifyTagResponse = GetTagsResponse;
