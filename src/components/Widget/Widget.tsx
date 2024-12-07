import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon, Minus, Square, X } from 'lucide-react';
import { useWidgetStore } from '../../store/widgetStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface WidgetProps {
  id: string;
  title: React.ReactNode;
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
  const dragRef = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 });
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleClick = () => {
    bringToFront(id);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    
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
    const newY = Math.max(80, Math.min(dragRef.current.offsetY + deltaY, window.innerHeight - 60));

    updateWidget({
      id,
      x: newX,
      y: newY
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: widget?.width || defaultSize?.width || 300,
      startHeight: widget?.height || defaultSize?.height || 400
    };
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !widget) return;

    const deltaX = e.clientX - resizeRef.current.startX;
    const deltaY = e.clientY - resizeRef.current.startY;

    const newWidth = Math.max(300, resizeRef.current.startWidth + deltaX);
    const newHeight = Math.max(200, resizeRef.current.startHeight + deltaY);

    updateWidget({
      id,
      width: newWidth,
      height: newHeight
    });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const handleMaximize = () => {
    if (!widget) return;

    const newState = !isMaximized;
    setIsMaximized(newState);

    updateWidget({
      id,
      x: newState ? 0 : widget.x,
      y: newState ? 80 : widget.y,
      width: newState ? window.innerWidth : (defaultSize?.width || 300),
      height: newState ? window.innerHeight - 140 : (defaultSize?.height || 400),
      isMaximized: newState
    });

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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  if (!widget) return null;

  return (
    <div
      style={{
        position: isMobile ? 'relative' : 'absolute',
        left: isMobile ? 0 : widget.x,
        top: isMobile ? 0 : widget.y,
        width: isMobile ? '100%' : (widget.width || defaultSize?.width || 300),
        height: widget.height || defaultSize?.height || 400,
        zIndex: widget.zIndex || 1
      }}
      className="widget bg-background/95 backdrop-blur-md rounded-lg border border-primary/30 overflow-hidden shadow-xl mb-4"
      onClick={handleClick}
    >
      <div
        className="flex items-center justify-between p-3 bg-primary/10 border-b border-primary/30 cursor-move"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-primary" />
          <span className="text-text font-medium">{title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-primary/20 rounded transition-colors"
          >
            <Minus className="w-4 h-4 text-text" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1 hover:bg-primary/20 rounded transition-colors"
          >
            <Square className="w-4 h-4 text-text" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-primary/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-text" />
          </button>
        </div>
      </div>
      <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
        {children}
      </div>
      {!isMobile && !isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default Widget;