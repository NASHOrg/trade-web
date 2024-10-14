<script setup lang="ts">
// const { t } = useI18n();

// const rows = [
//   { level: 1, tag: 'iron', teamTotalStaking: '0 <= N < 10000', powerPackageCalculation: '0' },
//   { level: 2, tag: 'bronze', teamTotalStaking: '10000 <= N < 20000', powerPackageCalculation: '1' },
//   { level: 3, tag: 'silver', teamTotalStaking: '20000 <= N < 150000', powerPackageCalculation: '1.1' },
//   { level: 4, tag: 'gold', teamTotalStaking: '150000 <= N < 200000', powerPackageCalculation: '1.2' },
//   { level: 5, tag: 'platinum', teamTotalStaking: '200000 <= N < 300000', powerPackageCalculation: '1.3' },
//   { level: 6, tag: 'diamond', teamTotalStaking: '300000 <= N < 500000', powerPackageCalculation: '1.4' },
//   { level: 7, tag: 'legend', teamTotalStaking: 'N >= 500000', powerPackageCalculation: '1.5' },
// ];
</script>

<template>
  <UModal
    :ui="{
      background: 'bg-[url(\'images/check_rules_window_bg_black.png\')] bg-contain bg-no-repeat bg-transparent dark:bg-transparent',
      base: 'flex flex-col items-start relative flex-1 w-full focus:outline-none text-start rounded-[12px]',
      width: 'min-w-[804px] w-[804px] max-w-[804px]',
      height: 'min-h-[613px] h-[613px] max-h-[613px]',
      overlay: { background: 'bg-black/70 dark:bg-gray-800/70' },
    }"
  >
    <!--    <h2 class="text-[30px] ms-[40px] mt-[116px] mb-[10px]"> -->
    <!--      {{ t('checkRules') }} -->
    <!--    </h2> -->
    <!--    <table -->
    <!--      class="grow text-[18px] text-center ms-[1px] mt-[1px] mb-[5px] rounded-[15px]" -->
    <!--    > -->
    <!--      <thead> -->
    <!--        <tr> -->
    <!--          <th> -->
    <!--            {{ t('level') }} -->
    <!--          </th> -->
    <!--          <th> -->
    <!--            {{ t('tag') }} -->
    <!--          </th> -->
    <!--          <th> -->
    <!--            {{ t('teamTotalStaking') }} -->
    <!--          </th> -->
    <!--          <th> -->
    <!--            {{ t('powerPackageCalculationColumnHead') }} -->
    <!--          </th> -->
    <!--        </tr> -->
    <!--      </thead> -->
    <!--      <tbody> -->
    <!--        <tr -->
    <!--          v-for="row in rows" -->
    <!--          :key="row.tag" -->
    <!--        > -->
    <!--          <td class="w-[107px]"> -->
    <!--            <NuxtImg -->
    <!--              class="ms-[30px]" -->
    <!--              :src="`images/badge_rank_${row.level}.png`" -->
    <!--              densities="1x 2x" -->
    <!--              height="31" -->
    <!--              width="43" -->
    <!--            /> -->
    <!--          </td> -->
    <!--          <td class="w-[116px]"> -->
    <!--            {{ t(row.tag) }} -->
    <!--          </td> -->
    <!--          <td class="w-[242px]"> -->
    <!--            {{ row.teamTotalStaking }} -->
    <!--          </td> -->
    <!--          <td class="w-[332px]"> -->
    <!--            Min (X | N/10) * {{ row.powerPackageCalculation }} -->
    <!--          </td> -->
    <!--        </tr> -->
    <!--      </tbody> -->
    <!--    </table> -->
  </UModal>
</template>

<style scoped>
th {
  padding: 28px 0;
}
</style>
