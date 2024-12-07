import { bitfinexService } from './bitfinex';
import { bitstampService } from './bitstamp';
import { krakenService } from './kraken';
import { PriceData } from './types';

export type ExchangeName = 'Bitfinex' | 'Bitstamp' | 'Kraken';

class ExchangeManager {
  private static instance: ExchangeManager;
  private currentExchange: ExchangeName = 'Bitfinex';
  private priceHistory: Map<ExchangeName, PriceData[]> = new Map();
  private readonly MAX_HISTORY = 1000; // Keep last 1000 data points

  private constructor() {
    this.setupExchanges();
  }

  static getInstance(): ExchangeManager {
    if (!ExchangeManager.instance) {
      ExchangeManager.instance = new ExchangeManager();
    }
    return ExchangeManager.instance;
  }

  private setupExchanges(): void {
    // Initialize price history for each exchange
    this.priceHistory.set('Bitfinex', []);
    this.priceHistory.set('Bitstamp', []);
    this.priceHistory.set('Kraken', []);

    // Set up price handlers
    bitfinexService.on('price', (data) => this.handlePrice('Bitfinex', data));
    bitstampService.on('price', (data) => this.handlePrice('Bitstamp', data));
    krakenService.on('price', (data) => this.handlePrice('Kraken', data));
  }

  private handlePrice(exchange: ExchangeName, data: PriceData): void {
    const history = this.priceHistory.get(exchange) || [];
    history.push(data);
    
    // Keep only the last MAX_HISTORY data points
    if (history.length > this.MAX_HISTORY) {
      history.shift();
    }
    
    this.priceHistory.set(exchange, history);
  }

  setExchange(exchange: ExchangeName): void {
    this.currentExchange = exchange;
  }

  getCurrentExchange(): ExchangeName {
    return this.currentExchange;
  }

  getPriceHistory(exchange: ExchangeName): PriceData[] {
    return this.priceHistory.get(exchange) || [];
  }

  getLastPrice(exchange: ExchangeName): PriceData | null {
    const history = this.priceHistory.get(exchange);
    return history ? history[history.length - 1] : null;
  }

  connect(): void {
    bitfinexService.connect();
    bitstampService.connect();
    krakenService.connect();
  }

  disconnect(): void {
    bitfinexService.disconnect();
    bitstampService.disconnect();
    krakenService.disconnect();
  }
}

export const exchangeManager = ExchangeManager.getInstance();