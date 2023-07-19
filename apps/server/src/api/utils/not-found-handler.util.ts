import { EndpointNotFoundError } from "#api/errors/request.errors.js";
import { ApiHandler } from "#root/api/api.types.js";

export const ENDPOINT_NOT_FOUND_HANDLER: ApiHandler = (req, res, next) => {
  next(new EndpointNotFoundError({ metadata: { endpoint: req.url } }));
};
