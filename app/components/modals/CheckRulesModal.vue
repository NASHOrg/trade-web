<script setup lang="ts">
const { t } = useI18n();
const rows = [
  { level: 1, tag: 'iron', teamTotalStaking: '0 <= N < 10000', powerPackageCalculation: '0' },
  { level: 2, tag: 'bronze', teamTotalStaking: '10000 <= N < 20000', powerPackageCalculation: '1' },
  { level: 3, tag: 'silver', teamTotalStaking: '20000 <= N < 70000', powerPackageCalculation: '1.1' },
  { level: 4, tag: 'gold', teamTotalStaking: '70000 <= N < 150000', powerPackageCalculation: '1.2' },
  { level: 5, tag: 'platinum', teamTotalStaking: '150000 <= N < 300000', powerPackageCalculation: '1.3' },
  { level: 6, tag: 'diamond', teamTotalStaking: '300000 <= N < 500000', powerPackageCalculation: '1.4' },
  { level: 7, tag: 'legend', teamTotalStaking: 'N >= 500000', powerPackageCalculation: '1.5' },
];
</script>

<template>
  <UModal
    :ui="{
      width: 'md:min-w-[804px] min-w-[400px] h-fit',
      background: '!bg-transparent',
      base: 'text-white',
    }"
  >
    <NuxtPicture
      src="/images/rules_badge.png"
      width="168"
      height="232"
      class="absolute right-[40px] top-[-90px]"
    />
    <div class="bg-primary rounded-[12px] clip-path absolute left-[4px] top-[-1px] inset-0 " />
    <div class="w-full bg-black rounded-[12px] clip-path overflow-x-auto md:overflow-hidden">
      <h2 class="h-[70px] z-10 text-[30px] ms-[40px] flex items-center">
        {{ t('checkRules') }}
      </h2>
      <table
        class="min-w-[804px] z-10 grow text-[18px] text-center ms-[1px] mt-[1px] mb-[5px] rounded-[15px] border-collapse"
      >
        <thead>
          <tr>
            <th>
              {{ t('level') }}
            </th>
            <th>
              {{ t('tag') }}
            </th>
            <th>
              {{ t('teamTotalStaking') }}
            </th>
            <th>
              <p>{{ t('powerPackageCalculation') }}</p>
              <p>{{ t('leaderTotalStakingBiggerThanNum', { num: 500 }) }}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.tag"
          >
            <td class="w-[107px]">
              <NuxtImg
                class="ms-[30px]"
                :src="`images/badge_rank_${row.level}.png`"
                densities="1x 2x"
                height="31"
                width="43"
              />
            </td>
            <td class="w-[116px]">
              {{ t(row.tag) }}
            </td>
            <td class="w-[242px]">
              {{ row.teamTotalStaking }}
            </td>
            <td class="w-[332px]">
              Min (X | N/10) * {{ row.powerPackageCalculation }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UModal>
</template>

<style scoped>
th {
  padding: 28px 0;
}

th, td {
  @apply border border-[#2e2e2e] first:border-l-0 last:border-r-0;
}

tr:last-child td {
  @apply !border-b-0;
}

.clip-path {
  clip-path: path("M0 11.999C0 5.37161 5.37258 -0.000976562 12 -0.000976562H531.639C536.413 -0.000976562 540.733 2.82899 542.64 7.20569L566.86 62.7923C568.767 67.169 573.087 69.999 577.861 69.999H788C794.627 69.999 800 75.3716 800 81.999V497.999C800 504.626 794.627 509.999 788 509.999H12C5.37257 509.999 0 504.626 0 497.999V11.999Z");
  filter: drop-shadow(4px 4px #ff623f);
  border: 1px solid #ff623f;
}
</style>
