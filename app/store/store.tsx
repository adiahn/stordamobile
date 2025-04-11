import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  model?: string;
  registrationDate?: string;
  status?: 'active' | 'reported' | 'lost' | 'stolen' | 'transferred';
  transferredTo?: string;
  warrantyStatus?: string;
  insuranceStatus?: string;
  // Additional properties used in the app
  registeredBy?: string;
  currentOwner?: string;
  ownerNIN?: string;
  // Verification properties
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  verificationMethod?: 'receipt' | 'purchase_code' | 'retailer' | 'none';
  isImeiVerified?: boolean;
  isBlacklisted?: boolean;
  verificationDate?: string;
  reportAuthorities?: {
    reportId?: string;
    reportDate?: string;
    reportType?: 'police' | 'insurance' | 'other';
    reportStatus?: 'pending' | 'processing' | 'completed';
    caseNumber?: string;
    // New properties for unreport/recovery
    resolutionDate?: string;
    resolutionType?: 'owner-unreported' | 'recovered' | 'replacement-issued';
    recoveryReportDate?: string;
    recoveryNotes?: string;
  };
  transferHistory?: Array<{
    transferDate: string;
    fromUserId?: string;
    toUserId?: string;
    toEmail?: string;
    toPhone?: string;
    wasVerified: boolean;
    verificationMethod?: string;
  }>;
  // New properties for unreport and recovery
  unreportDate?: string;
  recoveryInfo?: {
    recoveredBy: string;
    recoveryLocation: string;
    recoveryDate: string;
    recoveryDetails: string;
    contactInfo: string;
    isVerified: boolean;
    ownerConfirmationDate?: string;
    reportedBy?: 'owner' | 'finder';
  };
}

interface DeviceStore {
  selectedDevice: Device | null;
  devices: Device[];
  // Selectors
  getDeviceById: (id: string) => Device | undefined;
  getDeviceByImei: (imei: string) => Device | undefined;
  getDevicesByStatus: (status: Device['status']) => Device[];
  // Actions
  setSelectedDevice: (device: Device | null) => void;
  addDevice: (device: Device) => void;
  setDevices: (devices: Device[]) => void;
  updateDeviceStatus: (deviceKey: number, status: Device['status'], transferredTo?: string) => void;
  removeDevice: (deviceKey: number) => void;
  unreportDevice: (deviceKey: number) => void;
  markDeviceRecovered: (deviceKey: number, recoveryInfo: {
    recoveredBy: string;
    recoveryLocation: string;
    recoveryDetails: string;
    contactInfo: string;
  }) => void;
}

