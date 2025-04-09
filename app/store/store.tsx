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
  status?: 'active' | 'reported' | 'lost' | 'stolen' | 'transferred';
  transferredTo?: string;
  warrantyStatus?: string;
  insuranceStatus?: string;
}

interface DeviceStore {
  selectedDevice: Device | null;
  devices: Device[];
  setSelectedDevice: (device: Device | null) => void;
  addDevice: (device: Device) => void;
  setDevices: (devices: Device[]) => void;
  updateDeviceStatus: (deviceKey: number, status: Device['status'], transferredTo?: string) => void;
  removeDevice: (deviceKey: number) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  selectedDevice: null,
  devices: [],
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  addDevice: (device) => set((state) => ({ 
    devices: [...state.devices, device] 
  })),
  setDevices: (devices) => set({ devices }),
  
  updateDeviceStatus: (deviceKey, status, transferredTo) => set((state) => {
    const devices = [...state.devices];
    const deviceIndex = devices.findIndex(d => d.key === deviceKey);
    
    if (deviceIndex !== -1) {
      devices[deviceIndex] = { 
        ...devices[deviceIndex], 
        status, 
        ...(transferredTo ? { transferredTo, ownership: false } : {})
      };
    }
    
    return { devices };
  }),
  
  removeDevice: (deviceKey) => set((state) => {
    const devices = state.devices.filter(device => device.key !== deviceKey);
    return { devices };
  }),
}));
