import { defineStore } from 'pinia';
import type { UserUser } from '~/types/swagger';

export const useUserStore = defineStore('user-store', () => {
  const nuxtApp = useNuxtApp();
  const router = useRouter();
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
      await refreshUser();
    }
  });

  const user = ref<UserUser | undefined>(undefined);
  async function refreshUser() {
    if (!token.value) return;
    user.value = await nuxtApp.$api.userUser({ tgId: '' }, token.value);
    if (useRoute().path === '/') {
      navigateTo('/trade');
    }
  }

  function logout() {
    // const { address, disconnect } = useWallet();
    // const tokens = JSON.parse(localStorage.getItem("tokens") ?? "{}");
    // if (address.value) {
    //   tokens[address.value] = undefined;
    //   localStorage.setItem("tokens", JSON.stringify(tokens));
    //   disconnect();
    // }
    // token.value = undefined;
    // user.value = undefined;
    // navigateTo("/");
  }

  return {
    currentNetwork,
    networks,
    token,
    user,
    changeNetwork,
    refreshUser,
    logout,
  };
});
