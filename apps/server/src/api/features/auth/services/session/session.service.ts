import serverConfig from "#core/config/server.config.js";
import prismaClient from "#core/prisma/prisma.js";
import { createPrismaErrorParser } from "#core/prisma/prisma.utils.js";

import sessionRedisService from "../session-redis/session-redis.service.js";
import {
  CantInvalidateSessionError,
  InvalidSessionError,
  NoPermissionsToRefreshSessionError,
  SessionNotRefreshableError,
} from "./session.service.errors.js";
import { SessionService } from "./session.service.types.js";
import { isSessionInvalid } from "./session.service.utils.js";

const sessionService: SessionService = {
  async createSession(userId, sessionInfo) {
    const createdAt = Date.now();
    const expiresAt =
      createdAt + serverConfig.service_configs.session.expire_time;

    const createdSession = await prismaClient.session
      .create({
        data: {
          createdAt: new Date(createdAt),
          expiresAt: new Date(expiresAt),
          refreshable: serverConfig.service_configs.session.refreshable,
          userId,
          ...sessionInfo,
        },
      })
      .catch(createPrismaErrorParser());
    await sessionRedisService.saveSessionInfo(
      createdSession.id,
      "last_used",
      Date.now(),
    );

    return createdSession;
  },

  async getSessionsByUserId(userId) {
    const foundSessions = await prismaClient.session
      .findMany({
        where: { userId },
        select: {
          id: true,
          createdAt: true,
          expiresAt: true,
          sourceIp: true,
          agent: true,
          geolocation: true,
          refreshable: true,
        },
      })
      .catch(createPrismaErrorParser());

    const sessionsWithRedisInfo = await Promise.all(
      foundSessions.map(async (session) => ({
        ...(await sessionRedisService.getAllSessionInfo(session.id)),
        ...session,
      })),
    );

    return sessionsWithRedisInfo;
  },

  getSessionById(sessionId) {
    return prismaClient.session
      .findFirstOrThrow({
        where: { id: sessionId },
      })
      .catch(
        createPrismaErrorParser({
          P2025: InvalidSessionError,
        }),
      );
  },

  async invalidateSession(userId, sessionId) {
    await sessionRedisService.removeAllSessionInfo(sessionId);

    const { count } = await prismaClient.session
      .deleteMany({
        where: {
          userId,
          id: sessionId,
        },
      })
      .catch(
        createPrismaErrorParser({
          default: CantInvalidateSessionError.withMetadata({ sessionId }),
        }),
      );

    if (count === 0) {
      throw new CantInvalidateSessionError({
        metadata: { sessionId },
      });
    }

    return {
      count,
      invalidated: true,
    };
  },

  async refreshSession(userId, sessionId) {
    const session = await this.getSessionById(sessionId);

    if (isSessionInvalid(session)) {
      await this.invalidateSession(userId, sessionId).catch(() => {});
      throw new InvalidSessionError();
    }
    if (session.userId !== userId) {
      throw new NoPermissionsToRefreshSessionError();
    }
    if (!session.refreshable) {
      throw new SessionNotRefreshableError();
    }

    const expiresAt =
      Date.now() + serverConfig.service_configs.session.expire_time;
    const updatedSession = await prismaClient.session.update({
      where: { id: sessionId },
      data: {
        expiresAt: new Date(expiresAt),
      },
    });

    return updatedSession;
  },

  async verifySessionById(userId, sessionId) {
    const session = await this.getSessionById(sessionId);

    if (isSessionInvalid(session)) {
      await this.invalidateSession(userId, sessionId);
      throw new InvalidSessionError();
    }

    return true;
  },
};

export default sessionService;
