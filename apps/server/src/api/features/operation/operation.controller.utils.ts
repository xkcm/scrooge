import { FilterContainer } from "@scrooge/shared";

import { InvalidFilterError } from "./operation.errors.js";

export function createFilterContainerFromStringAndMapError<
  S extends Zod.AnyZodObject,
>(...args: Parameters<typeof FilterContainer.fromString<S>>) {
  try {
    return FilterContainer.fromString<S>(...args);
  } catch (filterContainerError) {
    throw new InvalidFilterError({ cause: filterContainerError });
  }
}

export function createFilterContainerFromFiltersAndMapError<
  S extends Zod.AnyZodObject,
>(...args: Parameters<typeof FilterContainer.fromFilters<S>>) {
  try {
    return FilterContainer.fromFilters<S>(...args);
  } catch (filterContainerError) {
    throw new InvalidFilterError({ cause: filterContainerError });
  }
}
