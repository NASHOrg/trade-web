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
  handler?: { id: string; callback: SubscribeBarsCallback };

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
      const data = result.statistic?.[0];
      if (!data) {
        return;
      }
      console.log('tv: [socket] Message:', data);
      const bar = {
        time: Number(data.time),
        open: Number(data.openPrice),
        high: Number(data.highPrice),
        low: Number(data.lowPrice),
        close: Number(data.closePrice),
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
    const timer = setInterval(
      () => {
        console.log('tv: [subscribeOnStream]', this.socket.readyState);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          const subRequest = {
            ...rangeParams(resolution),
            type: resolutionType(resolution),
          };
          console.log('tv: [subscribeOnStream]: Send subscription request', subRequest);
          this.socket.send(JSON.stringify(subRequest));
        }
        else {
          window.clearInterval(timer);
        }
      }, 1000,
    );
  }
}
