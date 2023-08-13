export type FilterRange = {
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
      value: FilterRange;
    }
  | {
      type: "array";
      value: string[];
    };

export type QueryDictionary = Record<string, FilterSpec["value"]>;

export type CreateFilterFromStringOptions<Schema extends Zod.AnyZodObject> = {
  decodeUri?: boolean;
  schema?: Schema;
};
export type StringifyFilterOptions = {
  encodeUri?: boolean;
};

export type ExtractKeysBasedOnValueType<O extends Record<string, any>, T> = {
  [K in keyof O as NonNullable<O[K]> extends T ? K : never]: O[K];
};
