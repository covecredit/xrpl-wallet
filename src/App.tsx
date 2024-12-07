import React, { useEffect } from 'react';
import MainLayout from './components/Layout/MainLayout';
import WalletPanel from './components/Wallet/WalletPanel';
import GraphPanel from './components/Graph/GraphPanel';
import PricePanel from './components/Price/PricePanel';
import MarketPanel from './components/Marketplace/MarketPanel';
import AccountHeader from './components/Header/AccountHeader';
import AppBar from './components/AppBar/AppBar';
import { useWidgetStore } from './store/widgetStore';

const App: React.FC = () => {
  const { widgets, updateWidget } = useWidgetStore();

  useEffect(() => {
    if (!widgets.length) {
      // Wallet widget - keep original size
      updateWidget({
        id: 'wallet',
        isVisible: true,
        x: 20,
        y: 80,
        width: 320,
        height: 400,
        zIndex: 1
      });

      // Chain Explorer - increased size to show graph and controls
      updateWidget({
        id: 'graph',
        isVisible: true,
        x: 360,
        y: 80,
        width: 1000,  // Increased from 800
        height: 600,  // Increased from 500
        zIndex: 1
      });

      // Price chart - increased width to match graph
      updateWidget({
        id: 'price',
        isVisible: true,
        x: 360,
        y: window.innerHeight - 380,
        width: 1000,  // Increased from 800
        height: 350,  // Increased from 300
        zIndex: 1
      });

      // Market panel - match graph size
      updateWidget({
        id: 'market',
        isVisible: false,
        x: 360,
        y: 80,
        width: 1000,  // Increased from 800
        height: 600,  // Increased from 500
        zIndex: 1
      });
    }
  }, []);

  return (
    <MainLayout>
      <AccountHeader />
      <AppBar />
      {widgets.find(w => w.id === 'wallet')?.isVisible && <WalletPanel />}
      {widgets.find(w => w.id === 'graph')?.isVisible && <GraphPanel />}
      {widgets.find(w => w.id === 'price')?.isVisible && <PricePanel />}
      {widgets.find(w => w.id === 'market')?.isVisible && <MarketPanel />}
    </MainLayout>
  );
};

export default App;