import {
  BetterError,
  withCode,
  withMessage,
  withMetadata,
} from "@xkcm/better-errors";

import { env } from "#core/config/env.config.js";

@withCode("core.server.failed_database_check")
@withMessage("Failed to check connection with the database")
export class FailedDatabaseCheckError extends BetterError {}

@withCode("core.server.port_already_in_use")
@withMessage("Cannot start an HTTP server, port is already in use")
export class PortAlreadyInUseError extends BetterError {}

@withCode("core.server.http_server_not_running")
@withMessage("HTTP Server is not running")
export class HttpServerNotRunningError extends BetterError {}

@withCode("core.server.express_is_not_initialized")
@withMessage("Express instance has not been yet initialized")
export class ExpressIsNotInitializedError extends BetterError {}

@withCode("core.server.database_unavailable")
@withMessage("Failed to connect to %{metadata.databaseName} database")
@withMetadata({ databaseName: env.DATABASE_NAME })
export class DatabaseUnavailableError extends BetterError<{ databaseName?: string }> {}

@withCode("core.server.redis_unavailable")
@withMessage("Failed to connect to Redis")
export class RedisUnavailableError extends BetterError {}
