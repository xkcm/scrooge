import { computed } from "vue";
import { schemas } from "@scrooge/shared";

import { useSessionsQuery } from "./useSessionsQuery";

export function useSession(sessionId: schemas.session.PublicSession["id"]) {
  const { data: sessions } = useSessionsQuery();
  return {
    session: computed(() =>
      sessions.value?.sessions.find(({ id }) => sessionId === id),
    ),
    isCurrent: computed(() => sessions.value?.current === sessionId),
  };
}
