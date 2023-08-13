<template>
  <li class="operation-item" :class="`operation-item--${type.toLowerCase()}`">
    <div class="operation-item__row-number">
      {{ rowNumber }}
    </div>

    <div class="operation-item__title">
      {{ title }}
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

type LatestOperationItemProps = Operation & {
  rowNumber: number;
};
const { amount, createdAt } = defineProps<LatestOperationItemProps>();

// todo: implement this correctly
// - set locale based on user
// - set currency based on preference
const currencyFormatter = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "PLN",
});
const dateFormatter = new Intl.DateTimeFormat("en-us", {
  month: "2-digit",
  day: "2-digit",
});

const formattedAmount = computed(() => currencyFormatter.format(amount));
const formattedDate = computed(() => dateFormatter.format(new Date(createdAt)));
</script>

<style lang="scss">
@use "@/assets/styles/utils.scss";

.operation-item {
  @include utils.useBgColor(alpha);
  display: flex;
  align-items: center;
  height: 40px;

  &--income .operation-item__amount {
    color: utils.getColor(green);
  }
  &--expense .operation-item__amount {
    color: utils.getColor(red);
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
  flex-grow: 1;
  font-weight: 300;
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
