import { ApiError } from "@scrooge/shared";
import { withCode, withMessage, withMetadata } from "@xkcm/better-errors";

@withMessage("User with id %{metadata.userId} does not exist")
@withCode("api.user.user_with_given_id_not_found")
@withMetadata({ httpCode: 401 })
export class UserWithGivenIdNotFoundError extends ApiError<{ userId?: string }> {}

@withMessage("User with email '%{metadata.email}' was not found")
@withCode("api.user.user_not_found")
@withMetadata({ httpCode: 404 })
export class UserWithEmailNotFoundError extends ApiError<{ email?: string }> {}

@withMessage("User with email '%{metadata.email}' already exists")
@withCode("api.user.user_exists")
@withMetadata({ httpCode: 403 })
export class UserExistsError extends ApiError<{ email?: string }> {}
