import { UAParser } from "ua-parser-js";

import { schemas } from "@scrooge/shared";
import { AppDataTableHeaderConfig } from "@scrooge/ui-library";

import { Breadcrumb } from "@/features/app/components/Breadcrumbs/AppBreadcrumbs.types";

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
  { caption: "", key: "deviceIcon" },
  { caption: "OS", key: "os" },
  { caption: "IP Address", key: "sourceIp" },
  { caption: "Last used at", key: "lastUsed" },
  { caption: "Created at", key: "createdAt" },
  { caption: "Expires at", key: "expiresAt" },
  { caption: "", key: "activeSessionIndicator" },
  { caption: "", key: "contextMenuTrigger" },
];

export function mapPublicSessionToRowData(
  session: schemas.session.GetSessionsResponse["sessions"][number],
) {
  const uaParser = new UAParser(session.agent ?? "");
  const deviceType = (uaParser.getDevice().type ??
    "desktop") as keyof typeof DEVICE_ICONS;

  return {
    ...session,
    os: uaParser.getOS().name || "N/A",
    sourceIp: session.sourceIp || "N/A",
    deviceIcon: DEVICE_ICONS[deviceType] ?? DEVICE_ICONS.desktop,
  };
}
