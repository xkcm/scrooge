import { UAParser } from "ua-parser-js";

import { Breadcrumb } from "@/features/app/components/Breadcrumbs/AppBreadcrumbs.types";
import { AppDataTableHeaderConfig } from "@scrooge/ui-library";
import { schemas } from "@scrooge/shared";

export const DEVICE_ICONS = {
  desktop: "mdi:monitor",
  mobile: "mdi:cellphone",
  tablet: "mdi:tablet",
};

export const sessionsPageBreadcrumbs: Breadcrumb[] = [
  { caption: "Settings", routeName: "settings" },
  { caption: "Sessions", routeName: "sessions" },
];

export const sessionTableHeaderConfig: AppDataTableHeaderConfig = [
  { caption: "", key: "icon" },
  { caption: "OS", key: "os" },
  { caption: "IP Address", key: "sourceIp" },
  { caption: "Last used at", key: "lastUsed" },
  { caption: "Created at", key: "createdAt" },
  { caption: "Expires at", key: "expiresAt" },
];

export function mapPublicSessionToRowData(
  session: schemas.session.GetSessionsResponse["sessions"][number],
) {
  const uaParser = new UAParser(session.agent ?? "");
  const deviceType = (uaParser.getDevice().type ??
    "desktop") as keyof typeof DEVICE_ICONS;

  return {
    id: session.id,
    os: uaParser.getOS().name || "N/A",
    sourceIp: session.sourceIp || "N/A",
    lastUsed: session.lastUsed,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    deviceIcon: DEVICE_ICONS[deviceType] ?? DEVICE_ICONS.desktop,
  };
}
