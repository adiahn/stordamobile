import { create } from 'zustand';

interface Device {
  id: string;
  imei: string;
  macAddress: string;
  brand: string;
  model: string;
  storage?: string;
  color?: string;
  hasReceipt: boolean;
  hasPhoto: boolean;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
}

interface DeviceStore {
  devices: Device[];
  selectedDevice: Device | null;
  addDevice: (device: Device) => void;
  removeDevice: (id: string) => void;
  updateDevice: (id: string, updatedDevice: Partial<Device>) => void;
  setDevices: (devices: Device[]) => void;
  setSelectedDevice: (device: Device | null) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  devices: [],
  selectedDevice: null,
  addDevice: (device: Device) => 
    set((state) => ({
      devices: [...state.devices.filter(d => d.imei !== device.imei), device]
    })),
  removeDevice: (id: string) => 
    set((state) => ({
      devices: state.devices.filter(device => device.id !== id)
    })),
  updateDevice: (id: string, updatedDevice: Partial<Device>) => 
    set((state) => ({
      devices: state.devices.map(device => 
        device.id === id ? {...device, ...updatedDevice} : device
      )
    })),
  setDevices: (devices: Device[]) => set({ devices }),
  setSelectedDevice: (device: Device | null) => set({ selectedDevice: device }),
})); 