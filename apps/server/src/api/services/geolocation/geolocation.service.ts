import {
  getGeolocationService,
  isIpLocal,
} from "./geolocation.service.utils.js";

const geolocationService = {
  async getGeolocation(
    ipAddress?: string,
  ): Promise<{ lat: number; long: number } | null> {
    if (!ipAddress || isIpLocal(ipAddress)) {
      return null;
    }

    return getGeolocationService().getGeolocation(ipAddress);
  },
};

export default geolocationService;
