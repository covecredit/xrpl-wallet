import { create } from 'zustand';

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
  updateWidget: (widget: Partial<Widget>) => void;
  bringToFront: (id: string) => void;
  organizeWidgets: () => void;
}

const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = 48;

export const useWidgetStore = create<WidgetState>((set) => ({
  widgets: [],
  
  updateWidget: (widget) => set((state) => {
    const existingWidgetIndex = state.widgets.findIndex((w) => w.id === widget.id);
    
    if (existingWidgetIndex >= 0) {
      const updatedWidgets = [...state.widgets];
      updatedWidgets[existingWidgetIndex] = {
        ...updatedWidgets[existingWidgetIndex],
        ...widget
      };
      return { widgets: updatedWidgets };
    }
    
    const newWidget = {
      x: 20,
      y: HEADER_HEIGHT + 20,
      width: 300,
      height: 400,
      zIndex: Math.max(0, ...state.widgets.map((w) => w.zIndex)) + 1,
      isVisible: true,
      ...widget
    } as Widget;
    
    return { widgets: [...state.widgets, newWidget] };
  }),
  
  bringToFront: (id) => set((state) => ({
    widgets: state.widgets.map((w) => ({
      ...w,
      zIndex: w.id === id ? Math.max(...state.widgets.map((w) => w.zIndex)) + 1 : w.zIndex
    }))
  })),
  
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
    
    return { widgets: updatedWidgets };
  })
}));