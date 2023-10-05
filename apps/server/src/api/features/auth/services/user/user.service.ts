import prismaClient from "#core/prisma/prisma.js";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";

import {
  UserExistsError,
  UserWithEmailNotFoundError,
  UserWithGivenIdNotFoundError,
} from "./user.service.errors.js";
import { UserService } from "./user.service.types.js";

const userService: UserService = {
  async createUser(payload) {
    const { email, password, username, currency, language, locale, theme } =
      payload;

    return prismaClient.user
      .create({
        data: {
          email,
          password,
          username,
          currency,
          language,
          locale,
          theme,
        },
      })
      .catch(
        createPrismaErrorParser({
          P2002: UserExistsError.withMetadata({ email }),
        }),
      );
  },

  async findUserByEmail(email) {
    return prismaClient.user
      .findFirstOrThrow({
        where: { email },
      })
      .catch(
        createPrismaErrorParser({
          P2025: UserWithEmailNotFoundError.withMetadata({ email }),
        }),
      );
  },

  async findUserById(
    userId,
    select = { email: true, username: true, id: true },
  ) {
    return prismaClient.user
      .findFirstOrThrow({
        where: { id: userId },
        select,
      })
      .catch(
        createPrismaErrorParser({
          P2025: UserWithGivenIdNotFoundError.withMetadata({ userId }),
        }),
      );
  },

  getPreferences(userId) {
    return prismaClient.user
      .findFirstOrThrow({
        where: { id: userId },
        select: {
          currency: true,
          language: true,
          locale: true,
          theme: true,
        },
      })
      .catch(
        createPrismaErrorParser({
          P2025: UserWithGivenIdNotFoundError.withMetadata({ userId }),
        }),
      );
  },
};

export default userService;
