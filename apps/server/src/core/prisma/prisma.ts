import { PrismaClient } from "@prisma/client";

import { env } from "#core/config/env.config.js";

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: env.POSTGRES_URL,
    },
  },
});

export default prismaClient;
