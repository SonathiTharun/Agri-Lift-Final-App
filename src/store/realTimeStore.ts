
import { create } from 'zustand';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  precipitation: number;
  forecast: Array<{
    date: string;
    temperature: { min: number; max: number };
    condition: string;
    precipitation: number;
  }>;
}

interface MarketData {
  crop: string;
  price: number;
  change: number;
  volume: number;
  lastUpdated: string;
}

interface SoilData {
  moisture: number;
  temperature: number;
  ph: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

interface Alert {
  id: string;
  type: 'weather' | 'market' | 'soil' | 'disease' | 'irrigation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface RealTimeState {
  // Data
  weatherData: WeatherData | null;
  marketData: MarketData[];
  soilData: SoilData | null;
  alerts: Alert[];
  
  // Connection status
  isConnected: boolean;
  lastUpdate: string | null;
  
  // Actions
  setWeatherData: (data: WeatherData) => void;
  setMarketData: (data: MarketData[]) => void;
  setSoilData: (data: SoilData) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  markAlertAsRead: (id: string) => void;
  setConnectionStatus: (status: boolean) => void;
  updateLastUpdate: () => void;
}

export const useRealTimeStore = create<RealTimeState>((set, get) => ({
  // Initial state
  weatherData: null,
  marketData: [],
  soilData: null,
  alerts: [],
  isConnected: false,
  lastUpdate: null,

  // Actions
  setWeatherData: (data) => {
    set({ weatherData: data });
    get().updateLastUpdate();
  },

  setMarketData: (data) => {
    set({ marketData: data });
    get().updateLastUpdate();
  },

  setSoilData: (data) => {
    set({ soilData: data });
    get().updateLastUpdate();
  },

  addAlert: (alertData) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));
  },

  markAlertAsRead: (id) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      ),
    }));
  },

  setConnectionStatus: (status) => {
    set({ isConnected: status });
  },

  updateLastUpdate: () => {
    set({ lastUpdate: new Date().toISOString() });
  },
}));
