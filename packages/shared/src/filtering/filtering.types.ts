export type FilterString = string;
export type FilterNumber = number;
export type FilterRange = {
  includeFrom?: boolean;
  includeTo?: boolean;
  from: number;
  to: number;
};

export type FilterSpec =
  | {
      type: "string";
      value: FilterString;
    }
  | {
      type: "number";
      value: FilterNumber;
    }
  | {
      type: "range";
      value: FilterRange;
    };

export type QueryDictionary = Record<
  string,
  FilterString | FilterNumber | FilterRange
>;

export type CreateFilterFromStringOptions<Schema extends Zod.AnyZodObject> = {
  decodeUri?: boolean;
  schema?: Schema;
};
export type StringifyFilterOptions = {
  encodeUri?: boolean;
};
