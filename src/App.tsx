import React from 'react';
import MainLayout from './components/Layout/MainLayout';
import WalletPanel from './components/Wallet/WalletPanel';
import GraphPanel from './components/Graph/GraphPanel';
import PricePanel from './components/Price/PricePanel';
import MarketPanel from './components/Marketplace/MarketPanel';
import ChatWidget from './components/Chat/ChatWidget';
import { useWidgetStore } from './store/widgetStore';

const App: React.FC = () => {
  const { widgets, updateWidget } = useWidgetStore();

  React.useEffect(() => {
    if (!widgets.length) {
      // Initialize default widget positions
      updateWidget({
        id: 'wallet',
        isVisible: true,
        x: 20,
        y: 80,
        width: 320,
        height: 400,
        zIndex: 1
      });

      updateWidget({
        id: 'graph',
        isVisible: true,
        x: 360,
        y: 80,
        width: 1000,
        height: 600,
        zIndex: 1
      });

      updateWidget({
        id: 'price',
        isVisible: true,
        x: 360,
        y: window.innerHeight - 380,
        width: 1000,
        height: 350,
        zIndex: 1
      });

      updateWidget({
        id: 'market',
        isVisible: false,
        x: 360,
        y: 80,
        width: 1000,
        height: 600,
        zIndex: 1
      });

      updateWidget({
        id: 'chat',
        isVisible: false,
        x: window.innerWidth - 340,
        y: 80,
        width: 320,
        height: 400,
        zIndex: 1
      });
    }
  }, []);

  return (
    <MainLayout>
      {widgets.find(w => w.id === 'wallet')?.isVisible && <WalletPanel />}
      {widgets.find(w => w.id === 'graph')?.isVisible && <GraphPanel />}
      {widgets.find(w => w.id === 'price')?.isVisible && <PricePanel />}
      {widgets.find(w => w.id === 'market')?.isVisible && <MarketPanel />}
      {widgets.find(w => w.id === 'chat')?.isVisible && <ChatWidget />}
    </MainLayout>
  );
};

export default App;