import { computed } from "vue";
import { schemas } from "@scrooge/shared";

import { useSessions } from "./useSessions";

export function useSession(sessionId: schemas.session.PublicSession["id"]) {
  const { data } = useSessions();
  return {
    session: computed(() =>
      data.value?.sessions.find(({ id }) => sessionId === id),
    ),
    isCurrent: computed(() => data.value?.current === sessionId),
  };
}
