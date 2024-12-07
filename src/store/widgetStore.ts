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
}

interface WidgetState {
  widgets: Widget[];
  updateWidget: (widget: Partial<Widget>) => void;
  bringToFront: (id: string) => void;
  organizeWidgets: () => void;
}

const getDefaultLayout = (id: string): Partial<Widget> => {
  const layouts: Record<string, Partial<Widget>> = {
    wallet: {
      width: 320,
      height: 400,
      x: 20,
      y: 80
    },
    graph: {
      width: 800,
      height: 500,
      x: 360,
      y: 80
    },
    price: {
      width: 800,
      height: 300,
      x: 360,
      y: window.innerHeight - 380
    }
  };

  return layouts[id] || {
    width: 600,
    height: 400,
    x: 360,
    y: 80
  };
};

export const useWidgetStore = create<WidgetState>((set) => ({
  widgets: [],
  updateWidget: (widget) =>
    set((state) => {
      const existingWidgetIndex = state.widgets.findIndex((w) => w.id === widget.id);
      
      if (existingWidgetIndex >= 0) {
        const updatedWidgets = [...state.widgets];
        updatedWidgets[existingWidgetIndex] = {
          ...updatedWidgets[existingWidgetIndex],
          ...widget
        };
        return { widgets: updatedWidgets };
      }
      
      const defaultLayout = getDefaultLayout(widget.id);
      const newWidget = {
        ...defaultLayout,
        ...widget,
        zIndex: Math.max(0, ...state.widgets.map((w) => w.zIndex)) + 1
      } as Widget;
      
      return { widgets: [...state.widgets, newWidget] };
    }),
  
  bringToFront: (id) =>
    set((state) => ({
      widgets: state.widgets.map((w) => ({
        ...w,
        zIndex: w.id === id ? Math.max(...state.widgets.map((w) => w.zIndex)) + 1 : w.zIndex
      }))
    })),
  
  organizeWidgets: () =>
    set((state) => ({
      widgets: state.widgets.map((widget) => ({
        ...widget,
        ...getDefaultLayout(widget.id),
        isMinimized: false,
        isVisible: true
      }))
    }))
}));