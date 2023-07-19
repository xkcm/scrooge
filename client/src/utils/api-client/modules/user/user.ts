import { sendApiRequest } from "../../api-client.utils";
import { UserInfo } from "./user.types";

export async function getInfo(): Promise<UserInfo> {
  const path = "user/info";
  const method = "GET";

  const { body } = await sendApiRequest<UserInfo>({
    path,
    method,
  });

  return body;
}
