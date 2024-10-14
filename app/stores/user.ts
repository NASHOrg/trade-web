import { defineStore } from 'pinia';
import type { UserUser } from '~/types/swagger';

export const useUserStore = defineStore('user-store', () => {
  const nuxtApp = useNuxtApp();
  const router = useRouter();
  // const evmWallet = useWallet();
  const networks = networkApiConfig;

  const currentNetwork = computed<(typeof networks)[0]>(() => {
    const { currentRoute } = router;
    const network
            = currentRoute.value.query.network ?? nuxtApp.$config.public.network;

    return networks.find(item => item.network === network)!;
  });

  function changeNetwork(network: (typeof networks)[0]) {
    router.replace({ query: { network: network.network } });
  }

  const token = ref<string | undefined>(); // localStorage.getItem('token') ?? undefined
  watch(token, async (value) => {
    if (value) {
      await refreshUserState();
      // localStorage.setItem('token', value);
    }
  });

  // const {
  //   data: user,
  //   status: userRequestStatus,
  //   refresh: refreshUserState,
  // } = useAsyncData(
  //   'user',
  //   () => nuxtApp.$api.userUser({}, token.value),
  //   {
  //     server: false,
  //     lazy: true,
  //     immediate: token !== null,
  //     watch: [token],
  //     default: () => <UserUser>{ userAddress: evmWallet.address.value },
  //   },
  // );

  const user = ref<UserUser | undefined>(undefined);
  const userRequestProcessing = ref(false);
  async function refreshUserState() {
    userRequestProcessing.value = true;
    user.value = await nuxtApp.$api.userUser({}, token.value).finally(() => {
      userRequestProcessing.value = false;
    });
  }

  return {
    currentNetwork,
    networks,
    changeNetwork,
    token,
    user,
    userRequestProcessing,
    refreshUserState,
  };
});
