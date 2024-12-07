import React, { useEffect, useState, useCallback, useRef } from 'react';
import { LineChart as ChartIcon, TrendingUp, TrendingDown } from 'lucide-react';
import Widget from '../Widget/Widget';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { exchangeManager, ExchangeName } from '../../services/exchanges';
import { PriceData } from '../../services/exchanges/types';

const exchanges: ExchangeName[] = ['Bitfinex', 'Bitstamp', 'Kraken'];

const PricePanel: React.FC = () => {
  const [selectedExchange, setSelectedExchange] = useState<ExchangeName>('Bitfinex');
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<PriceData | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timer>();

  const updatePriceData = useCallback(() => {
    const history = exchangeManager.getPriceHistory(selectedExchange);
    const lastPrice = exchangeManager.getLastPrice(selectedExchange);
    
    if (history.length > 0) {
      setPriceData([...history]); // Create new array to force update
    }
    
    if (lastPrice) {
      setCurrentPrice(lastPrice);
    }
  }, [selectedExchange]);

  useEffect(() => {
    // Connect to all exchanges
    exchangeManager.connect();

    return () => {
      exchangeManager.disconnect();
    };
  }, []);

  useEffect(() => {
    // Clear existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    // Clear existing data when changing exchanges
    setPriceData([]);
    setCurrentPrice(null);
    
    // Initial update
    updatePriceData();

    // Set up new interval
    updateIntervalRef.current = setInterval(updatePriceData, 1000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [selectedExchange, updatePriceData]);

  const handleExchangeChange = (exchange: ExchangeName) => {
    setSelectedExchange(exchange);
    exchangeManager.setExchange(exchange);
  };

  const formatValue = (value: number | undefined): string => {
    if (typeof value !== 'number' || isNaN(value)) return '0.0000';
    return value.toFixed(4);
  };

  const formatVolume = (volume: number | undefined): string => {
    if (typeof volume !== 'number' || isNaN(volume)) return '0';
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  return (
    <Widget
      id="price"
      title="XRP/USD Price"
      icon={ChartIcon}
      defaultPosition={{ x: 360, y: window.innerHeight - 380 }}
      defaultSize={{ width: 800, height: 400 }}
    >
      <div className="h-full w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-text/70">Exchange:</span>
            <div className="flex space-x-2">
              {exchanges.map((exchange) => (
                <button
                  key={exchange}
                  onClick={() => handleExchangeChange(exchange)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedExchange === exchange
                      ? 'bg-primary text-background'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {exchange}
                </button>
              ))}
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            ${formatValue(currentPrice?.lastPrice)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="text-sm text-text/70">24h Change</div>
            {currentPrice?.dailyChangePercent && !isNaN(currentPrice.dailyChangePercent) && (
              <div className={`flex items-center space-x-1 ${
                currentPrice.dailyChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {currentPrice.dailyChangePercent >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-lg font-bold">
                  {Math.abs(currentPrice.dailyChangePercent).toFixed(2)}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-sm text-text/70">24h Volume</div>
            {currentPrice?.volume && !isNaN(currentPrice.volume) && (
              <div className="text-lg font-bold text-primary">
                {formatVolume(currentPrice.volume)} XRP
              </div>
            )}
          </div>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                stroke="var(--primary)"
                minTickGap={50}
              />
              <YAxis
                stroke="var(--primary)"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `$${value.toFixed(4)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid rgba(var(--primary-rgb), 0.3)',
                  borderRadius: '8px'
                }}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="lastPrice"
                stroke="var(--primary)"
                fillOpacity={1}
                fill="url(#colorPrice)"
                isAnimationActive={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Widget>
  );
};

export default PricePanel;