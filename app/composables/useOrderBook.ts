import { gunzip } from 'fflate';
import type { BlockchainOrderBooks, BlockchainTradeHistory, BlockchainTradeStatistic } from '~/types/swagger';

export function useOrderBook() {
  // Don't run on server
  if (import.meta.server) return;

  const { currentPair, network } = useNetworkConfig();
  const orderbook = ref<BlockchainOrderBooks | null>(null);
  const orders = ref<BlockchainTradeHistory['items'] | null>(null);
  const chartData = ref<BlockchainTradeStatistic | null>(null);

  const { data, status, send, ws } = useSocket(() => `${network.ws}/order/${currentPair.value.label}`, {
    autoReconnect: {
      retries: 100,
    },
  });

  function updateChartData(params: { start: string; end: string; type: string }) {
    send(JSON.stringify(params));
  }

  watch(data, async () => {
    if (!data.value) {
      orderbook.value = null;
      orders.value = null;
    };
    const arrayBuffer = await data.value.arrayBuffer();
    // Decompress gzipped data
    const decodedData = await new Promise((resolve, reject) => gunzip(new Uint8Array(arrayBuffer), (err, decompressed) => {
      if (err) reject(err);
      const decoder = new TextDecoder('utf-8');
      resolve(decoder.decode(decompressed));
    })).catch((err) => {
      console.log(err);
      return;
    });
    const result = JSON.parse(decodedData as string);
    if (result.dataIndexs.includes(0)) {
      orderbook.value = result.book;
    }
    if (result.dataIndexs.includes(1)) {
      orders.value = result.trades;
    }
    if (result.dataIndexs.includes(2)) {
      chartData.value = result.statistic;
    }
  });

  return {
    orderbook,
    orders,
    chartData,
    status,
    ws,
    updateChartData,
  };
}
