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
      <div
        v-for="(tag, i) of tags"
        :key="i"
        class="operation-item__tag"
        tabindex="0"
        @click.stop="openTagsInHistory(tag)"
      >
        {{ tag }}
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
import { computed } from "vue";
import { Operation } from "../../types";
import { router } from "@/router/router";
import { QueryFilter, filters } from "@scrooge/shared";

type LatestOperationItemProps = Operation & {
  rowNumber: number;
};
const { amount, createdAt, type } = defineProps<LatestOperationItemProps>();

// todo: implement this correctly
const getUserPreferencies = () => ({
  currency: "USD",
  locale: navigator.language,
});

const { locale, currency } = getUserPreferencies();
const currencyFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
});
const dateFormatter = new Intl.DateTimeFormat(locale, {
  month: "2-digit",
  day: "2-digit",
});

const formattedAmount = computed(() => currencyFormatter.format(amount));
const formattedDate = computed(() => dateFormatter.format(new Date(createdAt)));

const openTagsInHistory = (tag: string) => {
  const queryFilter = QueryFilter.fromFilters(
    { tags: [tag] },
    filters.GetOperationsFilterQuerySchema,
  );

  router.push({
    name: "history",
    query: {
      filter: queryFilter.stringify(),
    },
  });
};
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.operation-item {
  @include utils.useBgColor(alpha);
  display: flex;
  align-items: center;
  height: 40px;
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
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.operation-item__title {
  display: flex;
  flex-grow: 1;
  gap: 6px;
  align-items: center;

  > span {
    font-weight: 300;
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
}

.operation-item__amount {
  min-width: 140px;
  font-weight: 600;
}

.operation-item__date {
  text-align: right;
  min-width: 70px;
  font-weight: 300;
}
</style>
