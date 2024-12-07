import React from 'react';
import { Activity, LineChart, RotateCcw, Anchor, Tent } from 'lucide-react';
import { useWidgetStore } from '../../store/widgetStore';

const AppBar: React.FC = () => {
  const { widgets, updateWidget, organizeWidgets } = useWidgetStore();

  const handleAppClick = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    
    if (widget) {
      updateWidget({
        id,
        isVisible: !widget.isVisible,
        zIndex: !widget.isVisible ? Math.max(...widgets.map(w => w.zIndex), 0) + 1 : widget.zIndex
      });
    }
  };

  const handleResetView = () => {
    // Preserve maximized state when resetting
    const maximizedWidgets = widgets.filter(w => w.isMaximized);
    organizeWidgets();
    
    // Restore maximized state
    maximizedWidgets.forEach(widget => {
      updateWidget({
        id: widget.id,
        isMaximized: true,
        x: 0,
        y: 80, // Account for header
        width: window.innerWidth,
        height: window.innerHeight - 140 // Account for header and footer
      });
    });
  };

  const CoveO = () => (
    <span className="relative">
      <span>O</span>
      <span className="absolute top-1/2 left-0 w-full h-0.5 bg-primary transform -rotate-45"></span>
    </span>
  );

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-50">
      <button
        onClick={() => handleAppClick('wallet')}
        className={`
          flex items-center space-x-2 p-2 border border-primary/30 
          rounded-lg transition-colors duration-200 group
          ${widgets.find(w => w.id === 'wallet')?.isVisible 
            ? 'bg-primary/20' 
            : 'bg-background/80 hover:bg-primary/10'}
        `}
      >
        <Anchor className="w-5 h-5 text-primary" />
        <span className="text-primary text-sm">C<CoveO/>VE Wallet</span>
      </button>

      <button
        onClick={() => handleAppClick('graph')}
        className={`
          flex items-center space-x-2 p-2 border border-primary/30 
          rounded-lg transition-colors duration-200 group
          ${widgets.find(w => w.id === 'graph')?.isVisible 
            ? 'bg-primary/20' 
            : 'bg-background/80 hover:bg-primary/10'}
        `}
      >
        <Activity className="w-5 h-5 text-primary" />
        <span className="text-primary text-sm">Chain eXplorer</span>
      </button>

      <button
        onClick={() => handleAppClick('price')}
        className={`
          flex items-center space-x-2 p-2 border border-primary/30 
          rounded-lg transition-colors duration-200 group
          ${widgets.find(w => w.id === 'price')?.isVisible 
            ? 'bg-primary/20' 
            : 'bg-background/80 hover:bg-primary/10'}
        `}
      >
        <LineChart className="w-5 h-5 text-primary" />
        <span className="text-primary text-sm">XRP/USD</span>
      </button>

      <button
        onClick={() => handleAppClick('market')}
        className={`
          flex items-center space-x-2 p-2 border border-primary/30 
          rounded-lg transition-colors duration-200 group
          ${widgets.find(w => w.id === 'market')?.isVisible 
            ? 'bg-primary/20' 
            : 'bg-background/80 hover:bg-primary/10'}
        `}
      >
        <Tent className="w-5 h-5 text-primary" />
        <span className="text-primary text-sm">Market</span>
      </button>

      <button
        onClick={handleResetView}
        className="p-2 border border-primary/30 rounded-lg bg-background/80 hover:bg-primary/10 transition-colors"
      >
        <RotateCcw className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
};

export default AppBar;