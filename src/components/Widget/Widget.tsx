import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Minus, Square, X } from 'lucide-react';
import { useWidgetStore } from '../../store/widgetStore';

interface WidgetProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onClose?: () => void;
}

const Widget: React.FC<WidgetProps> = ({
  id,
  title,
  icon: Icon,
  children,
  defaultPosition,
  defaultSize,
  onClose
}) => {
  const { widgets, updateWidget, bringToFront } = useWidgetStore();
  const widget = widgets.find(w => w.id === id);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number }>({
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
  });

  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number }>({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0
  });

  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: widget?.x || 0,
      offsetY: widget?.y || 0
    };
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging || !widget) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    const newX = Math.max(0, Math.min(dragRef.current.offsetX + deltaX, window.innerWidth - (widget.width || 300)));
    const newY = Math.max(0, Math.min(dragRef.current.offsetY + deltaY, window.innerHeight - 48));

    updateWidget({
      id,
      x: newX,
      y: newY
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!widget) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: widget.width,
      startHeight: widget.height
    };
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !widget) return;

    const deltaX = e.clientX - resizeRef.current.startX;
    const deltaY = e.clientY - resizeRef.current.startY;

    const newWidth = Math.max(300, Math.min(resizeRef.current.startWidth + deltaX, window.innerWidth - widget.x));
    const newHeight = Math.max(200, Math.min(resizeRef.current.startHeight + deltaY, window.innerHeight - widget.y));

    updateWidget({
      id,
      width: newWidth,
      height: newHeight
    });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  const handleMaximize = () => {
    if (!widget) return;

    if (isMaximized) {
      updateWidget({
        id,
        x: widget.x,
        y: widget.y,
        width: defaultSize?.width || 300,
        height: defaultSize?.height || 400
      });
    } else {
      updateWidget({
        id,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 48
      });
    }
    setIsMaximized(!isMaximized);
    bringToFront(id);
  };

  const handleMinimize = () => {
    updateWidget({
      id,
      isMinimized: true,
      isVisible: false
    });
  };

  const handleClose = () => {
    updateWidget({ id, isVisible: false });
    onClose?.();
  };

  if (!widget) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'absolute',
        left: widget.x,
        top: widget.y,
        width: widget.width || defaultSize?.width || 300,
        height: widget.height || defaultSize?.height || 400,
        zIndex: widget.zIndex || 1
      }}
      className="bg-background/95 backdrop-blur-md rounded-lg border border-primary/30 overflow-hidden shadow-xl"
    >
      <div
        className="flex items-center justify-between p-3 bg-primary/10 border-b border-primary/30 cursor-move"
        onMouseDown={handleDragStart}
        onClick={() => !isDragging && bringToFront(id)}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">{title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-primary/20 rounded transition-colors"
          >
            <Minus className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1 hover:bg-primary/20 rounded transition-colors"
          >
            <Square className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-primary/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
      <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
        {children}
      </div>
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary/50 rounded-sm" />
      </div>
    </motion.div>
  );
};

export default Widget;