import { z } from "zod";

import {
  ForbiddenFilterValueError,
  InvalidFilterError,
} from "./filtering.errors.js";
import {
  CreateFilterFromStringOptions,
  FilterNumber,
  FilterRange,
  FilterSpec,
  FilterString,
  QueryDictionary,
  StringifyFilterOptions,
} from "./filtering.types.js";
import {
  decodeFilterItem,
  encodeFilterItem,
  validateFilterValue,
} from "./filtering.utils.js";

export class Query<F extends QueryDictionary = QueryDictionary> {
  private constructor(filterObject: Record<keyof F, FilterSpec>) {
    Object.entries(filterObject).forEach(([key, value]) =>
      this.add(key, value),
    );
  }

  public static fromString<S extends Zod.ZodRawShape = {}>(
    stringValue?: string,
    options: CreateFilterFromStringOptions<S> = {},
  ): Query<z.infer<Zod.ZodObject<S>>> {
    let resolvedStringValue = stringValue;
    if (options.uriEncoded && stringValue) {
      resolvedStringValue = decodeURIComponent(stringValue);
    }

    const filterEntries = resolvedStringValue
      ? resolvedStringValue.split(";").map((entry) => entry.split(":"))
      : [];

    const filterObject = filterEntries.map(([key, value]) => [
      key,
      decodeFilterItem(value),
    ]);

    if (options.schema) {
      const schema = z.object(options.schema);
      const pluckedObject = Object.fromEntries(
        (filterObject as [string, FilterSpec][]).map(([key, { value }]) => [
          key,
          value,
        ]),
      );

      const { success } = schema.safeParse(pluckedObject);
      if (!success) {
        throw new InvalidFilterError({
          metadata: { filter: stringValue || "<empty>" },
        });
      }
    }

    return new Query(Object.fromEntries(filterObject));
  }

  private filterMap = new Map<keyof F, FilterSpec>();

  public addString(key: keyof F, value: FilterString) {
    if (!validateFilterValue(value)) {
      throw new ForbiddenFilterValueError({
        metadata: {
          filterValue: value,
        },
      });
    }

    this.filterMap.set(key, {
      type: "string",
      value,
    });
  }

  public addRange(key: keyof F, value: FilterRange) {
    const item: FilterSpec = {
      type: "range",
      value,
    };
    return this.add(key, item);
  }

  public addNumber(key: keyof F, value: FilterNumber) {
    return this.add(key, {
      type: "number",
      value,
    });
  }

  public getFilter<K extends keyof F>(
    ...args: undefined extends F[K]
      ? [key: K, fallback: NonNullable<F[K]>]
      : [key: K]
  ): NonNullable<F[K]> {
    const [key, fallback] = args;
    const filterSpec = this.filterMap.get(key);

    if (!filterSpec) {
      return fallback as F[K];
    }

    return filterSpec.value as NonNullable<F[K]>;
  }

  protected add(key: keyof F, item: FilterSpec) {
    this.filterMap.set(key, item);
  }

  public stringify(options: StringifyFilterOptions = {}) {
    let stringifiedValue = [...this.filterMap.entries()]
      .map(([key, value]) => `${key.toString()}:${encodeFilterItem(value)}`)
      .join(";");

    if (options.uriEncoded) {
      stringifiedValue = encodeURIComponent(stringifiedValue);
    }

    return stringifiedValue;
  }
}
