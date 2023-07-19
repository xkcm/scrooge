import serverConfig from "#core/config/server.config.js";
import { ApiControllerObject } from "#root/api/api.types.js";

const metaController = {
  getServerConfig(req, res) {
    res.json({
      isSessionRefreshable: serverConfig.service_configs.session.refreshable,
      createUndefinedTags: serverConfig.service_configs.tags.create_undefined,
      version: serverConfig.version,
    });
  },
} satisfies ApiControllerObject;

export default metaController;
