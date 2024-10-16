<script setup lang="ts">
const { t } = useI18n();

const status = ref<'success' | 'fail' | undefined>(undefined);

const title = computed(() => {
  switch (status.value) {
    case 'success':
      return 'congratulations';
    case 'fail':
      return 'sorry';
    default:
      return 'eligibilityCheck';
  }
});

const nextBtnText = computed(() => {
  switch (status.value) {
    case 'success':
      return 'claimYourBoolPower';
    case 'fail':
      return 'close';
    default:
      return 'next';
  }
});

const progress1 = ref<number>(0);
const progress2 = ref<number>(0);
const progress3 = ref<number>(0);
const checked1 = ref(false);
const checked2 = ref(false);
const checked3 = ref(false);

onMounted(() => {
  setTimeout(() => (progress1.value = 100), 1000);
  setTimeout(() => (progress2.value = 100), 2000);
  setTimeout(() => (progress3.value = 100), 3000);
  setTimeout(() => (checked1.value = true), 1600);
  setTimeout(() => (checked2.value = true), 2600);
  setTimeout(() => (checked3.value = true), 3600);
});

// const colorMode = useColorMode();
// const isDark = computed(() => colorMode.value === 'dark');
// const isLight = computed(() => colorMode.value === 'light');
function closeBtnOnTap() {
  useModal().close();
}

function nextBtnOnTap() {
  switch (status.value) {
    case 'success':
    case 'fail':
      useModal().close();
      break;
    default:
      status.value = 'success';
      break;
  }
}
</script>

<template>
  <UModal
    :ui="{
      base: 'p-[40px] relative flex flex-col items-center',
      width: 'min-w-[600px] w-[600px] max-w-[600px]',
      height: 'min-h-[600px] h-[600px] max-h-[600px]',
    }"
    prevent-close
  >
    <h1 class="text-center text-[24px] text-[#333] mb-[40px]">
      {{ t(title) }}
    </h1>
    <button
      @click="closeBtnOnTap"
    >
      <NuxtImg
        class="absolute top-[28px] end-[28px]"
        src="images/icon_xmark_grey.png"
        densities="1x 2x"
        height="24"
        width="24"
      />
    </button>
    <div
      v-if="!status"
      class="w-full"
    >
      <div class="w-full flex flex-row justify-between mb-[8px]">
        <h3>{{ t('accountAgeVerified') }}</h3>
        <NuxtImg
          v-if="checked1"
          src="images/icon_checkmark_circle_primary.png"
          densities="1x 2x"
          height="20"
          width="20"
        />
        <UIcon
          v-else
          size="20"
          class="animate-spin text-primary"
          name="quill:loading-spin"
        />
      </div>
      <UProgress :value="progress1" />
      <div class="w-full flex flex-row justify-between mt-[28px] mb-[8px]">
        <h3>{{ t('boolCampaignPointsChecking') }}</h3>
        <NuxtImg
          v-if="checked2"
          src="images/icon_checkmark_circle_primary.png"
          densities="1x 2x"
          height="20"
          width="20"
        />
        <UIcon
          v-else
          size="20"
          class="animate-spin text-primary"
          name="quill:loading-spin"
        />
      </div>
      <UProgress :value="progress2" />
      <div class="w-full flex flex-row justify-between mt-[28px] mb-[8px]">
        <h3>{{ t('specialContributorsWhitelistConfirming') }}</h3>
        <NuxtImg
          v-if="checked3"
          src="images/icon_checkmark_circle_primary.png"
          densities="1x 2x"
          height="20"
          width="20"
        />
        <UIcon
          v-else
          size="20"
          class="animate-spin text-primary"
          name="quill:loading-spin"
        />
      </div>
      <UProgress :value="progress3" />
    </div>
    <div
      v-else-if="status === 'success'"
      class="flex flex-col items-center"
    >
      <p class="text-[18px] text-[#999]">
        {{ t('welcomeBooleanOnBoard') }}
      </p>
      <NuxtImg
        src="images/checkmark_circle_green.png"
        densities="1x 2x"
        height="100"
        width="100"
        class="mt-[20px]"
      />
      <p class="mt-[30px] text-[22px] text-[#333]">
        {{ t('youCanClaim') }}
      </p>
      <p class="mt-[16px] text-[40px] text-[#333]">
        1756.88 BPP
      </p>
      <p class="mt-[16px] text-[18px] text-[#999]">
        1 BPP = 1 Staking BOOL
      </p>
    </div>
    <div v-else>
      <NuxtImg
        src="images/xmark_circle_red.png"
        densities="1x 2x"
        height="100"
        width="100"
        class="mb-[16px]"
      />
      <p class="text-[22px] text-[#333]">
        {{ t('youAreNotEligible') }}
      </p>
    </div>
    <div class="grow" />
    <UButton
      :ui="{ rounded: 'rounded-full' }"
      size="md"
      block
      class="w-[313px] py-[16px] text-[18px]"
      @click="nextBtnOnTap"
    >
      {{ t(nextBtnText) }}
    </UButton>
  </UModal>
</template>

<style scoped>

</style>
