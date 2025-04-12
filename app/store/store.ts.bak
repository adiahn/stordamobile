import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

export interface Device {
  id: string;
  name: string;
  imei: string;
  macAddress?: string;
  ownership: boolean;
  key?: number;
  registrationDate?: string;
  status?: 'active' | 'transferred' | 'lost' | 'stolen';
  storage?: string;
  color?: string;
  registeredBy?: string;
  currentOwner?: string;
  ownerNIN?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  verificationMethod?: 'receipt' | 'photo' | 'both' | 'none';
  isImeiVerified?: boolean;
  isBlacklisted?: boolean;
  verificationDate?: string;
  brand?: string;
  model?: string;
}

export interface DeviceStore {
  devices: Device[];
  selectedDevice: Device | null;
  addDevice: (device: Device) => void;
  updateDevice: (key: number, update: Partial<Device>) => void;
  updateDeviceStatus: (key: number, status: Device['status'], newOwner?: string) => void;
  updateDeviceVerification: (key: number, status: Device['verificationStatus']) => void;
  deleteDevice: (key: number) => void;
  getDeviceById: (id: string) => Device | null;
  getDeviceByImei: (imei: string) => Device | null;
  setSelectedDevice: (device: Device) => void;
}

// Initialize the store
export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  selectedDevice: null,
  
  // Add a new device
  addDevice: (device: Device) => {
    if (!device.key) {
      device.key = Date.now();
    }
    
    set((state) => ({
      devices: [...state.devices, device],
    }));
    
    // Save to AsyncStorage
    const newDevices = [...get().devices, device];
    AsyncStorage.setItem('devices', JSON.stringify(newDevices))
      .catch(err => console.error('Error saving devices:', err));
  },
  
  // Update a device
  updateDevice: (key: number, update: Partial<Device>) => {
    set((state) => ({
      devices: state.devices.map((device) => 
        device.key === key ? { ...device, ...update } : device
      ),
    }));
    
    // Save to AsyncStorage
    const updatedDevices = get().devices;
    AsyncStorage.setItem('devices', JSON.stringify(updatedDevices))
      .catch(err => console.error('Error saving devices:', err));
  },
  
  // Update a device's status (e.g., mark as lost, transferred)
  updateDeviceStatus: (key: number, status, newOwner) => {
    set((state) => ({
      devices: state.devices.map((device) => 
        device.key === key 
          ? { 
              ...device, 
              status, 
              currentOwner: newOwner || device.currentOwner,
              ownership: status !== 'transferred'
            } 
          : device
      ),
    }));
    
    // Save to AsyncStorage
    const updatedDevices = get().devices;
    AsyncStorage.setItem('devices', JSON.stringify(updatedDevices))
      .catch(err => console.error('Error saving devices:', err));
  },
  
  // Update device verification status
  updateDeviceVerification: (key: number, status) => {
    set((state) => ({
      devices: state.devices.map((device) => 
        device.key === key 
          ? { 
              ...device, 
              verificationStatus: status,
              verificationDate: status === 'verified' ? new Date().toISOString() : device.verificationDate
            } 
          : device
      ),
    }));
    
    // Save to AsyncStorage
    const updatedDevices = get().devices;
    AsyncStorage.setItem('devices', JSON.stringify(updatedDevices))
      .catch(err => console.error('Error saving devices:', err));
  },
  
  // Delete a device
  deleteDevice: (key: number) => {
    set((state) => ({
      devices: state.devices.filter((device) => device.key !== key),
    }));
    
    // Save to AsyncStorage
    const updatedDevices = get().devices;
    AsyncStorage.setItem('devices', JSON.stringify(updatedDevices))
      .catch(err => console.error('Error saving devices:', err));
  },
  
  // Get a device by ID
  getDeviceById: (id: string) => {
    return get().devices.find((device) => device.id === id) || null;
  },
  
  // Get a device by IMEI
  getDeviceByImei: (imei: string) => {
    return get().devices.find((device) => device.imei === imei) || null;
  },
  
  // Set the selected device
  setSelectedDevice: (device: Device) => {
    set({ selectedDevice: device });
  },
}));

// Initialize by loading saved devices from AsyncStorage
const initializeStore = async () => {
  try {
    const savedDevices = await AsyncStorage.getItem('devices');
    if (savedDevices) {
      useDeviceStore.setState({ devices: JSON.parse(savedDevices) });
    }
  } catch (err) {
    console.error('Error loading saved devices:', err);
  }
};

// Call initialize when importing the store
initializeStore(); 