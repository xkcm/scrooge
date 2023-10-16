export const buildOpenStreetMapsLink = (coordinates: number[]) =>
  `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    coordinates.join(","),
  )}`;
