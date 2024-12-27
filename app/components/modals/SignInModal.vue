<script setup lang="ts">
import { toast } from 'vue-sonner';

const isLoading = ref(false);
const { $api } = useNuxtApp();
const { signMessage, address, disconnect, open: openWalletModal } = useWallet();
const route = useRoute();
const modal = useModal();

const referral = route.query.ref as string | undefined;
const input = ref(referral);

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
    const { setToken } = useToken();
    const message = await $api.userMsgToLogin({});
    const signature = await signMessage(message);
    if (!data.value && input.value) {
      const response = await $api.userUserLoginPost({
        address: address.value!,
        message,
        signature: signature!,
        invitationCode: input.value,
      });
      setToken(response);
      // localStorage.setItem('tokens', JSON.stringify(tokens));
      // store.token = response;
      modal.close();
      return;
    }
    const response = await $api.userUserLoginPost({
      address: address.value!,
      signature: signature!,
      message,
    });
    setToken(response);
    // localStorage.setItem('tokens', JSON.stringify(tokens));
    // store.token = response;
    modal.close();
  }
  catch (error: any) {
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

function cancel() {
  openWalletModal();
  disconnect();
  modal.close();
}
</script>

<template>
  <UModal prevent-close>
    <div class="py-[48px] px-[28px] flex flex-col justify-center">
      <div class="inline-flex items-center">
        <span class="text-[28px] font-bold text-primary">Sign In</span>
        <div
          class="h-fit rounded-full py-1 px-4 bg-gray-600 text-white text-center text-[14px] ms-4"
        >
          {{ shortAddress(address ?? "") }}
        </div>
      </div>
      <div class="text-[18px] mt-4 text-white dark:text-white leading-6">
        Sign this message to prove you own this wallet and proceed.
      </div>

      <div
        v-show="data === false"
        class="flex flex-col mt-4 text-white"
      >
        <label
          for="referral"
          class="w-full flex flex-row justify-between"
        >
          <span class="font-semibold">Invitation Code (optional)</span>
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
            color="white"
            class="h-[40px] rounded-full border ring-0 text-sm font-medium text-white"
            size="md"
            @click="cancel"
          >
            Change Wallet
          </UButton>
          <UButton
            block
            :loading="isLoading"
            class="h-[40px] rounded-full border-0 ring-0 text-sm font-medium"
            size="md"
            @click="signIn"
          >
            Sign In
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>
