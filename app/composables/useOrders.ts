import { useStorage } from '@vueuse/core';
import type { Order } from '~/types/common';

type SavedOrder = Order & { verified?: boolean; hash?: string };
export function useOrders() {
  const orders = useStorage<SavedOrder[]>('xbit-orders', []);
  const cancelledOrders = useStorage<string[]>('xbit-cancelled-orders', []);
  function addOrder(tx: SavedOrder) {
    orders.value = [tx, ...orders.value];
  };
  function addCancelledOrder(orderId: string) {
    cancelledOrders.value = [orderId, ...cancelledOrders.value];
  };

  return {
    orders,
    cancelledOrders,
    addOrder,
    addCancelledOrder,
  };
}
