const path = require("node:path");
const fs = require("node:fs");

const tsconfigJson = require("../tsconfig.json");
const packageJson = require("../package.json");

const IGNORED_ALIASES = [];
const CUSTOM_PATHS = {};

const { outDir } = tsconfigJson.compilerOptions;
packageJson.imports = {
  ...Object.fromEntries(
    Object.entries(tsconfigJson.compilerOptions.paths)
      .filter(([a]) => !IGNORED_ALIASES.includes(a))
      .map(([alias, [aliasRelativePath]]) => {
        return [alias, "./" + path.join(outDir, aliasRelativePath)];
      }),
  ),
  ...CUSTOM_PATHS,
};

fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
