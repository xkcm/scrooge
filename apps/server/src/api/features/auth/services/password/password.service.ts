import crypto from "node:crypto";

import bcrypt from "bcrypt";

import serverConfig from "#core/config/server.config.js";

import { PasswordService } from "./password.service.types.js";

const passwordService: PasswordService = {
  async createHash(value) {
    const sha256Hash = crypto
      .createHash("sha256")
      .update(value, "ascii")
      .digest("base64");
    const hashRounds = serverConfig.service_configs.user.hash_rounds;
    return bcrypt.hash(sha256Hash, hashRounds);
  },

  async compare(value, encrypted) {
    const sha256Hash = crypto
      .createHash("sha256")
      .update(value, "ascii")
      .digest("base64");
    return bcrypt.compare(sha256Hash, encrypted);
  },
};

export default passwordService;
