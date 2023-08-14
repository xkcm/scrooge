export type RangeFilter = {
  includeFrom?: boolean;
  includeTo?: boolean;
  from: number;
  to: number;
};

export type FilterSpec =
  | {
      type: "string";
      value: string;
    }
  | {
      type: "number";
      value: number;
    }
  | {
      type: "range";
      value: RangeFilter;
    }
  | {
      type: "array";
      value: string[];
    };

export type FilterDictionary = Record<string, FilterSpec["value"]>;

export type CreateFilterContainerFromStringOptions<
  Schema extends Zod.AnyZodObject,
> = {
  decodeUri?: boolean;
  schema?: Schema;
};
export type CreateFilterContainerFromFiltersOptions<S extends Zod.Schema> = {
  schema: S;
};
export type StringifyFilterContainerOptions = {
  encodeUri?: boolean;
};

export type ExtractKeysBasedOnValueType<O extends Record<string, any>, T> = {
  [K in keyof O as NonNullable<O[K]> extends T ? K : never]: O[K];
};
