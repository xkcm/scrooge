#!/bin/sh
SCROOGE_CWD=$PWD
NODE_ENV=development

rm -rf ./dist

tsc -b
node ./devtools/dev:integrate-path-aliases.cjs
cp -r ../shared/dist ./dist/shared
