import { useStorage } from '@vueuse/core';
import type { BridgeHistory } from '~/types/common';

export function useBridgeHistory() {
  const history = useStorage<BridgeHistory[]>('bool-bot-bridge-history', []);
  const addresses = useStorage<string[]>('bool-bot-bridge-addresses', []);
  function add(tx: BridgeHistory) {
    history.value = [tx, ...history.value];
    if (tx.swapRecordSrcUserAddress)
      addresses.value = Array.from(new Set([tx.swapRecordSrcUserAddress, ...addresses.value]));
  };
  return {
    history,
    addresses,
    add,
  };
}
