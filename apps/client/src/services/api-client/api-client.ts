import * as auth from "./modules/api-client.auth.module.js";
import * as user from "./modules/api-client.user.module.js";
import * as session from "./modules/api-client.session.module.js";
import * as operation from "./modules/api-client.operation.module.js";

// todo: refactor this api client
// - [ ] use schema types from @scrooge/shared
const apiClient = {
  auth,
  user,
  session,
  operation,
};

export default apiClient;
