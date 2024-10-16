<script setup lang="ts">
const { t } = useI18n();
const columns = [{
  key: 'pair',
  label: 'Pair',
}, {
  key: 'side',
  label: 'Side',
}, {
  key: 'targetPrice',
  label: 'TargetPrice',
}, {
  key: 'filledQty',
  label: 'Filled Qty',
}, {
  key: 'totalQty',
  label: 'Filled Qty',
}, {
  key: 'action',
  label: 'Action',
}];

const people = [{
  id: 1,
  pair: 'BTC/USDT',
  side: 'Sell',
  targetPrice: '0.4577',
  filledQty: '1200',
  totalQty: '2000',
},
{
  id: 2,
  pair: 'BTC/USDT',
  side: 'Sell',
  targetPrice: '0.4577',
  filledQty: '1200',
  totalQty: '2000',
},
];
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <UTable
      class="w-full"
      :columns="columns"
      :rows="people"
    >
      <template #action-data>
        <UButton
          :label="t('cancel')"
          class="rounded-[4px]"
          size="sm"
        />
      </template>
    </UTable>
    <TablePagination
      class="mt-[30px]"
      :total="10"
      :current="1"
    />
  </div>
</template>
