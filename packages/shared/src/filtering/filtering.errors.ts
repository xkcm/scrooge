import { BetterError, withCode, withMessage } from "@xkcm/better-errors";

@withMessage("Filter value %{metadata.filterValue} is not supported!")
@withCode("filtering.value_forbidden")
export class ForbiddenFilterValueError extends BetterError<{
  filterValue: string;
}> {}

@withMessage(
  "Encoded filter value %{metadata.encodedFilter} has incorrect format",
)
@withCode("filtering.bad_encoded")
export class BadEncodedFilterValueError extends BetterError<{
  encodedFilter: string;
}> {}

@withMessage("Filter value type %{metadata.valueType} isn't recognized")
@withCode("filtering.unrecognized_value_type")
export class UnrecognizedFilterValueTypeError extends BetterError<{
  valueType: string;
}> {}

@withMessage("Filter %{metadata.filter} did not pass the validation")
@withCode("filtering.invalid_filter")
export class InvalidFilterError extends BetterError<{
  filter: string;
}> {}
