<script setup lang="ts">
import { toast } from 'vue-sonner';

const { t } = useI18n();
const { user } = storeToRefs(useUserStore());

const onCopy = () => {
  const { copy } = useClipboard({ source: '', legacy: true });
  copy();
  toast.success('Copied');
};
</script>

<template>
  <div class="relative card w-full flex flex-col items-start px-[30px] py-[40px]">
    <h1 class="w-[381px] text-[40px]">
      {{ t('inviteTitle') }}
    </h1>
    <p class="mt-[16px] text-white/80 text-[16px]">
      {{ t('inviteDesc') }}
    </p>
    <NuxtImg
      class="absolute -top-[18px] -right-[22px]"
      src="images/bool_coin_hold.png"
      densities="1x 2x"
    />
    <div class="mt-[40px] w-full flex justify-around inner-glowing-box text-[16px]">
      <div class="flex flex-col items-center space-y-[16px]">
        <p>T1/T2 {{ t('friends') }}</p>
        <USkeleton
          v-if="!user"
          class="h-[24px] w-[48px]"
        />
        <span
          v-else
          id="data-text"
        >{{ user?.inviterL1Count ?? 0 }} / {{ user?.inviterL2Count ?? 0 }}</span>
      </div>

      <div class="flex flex-col items-center space-y-[16px]">
        <p>{{ t('totalStaking') }}</p>
        <USkeleton
          v-if="!user"
          class="h-[24px] w-[48px]"
        />
        <span
          v-else
          id="data-text"
        >{{ Number(user?.inviterStakingAmount).toLocaleString() }}</span>
      </div>
      <div class="flex flex-col items-center space-y-[16px]">
        <p>{{ t('totalRebates') }}</p>
        <USkeleton
          v-if="!user"
          class="h-[24px] w-[48px]"
        />
        <span
          v-else
          id="data-text"
        >
          {{ user.rebateWithdrawAmount.toLocaleString() }}
        </span>
      </div>
    </div>
    <div class="mt-[28px] w-full flex justify-between items-center px-[10px] py-[5px] border rounded-[4px] text-[14px]">
      <p>{{ t('invitationLink') }}: </p>
      <div class="flex items-center space-x-[8px]">
        <USkeleton
          v-if="!user"
          class="h-[24px] w-[350px]"
        />
        <a
          v-else
          :href="`https://rebate.bool.network/invite?code=${user?.userInvitationCode}`"
          class="text-primary-500"
        >
          https://rebate.bool.network/invite?code={{ user?.userInvitationCode }}
        </a>
        <UButton
          variant="outline"
          color="black"
          class="p-[4px] rounded-[4px]"
          @click="onCopy"
        >
          <NuxtImg
            src="images/icon_copy_white.png"
            densities="1x 2x"
            height="18"
            width="18"
          />
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
