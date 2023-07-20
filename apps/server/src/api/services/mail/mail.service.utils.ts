import queryString from "node:querystring";

import { readFile } from "fs/promises";
import mustache from "mustache";
import path from "path";

import config from "#assets/mail/config.json" assert { type: "json" };

import { ConfigSchema } from "./mail.service.schemas.js";

type BuildTemplateOptions = {
  templateFile?: string;
  template?: string;
  data: Record<string, any>;
};

type BuildUrlOptions = {
  path: string;
  query: Record<string, any>;
};

const mailConfig = ConfigSchema.parse(config);

export async function renderTemplate(options: BuildTemplateOptions): Promise<string> {
  const {
    templateFile,
    template,
    data,
  } = options;

  let rawTemplate = "";

  if (templateFile) {
    const templateResolvedPath = path.resolve(__dirname, templateFile);
    rawTemplate = await readFile(templateResolvedPath, { encoding: "utf-8" });
  } else if (template) {
    rawTemplate = template;
  }

  return mustache.render(rawTemplate, data);
}

export function buildUrl(base: string, options: BuildUrlOptions): string {
  const url = new URL(base);

  if (options.path) {
    url.pathname = options.path;
  }
  if (options.query) {
    url.search = queryString.stringify(options.query);
  }

  return url.toString();
}

export {
  mailConfig as config,
};
