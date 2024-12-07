import React from 'react';
import { LineChart } from 'lucide-react';
import Widget from '../Widget/Widget';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mockPriceData } from '../../utils/mockData';

const PricePanel: React.FC = () => {
  return (
    <Widget
      id="price"
      title="XRP/USD Price"
      icon={LineChart}
      defaultPosition={{ x: 360, y: window.innerHeight - 380 }}
      defaultSize={{ width: 800, height: 300 }}
    >
      <div className="h-full w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-primary font-medium">24h Price Chart</span>
          <span className="text-2xl font-bold text-primary">$0.60</span>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockPriceData['1D']}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                stroke="#FFD700"
              />
              <YAxis
                stroke="#FFD700"
                domain={['dataMin - 0.01', 'dataMax + 0.01']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1B26',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '8px'
                }}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={(value: number) => [`$${value.toFixed(3)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#FFD700"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Widget>
  );
};

export default PricePanel;