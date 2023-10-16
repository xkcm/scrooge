import { BetterError } from "@xkcm/better-errors";
import fs from "fs";
import { access } from "fs/promises";

import { Constructor } from "./utils.types.js";

export function getEnvVariableOrThrow<Type = any>(key: string) {
  const value = process.env[key];
  if (typeof value === "undefined") {
    throw new Error(`Environment Variable ${key} is required!`);
  }

  return value as Type;
}

export async function assertPath(filePath: string) {
  try {
    await access(filePath, fs.constants.F_OK);
  } catch {
    throw new Error(`File ${filePath} does not exist!`);
  }
}

export function removeDuplicates(array: any[]) {
  return Array.from(new Set(array));
}

export function bindObjectMethods<T extends Record<string | symbol, any>>(
  object: T,
  thisObject: any = object,
): T {
  const newObject = Object.create(object, {});

  Reflect.ownKeys(object).forEach((key) => {
    if (object[key] instanceof Function) {
      newObject[key] = object[key].bind(thisObject);
    } else {
      newObject[key] = object[key];
    }
  });

  return newObject;
}

export function createErrorRethrower(RethrownError: Constructor<BetterError>) {
  return (error: any) => {
    throw new RethrownError({ cause: error });
  };
}

export function createErrorMapper(
  errorMap: Map<Constructor<Error>, Constructor<Error>>,
  DefaultError?: Constructor<Error>,
) {
  return (error: any) => {
    const foundEntry = [...errorMap.entries()].find(
      ([ErrorConstructor]) => error instanceof ErrorConstructor,
    );

    if (foundEntry) {
      const FoundError = foundEntry[1];
      throw new FoundError();
    } else if (DefaultError) {
      throw new DefaultError();
    } else {
      throw error;
    }
  };
}
