#!/bin/sh
NODE_ENV=development

rm -f tsconfig.tsbuildinfo
rm -rf ./dist
pnpm exec tsc --build --verbose && node ./development/integrate-path-aliases.cjs
