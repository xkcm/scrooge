import { Prisma, User } from "@prisma/client";

type RegisterUserPayload = Pick<
  Prisma.UserCreateInput,
  "email" | "password" | "username"
>;

export interface UserService {
  createUser(payload: RegisterUserPayload): Promise<User>;

  findUserByEmail(email: User["email"]): Promise<User>;

  findUserById(
    userId: User["id"],
    select?: Prisma.UserSelect,
  ): Promise<Partial<User>>;

  hashUserPassword(value: string): Promise<string>;

  compareUserPassword(value: string, encrypted: string): Promise<boolean>;
}
