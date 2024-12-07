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
        width: 800,
        height: 500,
        zIndex: 1
      });

      updateWidget({
        id: 'price',
        isVisible: true,
        x: 360,
        y: window.innerHeight - 380,
        width: 800,
        height: 300,
        zIndex: 1
      });

      updateWidget({
        id: 'market',
        isVisible: false,
        x: 360,
        y: 80,
        width: 800,
        height: 500,
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