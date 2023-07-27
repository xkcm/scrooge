import { SessionInputInfo } from "#api:auth/services/session/session.service.types.js";
import { env } from "#core/config/env.config.js";
import { ApiRequest } from "#root/api/api.types.js";
import geolocationService from "#root/api/services/geolocation/geolocation.service.js";

export async function prepareCreateSessionPayload(req: ApiRequest) {
  const createSessionPayload: SessionInputInfo = {
    sourceIp: req.ip,
    agent: req.headers["user-agent"],
  };

  if (env.ENABLE_SESSION_GEOLOCATION) {
    const geolocation = await geolocationService.getGeolocation(
      createSessionPayload.sourceIp,
    );
    if (geolocation !== null) {
      createSessionPayload.geolocation = [geolocation.lat, geolocation.long];
    }
  }

  return createSessionPayload;
}
