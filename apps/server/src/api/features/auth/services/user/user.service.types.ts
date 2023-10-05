import { Prisma, User } from "@prisma/client";
import { schemas } from "@scrooge/shared";

type RegisterUserPayload = Omit<
  Prisma.UserCreateInput,
  "id" | "operations" | "sessions" | "definedTags"
>;

export interface UserService {
  createUser(payload: RegisterUserPayload): Promise<User>;

  findUserByEmail(email: User["email"]): Promise<User>;

  findUserById(
    userId: User["id"],
    select?: Prisma.UserSelect,
  ): Promise<Partial<User>>;

  getPreferences(userId: User["id"]): Promise<schemas.user.UserPreferences>;
}
