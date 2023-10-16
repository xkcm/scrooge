import { useRouter } from "vue-router";
import { AppMenubarItem as ContextMenuItem } from "@scrooge/ui-library";

import { type mapPublicSessionToRowData } from "../pages/SessionsPage/SessionsPage.helpers";
import { buildOpenStreetMapsLink } from "../helpers/session.helpers";

import { useSessionInvalidator } from "./useSessionInvalidator";
import { useSessionRefresher } from "./useSessionRefresher";

export function useContextMenuCreator() {
  const { invalidateSession } = useSessionInvalidator();
  const { refreshSession } = useSessionRefresher();
  const router = useRouter();

  const prepareContextMenuItems = (
    session: ReturnType<typeof mapPublicSessionToRowData>,
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
          refreshSession(session.id);
        },
      });
    }

    items.push({
      caption: "Invalidate session",
      key: "invalidate",
      icon: "mdi:trash-can-outline",
      onSelect: () => {
        invalidateSession(session.id);
      },
    });

    return items;
  };

  return { prepareContextMenuItems };
}
