import { z } from "zod";
import { NumericStringSchema } from "#core/utils/schemas.utils.js";

const SEMANTIC_VERSION_REGEX = /(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?/gm;

export const EnvModeSchema = z.enum(["production", "development", "testing"]);

export const EnvConfigSchema = z.object({
  APP_NAME: z.string(),
  SERVER_APP_NAME: z.string(),
  PORT: NumericStringSchema,
  DATABASE_NAME: z.string(),
  FRONTEND_URL: z.string().url(),
  BACKEND_DOMAIN: z.string(),

  AUTH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REGISTRATION_TOKEN_SECRET: z.string(),

  POSTGRES_URL: z.string(),
  REDIS_URL: z.string(),

  ENABLE_SESSION_GEOLOCATION: z.enum(["true", "false"]).transform((v) => v === "true"),
  GEOLOCATION_SERVICE: z.enum(["ipstack"]),
  IP_STACK_API_KEY: z.string().optional(),

  MAIL_USER: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: NumericStringSchema,
  MAIL_FROM: z.string(),
}).strict();

export const ServerConfigSchema = z.object({
  version: z.string().regex(SEMANTIC_VERSION_REGEX, "Property Version in config.yml is not a valid Semantic Version string"),
  service_configs: z.object({
    session: z.object({
      expire_time: z.number(),
      refreshable: z.boolean(),
    }),
    token: z.object({
      expire_time: z.union([
        z.number(),
        z.string(),
      ]),
      registration_expire_time: z.number(),
    }),
    tags: z.object({
      create_undefined: z.boolean(),
      default_tag_icon: z.string(),
      default_tag_color: z.string(),
    }),
    user: z.object({
      hash_rounds: z.number(),
    }),
  }),
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>;
export type EnvConfig = z.infer<typeof EnvConfigSchema>;
export type EnvMode = z.infer<typeof EnvModeSchema>;
