import axios from "axios";
import { env } from "#core/config/env.config.js";
import { IpStackApiKeyUndefinedError } from "../geolocation.service.errors.js";
import { IpStackResponseData } from "./ipstack.geolocation.service.types.js";

const ipstackGeolocationService = {
  async getGeolocation(ipAddress: string): Promise<{ lat: number; long: number; } | null> {
    if (!env.IP_STACK_API_KEY) {
      throw new IpStackApiKeyUndefinedError();
    }

    const { data } = await axios<IpStackResponseData>({
      baseURL: "http://api.ipstack.com",
      url: ipAddress,
      params: {
        access_key: env.IP_STACK_API_KEY,
      },
    });

    if (data.latitude === null || data.longitude === null) {
      return null;
    }

    return {
      lat: data.latitude,
      long: data.longitude,
    };
  },
};

export default ipstackGeolocationService;
