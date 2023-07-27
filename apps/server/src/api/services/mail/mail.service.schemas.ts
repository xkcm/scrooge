import { z } from "zod";

export const ConfigSchema = z.object({
  mailConfigurations: z.record(
    z.string(),
    z.object({
      templateFile: z.string(),
      subject: z.string(),
    }),
  ),
});
