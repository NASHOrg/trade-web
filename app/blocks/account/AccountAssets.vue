<script setup lang="ts">
const { t } = useI18n();

function boolSwapBtnOnTap() {

}

function btpStakeBtnOnTap() {

}

function bppListBtnOnTap() {

}

function bppOfferBtnOnTap() {

}
</script>

<template>
  <div class="card p-[30px] my-[28px]">
    <div class="flex justify-between text-[24px]">
      <p>Assets</p>
      <p>Balance</p>
      <p>Entry</p>
    </div>
    <div class="mt-[10px] flex flex-col divide-y divide-[#2E2E2E]">
      <div class="py-[20px] flex justify-between items-center">
        <div class="flex">
          <NuxtImg
            src="images/bool_circle_fill_pink.png"
            densities="1x 2x"
            height="50"
            width="50"
          />
          <div class="flex flex-col justify-center ms-[8px] space-y-[6px]">
            <p>BOOL</p>
            <div class="border border-primary-500 rounded-[2px] p-[3px] text-primary-500 text-[12px]">
              {{ t('token') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end space-y-[8px]">
          <p class="text-primary-500 text-[20px]">
            5100.1218
          </p>
          <p class="text-[16px] text-[#999]">
            $1020.02
          </p>
        </div>
        <UButton
          color="black"
          class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]"
          @click="boolSwapBtnOnTap"
        >
          {{ t('swap') }}
        </UButton>
      </div>
      <div class="py-[20px] flex justify-between items-center">
        <div class="flex">
          <NuxtImg
            src="images/btu_circle_fill_yellow.png"
            densities="1x 2x"
            height="50"
            width="50"
          />
          <div class="flex flex-col justify-center ms-[8px] space-y-[6px]">
            <p>BTU</p>
            <div class="border border-primary-500 rounded-[2px] p-[3px] text-primary-500 text-[12px]">
              {{ t('token') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end space-y-[8px]">
          <p class="text-primary-500 text-[20px]">
            1,000.1545
          </p>
          <p class="text-[16px] text-[#999]">
            $1000.15
          </p>
        </div>
        <UButton
          color="black"
          class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]"
          to="https://test.hellobtu.com/borrow"
        >
          {{ t('borrow') }}
        </UButton>
      </div>
      <div class="py-[20px] flex justify-between items-center">
        <div class="flex">
          <NuxtImg
            src="images/btp_circle_fill_red.png"
            densities="1x 2x"
            height="50"
            width="50"
          />
          <div class="flex flex-col justify-center ms-[8px] space-y-[6px]">
            <p>BOOL</p>
            <div class="border border-[#38C15A] rounded-[2px] p-[3px] text-[#38C15A] text-[12px]">
              {{ t('power') }}
            </div>
          </div>
        </div>
        <p class="text-primary-500 text-[20px]">
          2390.0000
        </p>
        <UButton
          color="black"
          class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]"
          @click="btpStakeBtnOnTap"
        >
          {{ t('stake') }}
        </UButton>
      </div>
      <div class="relative py-[20px] flex justify-between items-center">
        <div class="flex">
          <NuxtImg
            src="images/bpp_circle_fill_grey.png"
            densities="1x 2x"
            height="50"
            width="50"
          />
          <div class="flex flex-col justify-center ms-[8px] space-y-[6px]">
            <p>BOOL</p>
            <div class="border border-[#38C15A] rounded-[2px] p-[3px] text-[#38C15A] text-[12px]">
              {{ t('power') }}
            </div>
          </div>
        </div>
        <p class="text-primary-500 text-[20px]">
          1756.8800
        </p>
        <div class="w-[72px]" />
        <div class="absolute -end-0 flex space-x-[8px]">
          <UButton
            color="black"
            class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]"
            @click="bppListBtnOnTap"
          >
            {{ t('list') }}
          </UButton>
          <UButton
            color="primary"
            class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]"
            @click="bppOfferBtnOnTap"
          >
            {{ t('offer') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
td {
  @apply border-b border-[#2E2E2E];
}
</style>
