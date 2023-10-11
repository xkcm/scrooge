import { UAParser } from "ua-parser-js";
import { Router } from "vue-router";

import { schemas } from "@scrooge/shared";
import { AppDataTableHeaderConfig, ContextMenuItem } from "@scrooge/ui-library";

import { Breadcrumb } from "@/features/app/components/Breadcrumbs/AppBreadcrumbs.types";
import {
  buildOpenStreetMapsLink,
  invalidateSession,
  refreshSession,
} from "../../helpers/session.helpers";

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

export const createContextMenuItems = (
  session: ReturnType<typeof mapPublicSessionToRowData>,
  {
    router,
    isCurrent,
    mutateInvalidate,
    mutateRefresh,
  }: {
    router: Router;
    mutateRefresh: (sessionId: string) => Promise<any>;
    mutateInvalidate: (sessionId: string) => Promise<any>;
    isCurrent: boolean;
  },
): ContextMenuItem[] => {
  const items: ContextMenuItem[] = [
    {
      caption: "See session details",
      key: "details",
      icon: "mdi:more",
      onSelect: () => {
        console.log("e?");
        router.push({
          name: "session-details",
          params: { sessionId: session.id },
        });
      },
    },
  ];

  if (session.geolocation.length > 0) {
    items.push({
      caption: "Open coordinates in OSM",
      key: "osm",
      icon: "mdi:map",
      onSelect: () => {
        window.open(buildOpenStreetMapsLink(session.geolocation), "_blank");
      },
    });
  }

  if (session.refreshable) {
    items.push({
      caption: "Refresh session",
      key: "refresh",
      icon: "mdi:refresh",
      onSelect: () => {
        refreshSession(session.id, session.refreshable, {
          mutate: mutateRefresh,
        });
      },
    });
  }

  items.push({
    caption: "Invalidate session",
    key: "invalidate",
    icon: "mdi:trash-can-outline",
    onSelect: () => {
      invalidateSession(session.id, isCurrent, {
        mutate: mutateInvalidate,
        router,
      });
    },
  });

  return items;
};
