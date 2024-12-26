import type {
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from 'public/charting_library';
import { rangeParams, resolutionType } from './helpers';

export class WebSocketClient {
  constructor(socket: WebSocket, gunzip: any) {
    this.socket = socket;
    this.gunzip = gunzip;
    this.init();
  }

  socket: WebSocket;
  gunzip: any;

  channelToSubscription: any = new Map();

  init() {
    this.socket.addEventListener('open', () => {
      console.log('tv: [socket] Connected');
    });

    this.socket.addEventListener('close', (reason) => {
      console.log('tv: [socket] Disconnected:', reason);
    });

    this.socket.addEventListener('error', (error) => {
      console.log('tv: [socket] Error:', error);
    });

    this.socket.addEventListener('message', async (event) => {
      const arrayBuffer = await event.data.arrayBuffer();
      // Decompress gzipped data
      // @ts-expect-error ignore type error
      const decodedData = await new Promise((resolve, reject) => this.gunzip(new Uint8Array(arrayBuffer), (err, decompressed) => {
        if (err) reject(err);
        const decoder = new TextDecoder('utf-8');
        resolve(decoder.decode(decompressed));
      })).catch((err) => {
        console.log(err);
        return;
      });
      const result = JSON.parse(decodedData as string);
      if (!result.dataIndexs.includes(2)) {
        return;
      }
      const data = result.statistic[0];
      console.log('tv: [socket] Message:', data);
      const channelString = `0~XBIT~TBOL/USDC`;
      const subscriptionItem = this.channelToSubscription.get(channelString);
      if (subscriptionItem === undefined) {
        return;
      }
      const bar = {
        time: Number(data.time),
        open: Number(data.openPrice),
        high: Number(data.highPrice),
        low: Number(data.lowPrice),
        close: Number(data.closePrice),
      };
      console.log('tv: [socket] Generate new bar', bar);
      // send data to every subscriber of that symbol
      subscriptionItem.handlers.forEach((handler: any) => handler.callback(bar));
    });
  }

  subscribeOnStream(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void,
    lastDailyBar: any,
  ) {
    console.log('tv: [subscribeOnStream]: Method call with subscriberUID:', { symbolInfo });
    const channelString = `0~${symbolInfo?.exchange}~${symbolInfo.name}`;
    const handler = {
      id: subscriberUID,
      callback: onRealtimeCallback,
    };
    let subscriptionItem = this.channelToSubscription.get(channelString);
    if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
      subscriptionItem.handlers.push(handler);
      return;
    }
    subscriptionItem = {
      subscriberUID,
      resolution,
      lastDailyBar,
      handlers: [handler],
    };
    this.channelToSubscription.set(channelString, subscriptionItem);
    setInterval(
      () => {
        const subRequest = {
          ...rangeParams(resolution),
          type: resolutionType(resolution),
        };
        console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
        console.log('tv: [subscribeOnStream]: Send subscription request', subRequest);
        this.socket.send(JSON.stringify(subRequest));
      }, 2000,
    );
  }

  unsubscribeFromStream(subscriberUID: string) {
  // find a subscription with id === subscriberUID

    for (const channelString of this.channelToSubscription.keys()) {
      const subscriptionItem = this.channelToSubscription.get(channelString);
      const handlerIndex = subscriptionItem.handlers.findIndex(
        (handler: any) => handler.id === subscriberUID,
      );

      if (handlerIndex !== -1) {
      // remove from handlers
        subscriptionItem.handlers.splice(handlerIndex, 1);

        if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
          console.log('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString);
          const subRequest = {
            action: 'SubRemove',
            subs: [channelString],
          };
          this.socket.send(JSON.stringify(subRequest));
          this.channelToSubscription.delete(channelString);
          break;
        }
      }
    }
  }
}
