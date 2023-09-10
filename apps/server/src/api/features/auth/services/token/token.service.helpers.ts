import {
  InvalidTokenError,
  TokenExpiredError,
} from "./token.service.errors.js";

export function parseTokenVerificationError(error: Error) {
  switch (error.name) {
    case "TokenExpiredError":
      return new TokenExpiredError();
    default:
      return new InvalidTokenError({
        cause: error,
        metadata: {
          attachments: [
            {
              type: "public",
              data: error.message,
            },
          ],
        },
      });
  }
}
