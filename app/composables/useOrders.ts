import { useStorage } from '@vueuse/core';
import type { Order } from '~/types/common';

type SavedOrder = Order & { verified?: boolean };
export function useOrders() {
  const { address } = useWallet();
  const _orders = useStorage<{ [key: string]: SavedOrder[] }>('xbit-orders', {});
  const _cancelledOrders = useStorage<{ [key: string]: string[] }>('xbit-cancelled-orders', {});
  function addOrder(tx: SavedOrder) {
    if (!address.value) return;
    _orders.value[address.value] = [tx, ..._orders.value[address.value] ?? []];
  };
  function addCancelledOrder(orderId: string) {
    if (!address.value) return;
    _cancelledOrders.value[address.value] = Array.from(new Set([orderId, ..._cancelledOrders.value[address.value] ?? []]));
  };

  const orders = computed(() => {
    if (!address.value) return [];
    return _orders.value[address.value] ?? [];
  });

  const removeOrders = (hashes: string[]) => {
    if (!address.value) return;
    console.log(hashes);
    _orders.value[address.value] = _orders.value[address.value]?.filter(order => !hashes.includes(order.txHash)) ?? [];
  };

  const cancelledOrders = computed(() => {
    if (!address.value) return [];
    return _cancelledOrders.value[address.value] ?? [];
  });

  return {
    orders,
    cancelledOrders,
    addOrder,
    addCancelledOrder,
    removeOrders,
  };
}
