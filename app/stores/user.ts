import { defineStore } from 'pinia';

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

  return { currentNetwork, networks, changeNetwork };
});
