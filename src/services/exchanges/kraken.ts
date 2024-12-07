import { EventEmitter } from '../../utils/EventEmitter';
import { PriceData, ExchangeService } from './types';

class KrakenService extends EventEmitter implements ExchangeService {
  private static instance: KrakenService;
  private ws: WebSocket | null = null;
  private lastData: PriceData | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly RECONNECT_DELAY = 5000;
  private readonly MAX_RETRIES = 3;
  private retryCount = 0;

  private constructor() {
    super();
  }

  static getInstance(): KrakenService {
    if (!KrakenService.instance) {
      KrakenService.instance = new KrakenService();
    }
    return KrakenService.instance;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      console.log('Connecting to Kraken WebSocket...');
      this.ws = new WebSocket('wss://ws.kraken.com');

      this.ws.onopen = () => {
        console.log('Connected to Kraken');
        this.retryCount = 0;
        this.subscribe();
      };

      this.ws.onmessage = this.handleMessage.bind(this);

      this.ws.onclose = () => {
        console.log('Disconnected from Kraken');
        this.cleanup();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Kraken WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to connect to Kraken:', error);
      this.scheduleReconnect();
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      if (Array.isArray(data) && data[2] === 'ticker') {
        const ticker = data[1];
        const priceData: PriceData = {
          timestamp: Date.now(),
          lastPrice: Number(ticker.c[0]),
          volume: Number(ticker.v[1]), // 24h volume
          open: Number(ticker.o[0]),
          high: Number(ticker.h[1]), // 24h high
          low: Number(ticker.l[1]), // 24h low
          close: Number(ticker.c[0]),
          vwap: Number(ticker.p[1]), // 24h vwap
          bid: Number(ticker.b[0]),
          ask: Number(ticker.a[0]),
          numTrades: Number(ticker.t[1]), // 24h trades
          exchange: 'Kraken'
        };

        this.lastData = priceData;
        this.emit('price', priceData);
      }
    } catch (error) {
      console.error('Error processing Kraken data:', error);
      this.emit('error', error);
    }
  }

  private subscribe(): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({
      event: 'subscribe',
      pair: ['XRP/USD'],
      subscription: { name: 'ticker' }
    }));
  }

  private cleanup(): void {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.onopen = null;
      this.ws = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return;

    this.retryCount++;
    if (this.retryCount > this.MAX_RETRIES) {
      this.emit('error', new Error('Failed to connect to Kraken after maximum retries'));
      return;
    }

    const delay = this.RECONNECT_DELAY * Math.pow(2, this.retryCount - 1);
    console.log(`Scheduling Kraken reconnect in ${delay}ms`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, delay);
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.close();
    }

    this.cleanup();
  }

  getLastData(): PriceData | null {
    return this.lastData;
  }
}

export const krakenService = KrakenService.getInstance();