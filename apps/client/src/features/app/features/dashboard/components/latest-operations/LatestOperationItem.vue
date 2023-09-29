<template>
  <li
    class="operation-item"
    :class="`operation-item--${type.toLowerCase()}`"
    tabindex="0"
  >
    <div class="operation-item__row-number">
      {{ rowNumber }}
    </div>

    <div class="operation-item__title">
      <span>{{ title }}</span>
      <div class="operation-item__tags-wrapper">
        <div
          v-for="(tag, i) of tags"
          :key="i"
          class="operation-item__tag"
          tabindex="0"
          @click.stop="openTagInHistory(tag)"
          @keyup.enter.stop="openTagInHistory(tag)"
        >
          <AppTooltip
            side="right"
            :side-offset="6"
            tooltip-class="show-tag-history-tooltip"
          >
            <template #trigger>
              <span>{{ tag }}</span>
            </template>
            <span>
              See all operations with
              <span class="show-tag-history-tooltip__tag-name">{{ tag }}</span>
              tag
            </span>
          </AppTooltip>
        </div>
      </div>
    </div>

    <div class="operation-item__amount">
      {{ formattedAmount }}
    </div>

    <div class="operation-item__date">
      {{ formattedDate }}
    </div>
  </li>
</template>

<script lang="ts" setup>
import { router } from "@/router/router";
import { FilterContainer, filters } from "@scrooge/shared";
import { AppTooltip } from "@scrooge/ui-library";
import { computed } from "vue";
import { usePreferencesStore } from "../../../settings/stores/preferences.store";
import { Operation } from "../../types";

type LatestOperationItemProps = Operation & {
  rowNumber: number;
};

const { amount, createdAt, type } = defineProps<LatestOperationItemProps>();
const preferencesStore = usePreferencesStore();

const currencyFormatter = new Intl.NumberFormat(preferencesStore.locale, {
  style: "currency",
  currency: preferencesStore.currency,
});
const dateFormatter = new Intl.DateTimeFormat(preferencesStore.locale, {
  month: "2-digit",
  day: "2-digit",
});

const formattedAmount = computed(() => currencyFormatter.format(amount));
const formattedDate = computed(() => dateFormatter.format(new Date(createdAt)));

const openTagInHistory = (tag: string) => {
  const filterContainer = FilterContainer.fromFilters(
    { tags: [tag] },
    { schema: filters.GetOperationsSchema },
  );

  router.push({
    name: "history",
    query: {
      filter: filterContainer.stringify(),
    },
  });
};
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.operation-item {
  @include utils.useBgColor(alpha);
  @include utils.useTextColor(primary);

  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 140px 70px;
  grid-template-rows: 40px;
  cursor: pointer;

  &--income .operation-item__amount {
    color: utils.getColor(green);
  }
  &--expense .operation-item__amount {
    color: utils.getColor(red);
  }

  &:hover {
    @include utils.useBgColor(alpha, 500);
  }

  &:active,
  &:focus-visible {
    @include utils.useBgColor(alpha, 600);
    outline: none;
  }
}

.operation-item__row-number {
  @include utils.useTextColor(primary, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.operation-item__title {
  display: flex;
  flex-grow: 1;
  align-items: center;
  padding-right: 10px;

  > span {
    font-weight: 300;
  }
}

.operation-item__tags-wrapper {
  height: 100%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 10px;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.operation-item__tag {
  @include utils.useBgColor(gamma);
  @include utils.useTextColor(secondary);
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 500;
  font-size: 11px;
  line-height: 15px;
  padding: 0 6px;
  border-radius: 12px;
  text-transform: lowercase;

  &:hover {
    @include utils.useBgColor(gamma, 500);
  }

  &:active,
  &:focus-visible {
    @include utils.useBgColor(gamma, 600);
    outline: none;
  }
}

.show-tag-history-tooltip {
  --p-tooltip-color: #{utils.getColor(beta)};
  font-weight: 300;

  .show-tag-history-tooltip__tag-name {
    font-weight: 500;
  }
}

.operation-item__amount {
  font-weight: 600;
}

.operation-item__date {
  text-align: right;
  font-weight: 300;
  padding-right: 10px;
}
</style>
