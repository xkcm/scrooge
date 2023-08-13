import { z } from "zod";

import {
  ForbiddenFilterValueError,
  InvalidFilterError,
} from "./filtering.errors.js";
import {
  CreateFilterFromStringOptions,
  ExtractKeysBasedOnValueType,
  FilterRange,
  FilterSpec,
  QueryDictionary,
  StringifyFilterOptions,
} from "./filtering.types.js";
import {
  decodeFilterItem,
  determineFilterTypeBasedOnSchema,
  encodeFilterItem,
  validateFilterValue,
} from "./filtering.utils.js";

export class QueryFilter<F extends QueryDictionary = QueryDictionary> {
  private constructor(filterObject: Record<keyof F, FilterSpec>) {
    Object.entries(filterObject).forEach(([key, value]) =>
      this.add(key, value),
    );
  }

  public static empty<S extends QueryDictionary>() {
    const queryFilter = new QueryFilter<S>({} as Record<keyof S, FilterSpec>);
    return queryFilter;
  }

  public static fromFilters<F extends QueryDictionary>(
    filters: F,
    schema: Zod.AnyZodObject,
  ) {
    const parseResult = schema.safeParse(filters);
    if (!parseResult.success) {
      throw new InvalidFilterError({
        metadata: { filter: "<internal>" },
        cause: parseResult.error,
      });
    }

    const filterSpecsObject = Object.fromEntries(
      Object.entries(filters).map(([key, filterValue]) => [
        key,
        {
          type: determineFilterTypeBasedOnSchema(key, schema),
          value: filterValue,
        },
      ]),
    ) as Record<keyof F, FilterSpec>;

    const queryFilter = new QueryFilter<F>(filterSpecsObject);
    return queryFilter;
  }

  public static fromString<S extends Zod.AnyZodObject>(
    stringValue?: string,
    options: CreateFilterFromStringOptions<S> = {},
  ): QueryFilter<z.infer<S>> {
    let resolvedStringValue = stringValue;
    if (options.decodeUri && stringValue) {
      resolvedStringValue = decodeURIComponent(stringValue);
    }

    const filterEntries = resolvedStringValue
      ? resolvedStringValue.split(";").map((entry) => entry.split(":"))
      : [];

    const filterObject = filterEntries.map(
      ([key, value]) => [key, decodeFilterItem(value)] as const,
    );

    if (options.schema) {
      const pluckedObject = Object.fromEntries(
        filterObject.map(([key, filterSpec]) => [key, filterSpec.value]),
      );

      const parseResult = options.schema.safeParse(pluckedObject);
      if (!parseResult.success) {
        throw new InvalidFilterError({
          metadata: { filter: stringValue || "<empty>" },
          cause: parseResult.error,
        });
      }
    }

    return new QueryFilter(Object.fromEntries(filterObject));
  }

  private filterMap = new Map<keyof F, FilterSpec>();

  public addString<SK extends keyof ExtractKeysBasedOnValueType<F, string>>(
    key: SK,
    value: F[SK],
  ) {
    const typedValue = value as string;
    if (!validateFilterValue(typedValue as string)) {
      throw new ForbiddenFilterValueError({
        metadata: {
          filterValue: typedValue as string,
        },
      });
    }

    this.filterMap.set(key, {
      type: "string",
      value: typedValue as string,
    });
  }

  public addRange<SK extends keyof ExtractKeysBasedOnValueType<F, FilterRange>>(
    key: SK,
    value: FilterRange,
  ) {
    const item: FilterSpec = {
      type: "range",
      value,
    };
    return this.add(key, item);
  }

  public addNumber<SK extends keyof ExtractKeysBasedOnValueType<F, number>>(
    key: SK,
    value: number,
  ) {
    return this.add(key, {
      type: "number",
      value,
    });
  }

  public addArray<SK extends keyof ExtractKeysBasedOnValueType<F, string[]>>(
    key: SK,
    values: string[],
  ) {
    values.forEach((value) => {
      if (!validateFilterValue(value)) {
        throw new ForbiddenFilterValueError({
          metadata: {
            filterValue: value,
          },
        });
      }
    });

    return this.add(key, {
      type: "array",
      value: values,
    });
  }

  public getFilter<K extends keyof F>(
    ...args: undefined extends F[K]
      ? [key: K, fallback?: NonNullable<F[K]>]
      : [key: K]
  ): NonNullable<F[K]> {
    const [key, fallback] = args;
    const filterSpec = this.filterMap.get(key);

    if (!filterSpec) {
      return fallback as NonNullable<F[K]>;
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

    if (options.encodeUri) {
      stringifiedValue = encodeURIComponent(stringifiedValue);
    }

    return stringifiedValue;
  }

  public toURLSearchParams() {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("filter", this.stringify());

    return urlSearchParams;
  }
}
