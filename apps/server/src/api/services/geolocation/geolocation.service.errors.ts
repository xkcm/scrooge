import { BetterError, withCode, withMessage } from "@xkcm/better-errors";

@withMessage(
  "Geolocation service '%{metadata.geolocationService}' is not supported. List of supported geolocation services: %{metadata.supportedGeolocationServices}",
)
@withCode("api.services.geolocation.unsupported_geolocation_service")
export class UnsupportedGeolocationServiceError extends BetterError<{
  geolocationService: string;
  supportedGeolocationServices: string;
}> {}

@withMessage("IP_STACK_API_KEY is required in the environment file")
@withCode("api.services.geolocation.ip_stack_api_key_undefined")
export class IpStackApiKeyUndefinedError extends BetterError {}
