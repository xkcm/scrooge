import ipAddr from "ipaddr.js";

import { env } from "#core/config/env.config.js";

import { UnsupportedGeolocationServiceError } from "./geolocation.service.errors.js";
import ipstackGeolocationService from "./services/ipstack.geolocation.service.js";

const SUPPORTED_GEOLOCATION_SERVICES = {
  ipstack: ipstackGeolocationService,
};

export const getGeolocationService = () => {
  if (!env.GEOLOCATION_SERVICE) {
    throw new UnsupportedGeolocationServiceError({
      metadata: {
        geolocationService: "undefined",
        supportedGeolocationServices: Object.keys(SUPPORTED_GEOLOCATION_SERVICES).join(", "),
      },
    });
  }

  const definedGeolocationService = SUPPORTED_GEOLOCATION_SERVICES[env.GEOLOCATION_SERVICE];

  if (!definedGeolocationService) {
    throw new UnsupportedGeolocationServiceError({
      metadata: {
        geolocationService: env.GEOLOCATION_SERVICE,
        supportedGeolocationServices: Object.keys(SUPPORTED_GEOLOCATION_SERVICES).join(", "),
      },
    });
  }

  return definedGeolocationService;
};

export const isIpLocal = (ip: string) => ipAddr.parse(ip).range() === "private";
