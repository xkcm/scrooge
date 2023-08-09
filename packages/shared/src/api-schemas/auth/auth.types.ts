import { z } from "zod";

import type { ApiErrorResponseBody } from "../../index.js";
import {
  BeginRegistrationBodySchema,
  LoginBodySchema,
  RefreshBodySchema,
  RegisterUserBodySchema,
  RegisterUserQuerySchema,
} from "./auth.schemas.js";

// Request types
export type RegisterUserBody = z.infer<typeof RegisterUserBodySchema>;
export type RegisterUserQuery = z.infer<typeof RegisterUserQuerySchema>;

export type BeginRegistrationBody = z.infer<typeof BeginRegistrationBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;
export type RefreshBody = z.infer<typeof RefreshBodySchema>;

// Response types
export type BeginRegistrationResponse = {
  mailSent: boolean;
};
export type LoginResponse = {
  isAuthTokenSet: boolean;
  isRefreshTokenSet: boolean;
};
export type RegisterUserResponse = LoginResponse;
export type RefreshResponse = LoginResponse;
export type GetAuthStateResponse =
  | {
      isAuthenticated: true;
    }
  | {
      isAuthenticated: false;
      error?: ApiErrorResponseBody;
    };
