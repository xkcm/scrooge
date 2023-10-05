import operationService from "@/features/app/services/operation.service";
import { Ref } from "vue";

export function calculateMaxItemsNumber(
  elRef: Ref<HTMLDivElement>,
  itemHeight: number,
) {
  const { height } = elRef.value.getBoundingClientRect();
  return Math.floor(height / itemHeight);
}

export function isRefDefined<T>(ref: Ref<T>): ref is Ref<NonNullable<T>> {
  return !!ref.value;
}

export function mapApiDataToChartDatasets(
  summary: Awaited<
    ReturnType<typeof operationService.getOperationsPeriodSummary>
  >,
  locale: string,
) {
  const dateFormatter = Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
  });

  const labels = summary.expense.entries
    .map(({ date }) => dateFormatter.format(new Date(date).getTime()))
    .reverse();

  const expenseDataset = summary.expense.entries
    .map(({ sum }) => sum)
    .reverse();

  const incomeDataset = summary.income.entries.map(({ sum }) => sum).reverse();

  return {
    labels,
    expenseDataset,
    incomeDataset,
  };
}
