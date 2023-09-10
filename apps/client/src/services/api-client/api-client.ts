import * as auth from "./modules/auth/api-client.auth.module.js";
import * as user from "./modules/user/api-client.user.module.js";
import * as session from "./modules/session/api-client.session.module.js";
import * as operation from "./modules/operation/api-client.operation.module.js";

// todo: refactor this api client
// - [ ] use schema types from @scrooge/shared
const apiClient = {
  auth,
  user,
  session,
  operation,
};

export default apiClient;
