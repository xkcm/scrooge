import { z } from "zod";

export const BeginRegistrationSchema = z.object({
  email: z.string().email(),
});

export const RegisterUserSchema = {
  BODY: z.object({
    password: z.string(),
    username: z.string(),
  }).strict(),
  QUERY: z.object({
    registrationToken: z.string(),
  }).strict(),
};

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
}).strict();

export const InvalidateSessionSchema = z.object({
  sessionId: z.string().uuid(),
}).strict();

export const RefreshSchema = z.object({
  refreshToken: z.string(),
}).strict();

export namespace RegisterUser {
  export type BODY = z.infer<typeof RegisterUserSchema["BODY"]>;
  export type QUERY = z.infer<typeof RegisterUserSchema["QUERY"]>;
}
export type BeginRegistrationBody = z.infer<typeof BeginRegistrationSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
export type InvalidateSessionParams = z.infer<typeof InvalidateSessionSchema>;
export type RefreshBody = z.infer<typeof RefreshSchema>;
