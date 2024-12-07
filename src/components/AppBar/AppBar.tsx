import React from 'react';
import { Activity, LineChart, RotateCcw, Anchor, Tent } from 'lucide-react';
import { useWidgetStore } from '../../store/widgetStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';

interface AppBarProps {
  isMenuOpen: boolean;
}

const AppBar: React.FC<AppBarProps> = ({ isMenuOpen }) => {
  const { widgets, updateWidget, organizeWidgets } = useWidgetStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleAppClick = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    
    if (widget) {
      updateWidget({
        id,
        isVisible: !widget.isVisible,
        isMinimized: false,
        zIndex: !widget.isVisible ? Math.max(...widgets.map(w => w.zIndex), 0) + 1 : widget.zIndex
      });
    }
  };

  const handleResetView = () => {
    const maximizedWidgets = widgets.filter(w => w.isMaximized);
    organizeWidgets();
    
    maximizedWidgets.forEach(widget => {
      updateWidget({
        id: widget.id,
        isMaximized: true,
        x: 0,
        y: 80,
        width: window.innerWidth,
        height: window.innerHeight - 140
      });
    });
  };

  const AppButton = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => {
    const isVisible = widgets.find(w => w.id === id)?.isVisible;
    
    return (
      <motion.button
        onClick={() => handleAppClick(id)}
        className={`
          flex items-center space-x-2 p-3 border border-primary/30 
          rounded-lg transition-colors duration-200 group w-full
          ${isVisible ? 'bg-primary/20' : 'bg-background/80 hover:bg-primary/10'}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-primary text-sm whitespace-nowrap">{label}</span>
      </motion.button>
    );
  };

  const menuVariants = {
    open: { 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    closed: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  return (
    <AnimatePresence>
      {(!isMobile || isMenuOpen) && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="p-4"
        >
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-3'}`}>
            <motion.div variants={itemVariants}>
              <AppButton id="wallet" icon={Anchor} label="CØVE Wallet" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AppButton id="graph" icon={Activity} label="Chain eXplorer" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AppButton id="price" icon={LineChart} label="XRP/USD" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AppButton id="market" icon={Tent} label="Market" />
            </motion.div>

            <motion.button
              variants={itemVariants}
              onClick={handleResetView}
              className={`
                p-3 border border-primary/30 rounded-lg bg-background/80 
                hover:bg-primary/10 transition-colors flex items-center justify-center
                ${isMobile ? 'w-full' : ''}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-5 h-5 text-primary" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppBar;