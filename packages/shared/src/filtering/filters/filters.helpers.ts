import { z } from "zod";

export const FilterRangeSchema = z.object(
  {
    from: z.number(),
    to: z.number(),
    includeFrom: z.boolean().optional(),
    includeTo: z.boolean().optional(),
  },
  {
    description: "type=range",
  },
);

export const FilterStringSchema = z.string({
  description: "type=string",
});

export const FilterNumberSchema = z.number({
  description: "type=number",
});

export const FilterEnumSchema = {
  create: (...args: Parameters<(typeof z)["enum"]>) =>
    z.enum(args[0], {
      ...args[1],
      description: "type=string",
    }),
};
