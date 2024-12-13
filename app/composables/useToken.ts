import { useStorage } from '@vueuse/core';

export function useToken() {
  const { address } = useWallet();
  const tokens = useStorage<{ [key: string]: string | undefined }>('xbit-tokens', () => ({}));

  const userToken = computed(() => {
    if (!address.value) return;
    return tokens.value[address.value];
  });

  const setToken = (token?: string) => {
    if (!address.value) return;
    tokens.value[address.value] = token;
  };

  const clearToken = (address: string) => {
    tokens.value[address] = undefined;
  };

  return {
    userToken,
    setToken,
    clearToken,
  };
}
