import { User } from "@prisma/client";
import { AuthTokenPayload } from "../../services/token/token.service.types.js";
import type { ApiError } from "#shared/errors/ApiError.class.js";

type AuthenticatedLocals = {
  token: {
    raw: string;
    payload: AuthTokenPayload;
  };
  isAuthenticated: true;
  userId: User["id"];
};

export type AuthLocals<TokenValidationMode extends "safe" | "strict" = "strict"> = {
  auth: TokenValidationMode extends "strict"
    ? AuthenticatedLocals
    : (AuthenticatedLocals | {
      error: ApiError;
      isAuthenticated: false;
    });
};

export type UserDataLocals = {
  user: { data: User } | { error: any };
};
