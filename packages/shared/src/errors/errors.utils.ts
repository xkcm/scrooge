import { BetterError } from "@xkcm/better-errors";

export function createErrorRethrower(RethrownError: typeof BetterError) {
  return (originalError: Error) => {
    throw new RethrownError({ cause: originalError });
  };
}
