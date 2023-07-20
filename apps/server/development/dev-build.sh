#!/bin/sh
NODE_ENV=development

rm -rf ./dist
tsc -b && node ./devtools/dev:integrate-path-aliases.cjs
