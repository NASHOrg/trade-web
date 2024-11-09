<script setup lang="ts">
import { toast } from 'vue-sonner';

// const store = useUserStore();
const isLoading = ref(false);
const { $api } = useNuxtApp();
const { signMessage, address, open, disconnect } = useWallet();
const route = useRoute();
const checked = ref(true);
const input = ref('');
const modal = useModal();

const referral = route.query.ref as string | undefined;

const { data } = useAsyncData(
  async () => {
    if (!address.value) return Promise.resolve(undefined);
    return $api.userCheck({ address: address.value });
  },
  {
    watch: [address],
    server: false,
  },
);

async function signIn() {
  if (!address.value) {
    cancel();
    return;
  }
  try {
    isLoading.value = true;
    const tokens = JSON.parse(localStorage.getItem('tokens') ?? '{}');
    const message = await $api.userMsgToLogin({});
    const signature = await signMessage(message);
    if (data.value === false && input.value) {
      const response = await $api.userUserLoginPost({
        address: address.value!,
        message,
        signature: signature!,
        invitationCode: input.value,
      });
      tokens[address.value!] = response;
      localStorage.setItem('tokens', JSON.stringify(tokens));
      // store.token = response;
      modal.close();
      return;
    }
    const response = await $api.userUserLoginPost({
      address: address.value!,
      signature: signature!,
      message,
      invitationCode: checked.value ? referral : undefined,
    });
    tokens[address.value!] = response;
    localStorage.setItem('tokens', JSON.stringify(tokens));
    // store.token = response;
    modal.close();
  }
  catch (error: any) {
    if ('message' in error && error.message) {
      handleJsonRpcError(error, toast);
    }
  }
  finally {
    isLoading.value = false;
  }
}

function cancel() {
  disconnect();
  open();
  modal.close();
}
</script>

<template>
  <UModal prevent-close>
    <div class="py-[48px] px-[66px] flex flex-col justify-center">
      <div class="flex flex-row item-center">
        <span class="text-[24px] font-bold text-primary">Sign In</span>
        <div
          class="h-fit rounded-full py-1 px-4 bg-gray-600 text-white text-center text-[14px] ml-4"
        >
          {{ shortAddress(address ?? "") }}
        </div>
      </div>

      <div class="mt-2 text-[18px]">
        {{ $t("verifyTip") }}
      </div>
      <div
        v-if="!referral && data !== true"
        class="flex flex-col mt-4"
      >
        <label
          for="referral"
          class="w-full flex flex-row justify-between"
        >
          <span class="font-semibold">{{ $t("referalCode") }}</span>
        </label>
        <UInput
          v-model="input"
          class="rounded-[8px] mt-[10px] text-white"
          size="md"
          placeholder="Please input the referral code"
        />
      </div>
      <div class="w-full text-center pt-[20px]">
        <div class="grid grid-cols-2 gap-[20px] mt-[16px]">
          <UButton
            block
            variant="outline"
            class="rounded-full"
            color="white"
            @click="cancel"
          >
            {{ $t("changeWallet") }}
          </UButton>
          <UButton
            block
            class="rounded-full"
            :loading="isLoading"
            @click="signIn"
          >
            {{ $t("signIn") }}
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>
