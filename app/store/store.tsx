import { create } from 'zustand';

interface DeviceStore {
  selectedDevice: any | null;
  setSelectedDevice: (device: any) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  selectedDevice: null,
  setSelectedDevice: (device) => set({ selectedDevice: device }),
}));
