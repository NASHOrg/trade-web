import { useStorage } from '@vueuse/core';
import type { BridgeHistory } from '~/types/common';

export function useBridgeHistory() {
  const history = useStorage<BridgeHistory[]>('xbit-bridge-history', []);
  function add(tx: BridgeHistory) {
    history.value = [tx, ...history.value];
  };
  return {
    history,
    add,
  };
}
