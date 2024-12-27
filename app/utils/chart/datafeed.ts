import type {
  Bar,
  DatafeedErrorCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolutionString,
  PeriodParams,
  ResolveCallback,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
} from 'public/charting_library/charting_library';
import {
  getAllSymbols,
  makeApiRequest,
  resolutionType,
} from './helpers';
import {
  WebSocketClient,
} from './streaming';

const configurationData = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: ['1', '15', '60', '1D', '1M'] as ResolutionString[],

  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [{
    value: 'XBIT',
    name: 'XBIT',
    desc: 'XBIT',
  },
  ],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{
    name: 'crypto',
    value: 'crypto',
  }],
};

const lastBarsCache = new Map();

export const datafeed = (socket: WebSocket, gunzip: any): IBasicDataFeed => ({
  onReady: (callback: OnReadyCallback) => {
    console.log('tv: [onReady]: Method call');
    callback(configurationData);
  },

  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback,
  ) => {
    console.log('tv: [searchSymbols]: Method call', symbolType);
    const symbols = await getAllSymbols();

    const newSymbols: SearchSymbolResultItem[] = symbols.filter((symbol: any) => {
      const isExchangeValid = exchange === '' || symbol.exchange === exchange;
      const isFullSymbolContainsInput
        = symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });

    onResult(newSymbols);
  },

  resolveSymbol: async (
    symbolName: string,
    onResolve: ResolveCallback,
    onError: DatafeedErrorCallback,
    extension?: SymbolResolveExtension,
  ) => {
    console.log('tv: [resolveSymbol]: Method call', { symbolName, extension });
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(
      (symbol: any) => symbol.full_name === symbolName,
    );
    if (!symbolItem) {
      // console.log("tv: [resolveSymbol]: Cannot resolve symbol", { symbolName });
      onError(
        'tv: [resolveSymbol]: err Cannot resolve symbol',
      );
      return;
    }

    console.log('tv: symbolItem ', symbolItem);
    console.log('tv: symbolName ', Intl.DateTimeFormat().resolvedOptions().timeZone);

    const symbolInfo: LibrarySymbolInfo = {
      name: symbolItem.symbol,
      ticker: symbolItem.ticker,
      description: symbolItem.description,
      type: symbolItem.type,
      session: '24x7',
      has_intraday: true,
      exchange: symbolItem.exchange,
      listed_exchange: 'XBIT',
      timezone: 'Etc/UTC',
      format: 'price',
      pricescale: 100000,
      minmov: 4,
      has_weekly_and_monthly: true,
      supported_resolutions:
        configurationData.supported_resolutions as ResolutionString[],
      volume_precision: 4,
      data_status: 'streaming',
      has_ticks: true,
    };

    // console.log("tv: [resolveSymbol]: Symbol resolved", { symbolName });
    onResolve(symbolInfo);
  },

  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback,
  ) => {
    const { from, to, firstDataRequest } = periodParams;

    console.log('tv: [getBars]: Method call', symbolInfo, resolution, { from, to });

    const urlParameters = {
      pair: symbolInfo.name,
      start: from * 1000,
      end: to * 1000,
      type: resolutionType(resolution),
    };
    const query = Object.keys(urlParameters)
      // @ts-expect-error ignore type error
      .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join('&');

    try {
      const data = await makeApiRequest(`bool-stake-reward/blockchain/trade-statistic?${query}`);
      if (
        (data.msg && data.msg === 'Error')
        || (data.data?.length ?? 0) === 0
      ) {
        // "noData" should be set if there is no data in the requested period.
        onResult([], {
          noData: true,
        });
        return;
      }

      const bars: Bar[] = data.data.reverse().map((bar: any) => ({
        time: Number(bar.time),
        low: Number(bar.lowPrice),
        high: Number(bar.highPrice),
        open: Number(bar.openPrice),
        close: Number(bar.closePrice),
        volume: Number(bar.tradeAmount), // pass to show volume bars
      }));
      console.log('tv: [getBars]: bar data', { bars });

      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.name, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`tv: [getBars]: returned ${bars.length} bar(s)`);

      onResult(bars, {
        noData: false,
      });
    }
    catch (error: any) {
      console.log('tv: [getBars]: Get error', error);
      onError('tv: [getBars]: Get error');
    }
  },

  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void,
  ) => {
    console.log('tv: [subscribeBars]: Method call with listenerGuid:', listenerGuid);
    new WebSocketClient(socket, gunzip).subscribeOnStream(
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.name),
    );
  },

  unsubscribeBars: (subscriberUID: string) => {
    console.log('tv: [unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    // new WebSocketClient().unsubscribeFromStream(subscriberUID);
  },
});
