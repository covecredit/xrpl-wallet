import { create } from 'zustand';
import { saveToStorage, loadFromStorage } from '../utils/storage';

interface Widget {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isVisible: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
}

interface WidgetState {
  widgets: Widget[];
  updateWidget: (widget: Partial<Widget> & { id: string }) => void;
  bringToFront: (id: string) => void;
  organizeWidgets: () => void;
}

const HEADER_HEIGHT = 80;

// Load saved widget positions from storage
const savedWidgets = loadFromStorage('WIDGETS') || [];

export const useWidgetStore = create<WidgetState>((set) => ({
  widgets: savedWidgets,
  
  updateWidget: (widget) => set((state) => {
    const existingWidgetIndex = state.widgets.findIndex((w) => w.id === widget.id);
    let updatedWidgets: Widget[];
    
    if (existingWidgetIndex >= 0) {
      updatedWidgets = [...state.widgets];
      updatedWidgets[existingWidgetIndex] = {
        ...updatedWidgets[existingWidgetIndex],
        ...widget
      };
    } else {
      const newWidget = {
        x: 20,
        y: HEADER_HEIGHT + 20,
        width: 300,
        height: 400,
        zIndex: Math.max(0, ...state.widgets.map((w) => w.zIndex)) + 1,
        isVisible: true,
        ...widget
      } as Widget;
      
      updatedWidgets = [...state.widgets, newWidget];
    }
    
    saveToStorage('WIDGETS', updatedWidgets);
    return { widgets: updatedWidgets };
  }),
  
  bringToFront: (id) => set((state) => {
    const maxZIndex = Math.max(...state.widgets.map((w) => w.zIndex));
    const updatedWidgets = state.widgets.map((w) => ({
      ...w,
      zIndex: w.id === id ? maxZIndex + 1 : w.zIndex
    }));
    saveToStorage('WIDGETS', updatedWidgets);
    return { widgets: updatedWidgets };
  }),
  
  organizeWidgets: () => set((state) => {
    const updatedWidgets = state.widgets.map((widget, index) => {
      const defaultX = 20 + (index * 40);
      const defaultY = HEADER_HEIGHT + 20 + (index * 40);
      
      return {
        ...widget,
        x: defaultX,
        y: defaultY,
        isMinimized: false,
        isMaximized: false,
        width: widget.width || 300,
        height: widget.height || 400
      };
    });
    
    saveToStorage('WIDGETS', updatedWidgets);
    return { widgets: updatedWidgets };
  })
}));