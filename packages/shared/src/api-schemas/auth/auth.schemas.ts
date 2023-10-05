import { z } from "zod";

export const BeginRegistrationBodySchema = z.object({
  email: z.string().email(),
});

export const RegisterUserBodySchema = z
  .object({
    password: z.string(),
    username: z.string(),
    locale: z.string().optional(),
    currency: z.string().optional(),
    language: z.string().optional(),
    theme: z.string().optional(),
  })
  .strict();

export const RegisterUserQuerySchema = z
  .object({
    registrationToken: z.string(),
  })
  .strict();

export const LoginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();
