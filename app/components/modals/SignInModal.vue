<script setup lang="ts">
import { toast } from 'vue-sonner';

const store = useUserStore();
const loading = ref(false);
const { $api } = useNuxtApp();
const { signMessage, address, open, disconnect } = useWallet();
const route = useRoute();
const checked = ref(true);
const input = ref('');
const modal = useModal();

const referral = route.query.ref as string | undefined;

const { data } = useAsyncData(
  async () => {
    return true;
  },
  {
    watch: [address],
  },
);

async function signIn() {
  if (!address.value) {
    cancel();
    return;
  }
  if (
    data.value === false
    && input.value
    && input.value.length !== 4
    && input.value.length !== 5
  ) {
    toast.error('The referral code is invalid, please check the referral code');
    return;
  }
  if (
    data.value === false
    && referral
    && referral.length !== 4
    && referral.length !== 5
  ) {
    toast.error('The referral code is invalid, please check the referral link');
    return;
  }
  try {
    loading.value = true;
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
      store.token = response;
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
    store.token = response;
    modal.close();
  }
  catch (error: any) {
    // disconnect()
    if ('message' in error && error.message) {
      handleJsonRpcError(error, toast);
    }
  }
  finally {
    loading.value = false;
  }
}

function cancel() {
  disconnect();
  open();
  modal.close();
}
</script>

<template>
  <UModal
    prevent-close
  >
    <div class="py-[48px] p-[20px] flex flex-col justify-center">
      <div class="flex flex-row item-center">
        <span class="text-[24px] font-bold">Sign In</span>
        <div
          class="h-fit rounded-full py-1 px-4 bg-neutral text-center text-[14px] ml-4"
        >
          {{ shortAddress(address ?? '') }}
        </div>
      </div>

      <div class="text-[18px]">
        Verify wallet ownership to access xbit.
      </div>
      <div
        v-if="!referral && data === false"
        class="flex flex-col"
      >
        <label
          for="referral"
          class="w-full flex flex-row justify-between"
        ><span>Referral Code</span>
          <div class="text-[12px]">Optional</div></label>
        <input
          id="referral"
          v-model="input"
          class="input input-sm rounded-[8px] px-[10px] py-[5px] mt-[10px] text-white"
          placeholder="Please input the referral code"
        >
      </div>
      <span
        v-if="referral && data === false"
        class="text-[16px] text-white flex flex-row items-center"
      >
        <input
          v-model="checked"
          type="checkbox"
          class="checkbox mr-2"
        >
        <span>
          Bind the code
          <span class="text-primary font-bold">{{ referral }}</span> as your
          invitation.
        </span>
      </span>
      <div class="w-full text-center pt-[20px]">
        <div class="grid grid-cols-2 gap-[20px] mt-[16px]">
          <UButton
            block
            coloe="gray"
            class="rounded-full"
            @click="cancel"
          >
            Change Wallet
          </UButton>
          <UButton
            block
            class="rounded-full"
            @click="signIn"
          >
            <span
              v-if="loading"
              class="loading loading-spinner w-[20px]"
            />
            Sign In
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>
