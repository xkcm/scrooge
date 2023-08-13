import {
  BadEncodedFilterValueError,
  InvalidFilterSchema,
  UnrecognizedFilterValueTypeError,
} from "./filtering.errors.js";
import { FilterSpec } from "./filtering.types.js";

export function validateFilterValue(value: string) {
  return (
    !!value &&
    !value.includes(";") &&
    !value.includes(":") &&
    !value.includes(",") &&
    !value.includes("&")
  );
}

export function encodeFilterItem(item: FilterSpec) {
  let itemValue;

  switch (item.type) {
    case "range": {
      const biggerSign = item.value.includeFrom ? ">=" : ">";
      const lessSign = item.value.includeTo ? "<=" : "<";
      itemValue = `r!${biggerSign}${item.value.from},${lessSign}${item.value.to}`;
      break;
    }
    case "number":
      itemValue = `n!${String(item.value)}`;
      break;
    case "string":
      itemValue = `s!${item.value}`;
      break;
    case "array":
      itemValue = `a!${item.value.join(",")}`;
      break;
    default:
      throw new UnrecognizedFilterValueTypeError({
        metadata: { valueType: (item as FilterSpec).type },
      });
  }

  return itemValue;
}

export function decodeFilterItem(rawItem: string): FilterSpec {
  if (!/^[rns]!/.test(rawItem)) {
    throw new BadEncodedFilterValueError({
      metadata: {
        encodedFilter: rawItem,
      },
    });
  }
  const encodedType = rawItem[0];
  const encodedValue = rawItem.slice(2);

  let type;
  let value;

  switch (encodedType) {
    case "r": {
      const [rawFrom, rawTo] = encodedValue.split(",");

      const includeFrom = /^>=/.test(rawFrom);
      const includeTo = /^<=/.test(rawTo);
      const from = +rawFrom.slice(includeFrom ? 2 : 1);
      const to = +rawTo.slice(includeTo ? 2 : 1);

      type = "range";
      value = { includeFrom, includeTo, from, to };

      break;
    }
    case "s":
      type = "string";
      value = encodedValue;
      break;
    case "n":
      type = "number";
      value = +encodedValue;
      break;
    case "a":
      type = "array";
      value = encodedValue.split(",");
      break;
    default:
      throw new UnrecognizedFilterValueTypeError({
        metadata: { valueType: encodedType },
      });
  }

  return { type, value } as FilterSpec;
}

export function determineFilterTypeBasedOnSchema(
  key: string,
  schema: Zod.AnyZodObject,
): FilterSpec["type"] {
  const { description } = schema.shape[key];
  if (!/^type=(?:string|number|range|array)/.test(description)) {
    throw new InvalidFilterSchema({
      metadata: { schema: schema.shape[key], parentSchema: schema },
    });
  }

  return description.slice(5);
}
