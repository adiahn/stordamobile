import { create } from 'zustand';

export interface Device {
  name: string;
  imei: string;
  macAddress: string;
  id: string;
  key?: number;
  ownership?: boolean;
  storage?: string;
  color?: string;
  brand?: string;
  registrationDate?: string;
  status?: 'active' | 'reported' | 'lost' | 'stolen';
  warrantyStatus?: string;
  insuranceStatus?: string;
}

interface DeviceStore {
  selectedDevice: Device | null;
  devices: Device[];
  setSelectedDevice: (device: Device | null) => void;
  addDevice: (device: Device) => void;
  setDevices: (devices: Device[]) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  selectedDevice: null,
  devices: [],
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  addDevice: (device) => set((state) => ({ 
    devices: [...state.devices, device] 
  })),
  setDevices: (devices) => set({ devices }),
}));
