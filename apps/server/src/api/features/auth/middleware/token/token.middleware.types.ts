import { User } from "@prisma/client";
import type { ApiError } from "@scrooge/shared";

import { AuthTokenPayload } from "../../services/token/token.service.types.js";

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
