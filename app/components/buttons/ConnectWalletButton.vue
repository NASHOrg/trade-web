<script setup lang="ts">
import { BindCodeModal } from '#components';

const { open, address } = useWallet();
const { $localePath } = useNuxtApp();
const router = useRouter();
const { disconnect } = useWallet();
const { clearToken } = useToken();
const { $authApi } = useNuxtApp();

const { userToken } = useToken();
const { data: user } = useAsyncData(
  'user',
  async () => {
    if (!userToken.value) return Promise.resolve(null);
    return $authApi.userUser({}, userToken.value);
  },
  {
    lazy: false,
    watch: [userToken],
    server: false,
  },
);

const options = computed(() => {
  const menus = [
    [
      {
        label: 'Account',
        icon: 'i-icon-park-outline-data',
        click: () => {
          router.push($localePath({ path: '/account' }));
        },
      },
    ],
    [
      {
        label: 'Disconnect',
        icon: 'i-material-symbols-logout',
        click: async () => {
          const _address = address.value;
          disconnect();
          await new Promise(resolve => setTimeout(resolve, 200));
          clearToken(_address!);
        },
      },
    ],
  ];
  if (user.value && !user.value.userInvitationAddress) {
    menus.unshift([
      {
        label: 'Bind Inviter',
        icon: 'i-prime-sparkles',
        click: async () => {
          const modal = useModal();
          modal.open(BindCodeModal);
        },
      },
    ]);
  }
  return menus;
});
</script>

<template>
  <div>
    <UDropdown
      v-if="address"
      :items="options"
      :popper="{ placement: 'bottom-start' }"
    >
      <div
        class="flex border-[1px] border-primary rounded-[4px] px-[8px] py-[6px] space-x-[8px] bg-transparent cursor-pointer items-center"
      >
        <NuxtPicture
          src="https://bool.network/bool-network-orange.png"
          densities="1x 2x"
          height="18"
          width="18"
          class="rounded-full overflow-hidden"
        />
        <div class="flex items-center text-xs leading-none">
          <p>{{ shortAddress(address, 4) }}</p>
          <UIcon
            name="i-icon-park-solid-down-one"
            class="left-[2px] bg-[#999999]"
          />
        </div>
      </div>
    </UDropdown>

    <UButton
      v-show="!address"
      class="h-[30px] text-sm leading-6 font-normal px-[10px]"
      :ui="{ rounded: 'rounded-[4px]' }"
      @click="open"
    >
      {{ $t("connect") }}
    </UButton>
  </div>
</template>
