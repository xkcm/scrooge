import { User } from "@prisma/client";

export type GetUserInfoResponse = Partial<User>;

export type UserPreferences = Pick<
  User,
  "currency" | "theme" | "locale" | "language"
>;
