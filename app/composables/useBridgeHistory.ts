import { useStorage } from '@vueuse/core';
import type { BridgeHistory } from '~/types/common';

export function useBridgeHistory() {
  const { address } = useWallet();
  const _history = useStorage<{ [key: string]: BridgeHistory[] }>('xbit-history', {});
  function add(tx: BridgeHistory) {
    if (!address.value) return;
    _history.value[address.value] = [tx, ...(_history.value[address.value] ?? [])];
  };
  const remove = (hashes: string[]) => {
    if (!address.value) return;
    _history.value[address.value] = _history.value[address.value]?.filter(record => !hashes.includes(record.swapRecordSrcChainHash)) ?? [];
  };

  const history = computed(() => {
    if (!address.value) return [];
    return _history.value[address.value] ?? [];
  });
  return {
    history,
    add,
    remove,
  };
}
