<script setup lang="ts">
import { toast } from 'vue-sonner';

const { $authApi } = useNuxtApp();
const { address } = useWallet();
const { userToken } = useToken();
const route = useRoute();
const referral = route.query.ref as string | undefined;
const input = ref(referral);
const modal = useModal();

const isLoading = ref(false);
async function onBind() {
  if (!address.value) {
    onCancel();
    return;
  }
  if (!input.value) {
    return;
  }
  try {
    isLoading.value = true;
    await $authApi.userBindInviterPost({
      invitationCode: input.value,
    }, userToken.value);
    modal.close();
    refreshNuxtData('user');
    toast.success('Bind successfully');
    return;
  }
  catch (error: any) {
    console.log({ error: error.message });
    toast.error(error.message);
  }
  finally {
    isLoading.value = false;
  }
}

function onCancel() {
  modal.close();
}
</script>

<template>
  <UModal prevent-close>
    <div class="py-[48px] px-[28px] flex flex-col justify-center text-white">
      <div class="inline-flex items-center">
        <span class="text-[28px] font-bold text-primary">Bind Inviter</span>
        <div
          class="h-fit rounded-full py-1 px-4 bg-gray-600 text-white text-center text-[14px] ms-4"
        >
          {{ shortAddress(address ?? "") }}
        </div>
      </div>
      <div
        class="flex flex-col mt-4"
      >
        <label
          for="referral"
          class="w-full flex flex-row justify-between"
        >
          <span class="font-semibold">Invitation Code</span>
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
            class="h-[40px] rounded-full border ring-0 text-sm font-medium text-white"
            color="white"
            size="md"
            @click="onCancel"
          >
            Cancel
          </UButton>
          <UButton
            block
            class="h-[40px] rounded-full border-0 ring-0 text-sm font-medium text-white"
            :loading="isLoading"
            size="md"
            :disabled="!input"
            @click="onBind"
          >
            Bind
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>
