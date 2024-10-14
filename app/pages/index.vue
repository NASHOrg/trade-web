<script lang="ts" setup>
import { toast } from 'vue-sonner';

const { t } = useI18n();
const { $api } = useNuxtApp();
const { isConnected, address, signMessage } = useWallet();
const userStore = useUserStore();

const loginAttempted = ref<boolean>(false);

const noPermission = computed(() => loginAttempted.value && !userStore.token && isConnected.value);

const approveProcessing = ref<boolean>(false);

const inviteCodeField = ref<string>('');

/*
 * 签名并登录
 *
 * 1. 调用 $api.userMsgToLogin() 获取登录信息
 * 2. 调用 signMessage() 签名登录信息
 * 3. 调用 $api.userUserLoginPost() 登录
 * 4. 登录成功后，设置 token
 */
function signLoginMessage() {
  approveProcessing.value = true;
  $api.userMsgToLogin({})
    .then(loginMessage => signMessage(loginMessage)
      .catch((err) => {
        if (err instanceof Error) toast.error(err.message.substring(0, err.message.indexOf(' (')));
      })
      .then((signature) => {
        if (signature) {
          toast.success('Sign successfully, logging in...');
          $api
            .userUserLoginPost({
              signature,
              address: address.value!,
              message: loginMessage,
              invitationCode: inviteCodeField.value,
            })
            .then((res) => {
              if (res) {
                loginAttempted.value = true;
                userStore.token = res;
                navigateTo('/dashboard');
              }
            });
        }
      }))
    .finally(() => (approveProcessing.value = false));
}
</script>

<template>
  <div class="my-[30px] flex flex-col items-center justify-center">
    <NuxtImg
      src="images/shield_shape_lock.png"
      class="w-[203px] h-[200px]"
    />
    <p
      v-if="!isConnected"
      class="mt-[24px]"
    >
      Connect your wallet to login.
    </p>
    <p
      v-else-if="noPermission"
      class="mt-[24px]"
    >
      Sorry, you don't have enough permissions.
    </p>
    <div
      v-else
      class="mt-[24px] flex flex-col"
    >
      <p>Wallet connected. Approve the signing request to login.</p>
      <UInput
        v-model="inviteCodeField"
        :placeholder="t('inviteCode')"
        type="text"
        class="mt-8 mb-2"
      />
    </div>
    <UButton
      v-if="isConnected && !noPermission"
      :loading="approveProcessing"
      @click="signLoginMessage"
    >
      Open Approve Dialog
    </UButton>
  </div>
</template>
