import { useStorage } from '@vueuse/core';
import type { BridgeHistory } from '~/types/common';

export function useBridgeHistory() {
  const { address } = useWallet();
  const _history = useStorage<{ [key: string]: BridgeHistory[] }>('xbit-bridge-history', {});
  function add(tx: BridgeHistory) {
    if (!address.value) return;
    _history.value[address.value] = [tx, ...(_history.value[address.value] ?? [])];
  };

  const history = computed(() => {
    if (!address.value) return [];
    return _history.value[address.value] ?? [];
  });
  return {
    history,
    add,
  };
}
