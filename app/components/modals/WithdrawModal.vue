<script lang="ts" setup>
import type { Token } from '~/types/common';

defineProps<{
  token: Token;
}>();

const { t } = useI18n();
const { network } = useNetworkConfig();
const { address } = useWallet();
const modal = useModal();

const items = computed(() => {
  return [
    { label: 'Balance ', value: '0' },
    { label: 'Fee', value: '--' },
  ];
});
</script>

<template>
  <BasicModal
    :title="t('withdraw')"
    :prevent-close="true"
  >
    <div class="w-full md:px-6 px-3 md:space-y-6 space-y-3">
      <div
        class="w-full flex items-center md:px-7 px-3.5 md:py-6 py-3 bg-[#0E0E11] rounded-lg"
      >
        <div
          class="flex items-center text-white md:space-x-4 space-x-2 md:text-base text-sm leading-4"
        >
          <UAvatar
            :src="token.icon"
            :alt="token.symbol"
            :size="'30px'"
            class="w-[30px] h-[30px] bg-gray-500/50"
          />
          <div>{{ token.symbol }}</div>
        </div>
        <div class="grow">
          <CustomInput
            placeholder="0.00"
            :precision="2"
            type="number"
            input-class="!text-[16px] !bg-transparent !text-end !text-white"
            block
          />
        </div>
        <div>
          <UButton
            color="primary"
            :ui="{
              rounded: 'rounded-[4px]',
              padding: { md: 'p-1.5' },
              size: { md: 'text-xs leading-3 font-normal' },
            }"
          >
            Max
          </UButton>
        </div>
      </div>

      <div
        class="w-full flex items-center md:px-7 px-3.5 md:py-6 py-3 bg-[#0E0E11] rounded-lg"
      >
        <div class="flex items-center text-white space-x-4 text-base leading-4">
          <UAvatar
            :src="network.icon"
            :alt="network.name"
            :size="'30px'"
            class="w-[30px] h-[30px] bg-gray-500/50"
          />
          <div>{{ network.name }}</div>
        </div>

        <div class="grow" />
        <div />
      </div>

      <div
        class="w-full flex flex-col md:px-7 px-3.5 md:py-4 py-2 bg-[#0E0E11] rounded-lg md:space-y-5 space-y-2.5"
      >
        <div class="w-full flex justify-between">
          <span class="text-base font-normal text-white">Withdraw address</span>
          <span />
        </div>
        <div class="flex md:gap-4 gap-2">
          <UButton
            color="primary"
            class="w-[54px] h-[25px] items-center justify-center text-xs font-normal leading-[14px]"
            :ui="{
              rounded: 'rounded-[4px]',
              padding: { md: 'p-0' },
              variant: {
                outline: 'bg-primary/30 dark:bg-primary/30',
              },
            }"
          >
            {{ t("default") }}
          </UButton>
          <span
            class="text-base font-normal leading-5 text-primary text-ellipsis overflow-hidden"
            :title="address"
          >
            {{ address }}
          </span>
        </div>
      </div>

      <div
        class="w-full flex items-center p-3 bg-[#2D2F36] rounded-lg space-x-2.5"
      >
        <IconInfo class="text-[#C5C5C5] rotate-180 w-9 h-9" />
        <span class="text-sm font-normal leading-4 text-[#999]">
          Please be aware that assets transferred to the wrong address cannot be
          recovered.
        </span>
      </div>

      <div class="w-full md:space-y-4 space-y-2">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="w-full flex justify-between items-center"
        >
          <span class="text-xs font-normal text-[#999]">{{ item.label }}</span>
          <span class="text-sm font-normal text-white">{{ item.value }}</span>
        </div>
      </div>

      <div
        class="w-full flex md:justify-end justify-between gap-3 md:mt-0 !mt-10"
      >
        <UButton
          color="black"
          variant="outline"
          class="text-sm leading-4 font-normal"
          :ui="{
            base: ' md:w-[120px] w-[45%] h-[40px]  justify-center !text-white ',
            rounded: 'rounded-lg',
          }"
          @click="modal.close"
        >
          {{ t("cancel") }}
        </UButton>

        <UButton
          color="primary"
          class="text-sm leading-4 font-normal"
          :ui="{
            base: 'md:w-[120px]  w-[45%] h-[40px] justify-center ',
            rounded: 'rounded-lg',
          }"
        >
          {{ t("confirm") }}
        </UButton>
      </div>
    </div>
  </BasicModal>
</template>