// Create the store with persistence
export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set, get) => ({
      selectedDevice: null,
      devices: [],
      
      // Memoized selectors
      getDeviceById: (id: string) => get().devices.find(device => device.id === id),
      getDeviceByImei: (imei: string) => get().devices.find(device => device.imei === imei),
      getDevicesByStatus: (status: Device['status']) => 
        get().devices.filter(device => device.status === status),
      
      // Actions remain the same but with optimizations
      setSelectedDevice: (device) => set({ selectedDevice: device }),
      
      addDevice: (device) => set((state) => {
        // Check for duplicate before adding
        const existingDevice = state.devices.find(d => d.imei === device.imei);
        if (existingDevice) {
          console.warn(`Device with IMEI ${device.imei} already exists`);
          return state; // Return unchanged state if duplicate
        }
        return { devices: [...state.devices, device] };
      }),
      
      setDevices: (devices) => set({ devices }),
      
      updateDeviceStatus: (deviceKey, status, transferredTo) => set((state) => {
        const deviceIndex = state.devices.findIndex(d => d.key === deviceKey);
        
        if (deviceIndex === -1) return state; // Return unchanged state if device not found
        
        // Create a new devices array with the updated device
        const updatedDevices = [...state.devices];
        updatedDevices[deviceIndex] = { 
          ...updatedDevices[deviceIndex], 
          status, 
          ...(transferredTo ? { 
            transferredTo, 
            ownership: false,
            transferHistory: [
              ...(updatedDevices[deviceIndex].transferHistory || []),
              {
                transferDate: new Date().toISOString(),
                toEmail: transferredTo,
                wasVerified: true,
                verificationMethod: 'app'
              }
            ]
          } : {})
        };
        
        // Update selectedDevice if needed
        const selectedDevice = state.selectedDevice?.key === deviceKey 
          ? updatedDevices[deviceIndex] 
          : state.selectedDevice;
        
        return { devices: updatedDevices, selectedDevice };
      }),
      
      // Remaining methods with same optimizations
      removeDevice: (deviceKey) => set((state) => {
        try {
          const deviceToRemove = state.devices.find(device => device.key === deviceKey);
          
          if (!deviceToRemove) {
            console.error(`Device with key ${deviceKey} not found`);
            return state;
          }
          
          if (deviceToRemove.status === 'transferred') {
            console.error(`Cannot remove device with key ${deviceKey} - it has been transferred`);
            return state;
          }
          
          const devices = state.devices.filter(device => device.key !== deviceKey);
          const selectedDevice = state.selectedDevice?.key === deviceKey ? null : state.selectedDevice;
          
          return { devices, selectedDevice };
        } catch (error) {
          console.error("Error removing device:", error);
          return state;
        }
      }),

      unreportDevice: (deviceKey) => set((state) => {
        try {
          const deviceIndex = state.devices.findIndex(d => d.key === deviceKey);
          
          if (deviceIndex === -1) {
            console.error(`Device with key ${deviceKey} not found`);
            return state;
          }
          
          const device = state.devices[deviceIndex];
          
          if (device.status !== 'lost' && device.status !== 'stolen') {
            console.error(`Device with key ${deviceKey} is not reported as lost or stolen`);
            return state;
          }
          
          const updatedDevices = [...state.devices];
          updatedDevices[deviceIndex] = {
            ...device,
            status: 'active',
            unreportDate: new Date().toISOString(),
            reportAuthorities: device.reportAuthorities ? {
              ...device.reportAuthorities,
              reportStatus: 'completed',
              resolutionDate: new Date().toISOString(),
              resolutionType: 'owner-unreported'
            } : undefined
          };
          
          const selectedDevice = state.selectedDevice?.key === deviceKey
            ? updatedDevices[deviceIndex]
            : state.selectedDevice;
          
          return { devices: updatedDevices, selectedDevice };
        } catch (error) {
          console.error("Error unreporting device:", error);
          return state;
        }
      }),
      
      markDeviceRecovered: (deviceKey, recoveryInfo) => set((state) => {
        try {
          const deviceIndex = state.devices.findIndex(d => d.key === deviceKey);
          
          if (deviceIndex === -1) {
            console.error(`Device with key ${deviceKey} not found`);
            return state;
          }
          
          const device = state.devices[deviceIndex];
          
          if (device.status !== 'lost' && device.status !== 'stolen') {
            console.error(`Device with key ${deviceKey} is not reported as lost or stolen`);
            return state;
          }
          
          const updatedDevices = [...state.devices];
          updatedDevices[deviceIndex] = {
            ...device,
            recoveryInfo: {
              recoveredBy: recoveryInfo.recoveredBy,
              recoveryLocation: recoveryInfo.recoveryLocation,
              recoveryDate: new Date().toISOString(),
              recoveryDetails: recoveryInfo.recoveryDetails,
              contactInfo: recoveryInfo.contactInfo,
              isVerified: false,
            },
            reportAuthorities: device.reportAuthorities ? {
              ...device.reportAuthorities,
              reportStatus: 'processing',
              recoveryReportDate: new Date().toISOString(),
            } : undefined
          };
          
          const selectedDevice = state.selectedDevice?.key === deviceKey
            ? updatedDevices[deviceIndex]
            : state.selectedDevice;
          
          return { devices: updatedDevices, selectedDevice };
        } catch (error) {
          console.error("Error marking device as recovered:", error);
          return state;
        }
      }),
    }),
    {
      name: 'device-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        devices: state.devices,
        // Don't persist selectedDevice to avoid stale references
      }),
    }
  )
);
