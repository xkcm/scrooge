import crypto from "node:crypto";

import bcrypt from "bcrypt";

import serverConfig from "#core/config/server.config.js";
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
    const { email, password, username } = payload;

    return prismaClient.user
      .create({
        data: {
          email,
          password,
          username,
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

  async hashUserPassword(value) {
    const sha256Hash = crypto
      .createHash("sha256")
      .update(value, "ascii")
      .digest("base64");
    const hashRounds = serverConfig.service_configs.user.hash_rounds;
    return bcrypt.hash(sha256Hash, hashRounds);
  },

  async compareUserPassword(value, encrypted) {
    const sha256Hash = crypto
      .createHash("sha256")
      .update(value, "ascii")
      .digest("base64");
    return bcrypt.compare(sha256Hash, encrypted);
  },
};

export default userService;
