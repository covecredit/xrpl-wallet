import { EventEmitter } from '../../utils/EventEmitter';
import { PriceData, ExchangeService } from './types';

class BitfinexService extends EventEmitter implements ExchangeService {
  private static instance: BitfinexService;
  private ws: WebSocket | null = null;
  private lastCandle: PriceData | null = null;
  private lastTicker: Partial<PriceData> | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly RECONNECT_DELAY = 5000;
  private readonly PING_INTERVAL = 30000;
  private readonly MAX_RETRIES = 3;
  private retryCount = 0;
  private channelIds: { [key: string]: number } = {};

  private constructor() {
    super();
  }

  static getInstance(): BitfinexService {
    if (!BitfinexService.instance) {
      BitfinexService.instance = new BitfinexService();
    }
    return BitfinexService.instance;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      console.log('Connecting to Bitfinex WebSocket...');
      this.ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

      this.ws.onopen = () => {
        console.log('Connected to Bitfinex');
        this.retryCount = 0;
        this.setupPingInterval();
        this.subscribe();
      };

      this.ws.onmessage = this.handleMessage.bind(this);

      this.ws.onclose = () => {
        console.log('Disconnected from Bitfinex');
        this.cleanup();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('Bitfinex WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to connect to Bitfinex:', error);
      this.scheduleReconnect();
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      if (data.event === 'subscribed') {
        this.channelIds[data.channel] = data.chanId;
        return;
      }

      if (data.event === 'error') {
        this.emit('error', new Error(data.msg));
        return;
      }

      if (Array.isArray(data)) {
        const [chanId, payload] = data;
        if (payload === 'hb') return;

        if (this.channelIds['candles'] === chanId) {
          this.handleCandleData(payload);
        }
        
        if (this.channelIds['ticker'] === chanId) {
          this.handleTickerData(payload);
        }
      }
    } catch (error) {
      console.error('Error processing Bitfinex data:', error);
      this.emit('error', error);
    }
  }

  private handleCandleData(payload: any): void {
    if (Array.isArray(payload) && Array.isArray(payload[0])) {
      const candles = payload.map(this.parseCandle);
      if (candles.length > 0) {
        this.lastCandle = { ...candles[0], ...this.lastTicker, exchange: 'Bitfinex' };
        this.emit('price', this.lastCandle);
      }
      return;
    }

    if (Array.isArray(payload)) {
      this.lastCandle = { ...this.parseCandle(payload), ...this.lastTicker, exchange: 'Bitfinex' };
      this.emit('price', this.lastCandle);
    }
  }

  private handleTickerData(payload: any): void {
    if (Array.isArray(payload)) {
      const [
        bid, , ask, , dailyChange, dailyChangePercent,
        lastPrice, volume, high, low
      ] = payload;

      this.lastTicker = {
        bid: Number(bid),
        ask: Number(ask),
        dailyChange: Number(dailyChange),
        dailyChangePercent: Number(dailyChangePercent) * 100,
        lastPrice: Number(lastPrice),
        volume: Number(volume),
        high: Number(high),
        low: Number(low)
      };

      if (this.lastCandle) {
        this.lastCandle = { ...this.lastCandle, ...this.lastTicker, exchange: 'Bitfinex' };
        this.emit('price', this.lastCandle);
      }
    }
  }

  private parseCandle(data: number[]): PriceData {
    const [mts, open, close, high, low, volume] = data;
    return {
      timestamp: mts,
      open: Number(open),
      close: Number(close),
      high: Number(high),
      low: Number(low),
      volume: Number(volume),
      exchange: 'Bitfinex'
    };
  }

  private setupPingInterval(): void {
    this.clearPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ event: 'ping' }));
      }
    }, this.PING_INTERVAL);
  }

  private clearPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private subscribe(): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({
      event: 'subscribe',
      channel: 'candles',
      key: 'trade:1m:tXRPUSD'
    }));

    this.ws.send(JSON.stringify({
      event: 'subscribe',
      channel: 'ticker',
      symbol: 'tXRPUSD'
    }));
  }

  private cleanup(): void {
    this.clearPingInterval();
    this.channelIds = {};
    this.lastTicker = null;
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
      this.emit('error', new Error('Failed to connect to Bitfinex after maximum retries'));
      return;
    }

    const delay = this.RECONNECT_DELAY * Math.pow(2, this.retryCount - 1);
    console.log(`Scheduling Bitfinex reconnect in ${delay}ms`);

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
    return this.lastCandle;
  }
}

export const bitfinexService = BitfinexService.getInstance();