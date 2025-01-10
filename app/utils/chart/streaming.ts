import type {
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from 'public/charting_library';
import { gunzip } from 'fflate';
import { rangeParams, resolutionType } from './helpers';

export class WebSocketClient {
  socket = () => window.ws;
  handler?: { id: string; callback: SubscribeBarsCallback };

  timer: NodeJS.Timeout | undefined;
  subscriberId: string | undefined;

  init() {
    this.socket().addEventListener('open', () => {
      console.log('tv: [socket] Connected');
    });

    this.socket().addEventListener('close', (reason) => {
      console.log('tv: [socket] Disconnected:', reason);
    });

    this.socket().addEventListener('error', (error) => {
      console.log('tv: [socket] Error:', error);
    });

    this.socket().addEventListener('message', async (event) => {
      const arrayBuffer = await event.data.arrayBuffer();
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
      if (!result.dataIndexs.includes(2)) {
        return;
      }
      const data = result.statistic?.[0];
      if (!data) {
        return;
      }
      const bar = {
        time: Number(data.time),
        open: Number(data.openPrice),
        high: Number(data.highPrice),
        low: Number(data.lowPrice),
        close: Number(data.closePrice),
        volume: Number(data.tradeAmount), // pass to show volume bars
      };
      // send data to every subscriber of that symbol
      this.handler?.callback(bar);
    });
  }

  subscribeOnStream(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscriberUID: string,
  ) {
    console.log('tv: [subscribeOnStream]: Method call with subscriberUID:', { symbolInfo });
    this.handler = {
      id: subscriberUID,
      callback: onRealtimeCallback,
    };
    this.init();
    this.timer = setInterval(
      () => {
        if (this.socket().readyState === WebSocket.OPEN) {
          const subRequest = {
            ...rangeParams(resolution),
            type: resolutionType(resolution),
          };
          this.socket().send(JSON.stringify(subRequest));
        }
      }, 500,
    );
  }

  close() {
    // window.clearInterval(this.timer);
  }
}
