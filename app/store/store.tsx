import { create } from 'zustand';

interface DeviceStore {
  selectedDevice: any | null;
  devices: any[];
  setSelectedDevice: (device: any) => void;
  addDevice: (device: any) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  selectedDevice: null,
  devices: [],
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  addDevice: (device) => set((state) => ({ 
    devices: [...state.devices, device] 
  })),
}));
