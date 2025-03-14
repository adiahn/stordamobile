import { View, Text, StyleSheet, ScrollView, Pressable, Image, Modal, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { Plus, AlertTriangle, ArrowLeftRight, ChevronRight, X, Send } from 'lucide-react-native';

import { Link, useRouter } from 'expo-router';
import { useThemeStore } from '../../store/theme';

type DeviceStatus = 'owned' | 'transferred' | 'reported';

interface DeviceHistory {
  date: string;
  action: string;
  from?: string;
  to?: string;
}

interface Device {
  id: string;
  imei: string;
  model: string;
  isStolen: boolean;
  addedAt: string;
  status: DeviceStatus;
  image?: string;
  history: DeviceHistory[];
  originalOwner: string;
  purchaseDate: string;
  purchasePrice?: string;
  purchaseFrom?: string;
}

interface TransferDetails {
  recipientUsername: string;
  transferPin: string;
}

interface Transfer {
  id: string;
  deviceId: string;
  recipientUsername: string;
  status: 'pending' | 'completed';
  transferCode: string;
  createdAt: string;
}

interface SelectDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  devices: Device[];
  onSelectDevice: (device: Device) => void;
  isDark: boolean;
}

export default function DevicesScreen() {
  const router = useRouter();
  const { isDark } = useThemeStore();
  const [devices] = useState<Device[]>([
    {
      id: 'dev_1',
      imei: '359269023456789',
      model: 'iPhone 13',
      isStolen: false,
      addedAt: '2024-01-20',
      status: 'owned',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop',
      originalOwner: 'Sarah Johnson',
      purchaseDate: '2024-01-20',
      purchasePrice: '$799',
      purchaseFrom: 'Apple Store',
      history: [
        {
          date: '2024-01-20',
          action: 'Device Added',
          from: 'Apple Store'
        }
      ]
    },
    {
      id: 'dev_2',
      imei: '351234567891234',
      model: 'Samsung Galaxy S21',
      isStolen: true,
      addedAt: '2024-01-15',
      status: 'reported',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300&auto=format&fit=crop',
      originalOwner: 'Michael Brown',
      purchaseDate: '2023-12-10',
      purchasePrice: '$699',
      purchaseFrom: 'Samsung Store',
      history: [
        {
          date: '2023-12-10',
          action: 'Device Added',
          from: 'Samsung Store'
        },
        {
          date: '2024-01-15',
          action: 'Reported Stolen'
        }
      ]
    },
    {
      id: 'dev_3',
      imei: '357123456789012',
      model: 'Google Pixel 6',
      isStolen: false,
      addedAt: '2024-01-10',
      status: 'transferred',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop',
      originalOwner: 'Emily Davis',
      purchaseDate: '2023-11-20',
      purchasePrice: '$599',
      purchaseFrom: 'Best Buy',
      history: [
        {
          date: '2023-11-20',
          action: 'Device Added',
          from: 'Best Buy'
        },
        {
          date: '2024-01-10',
          action: 'Transferred',
          from: 'Emily Davis',
          to: 'John Smith'
        }
      ]
    },
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({
    recipientUsername: '',
    transferPin: '',
  });
  const [transferError, setTransferError] = useState<string | null>(null);
  const [isSelectDeviceModalVisible, setIsSelectDeviceModalVisible] = useState(false);

  const devicesByStatus = devices.reduce((acc, device) => {
    if (!acc[device.status]) {
      acc[device.status] = [];
    }
    acc[device.status].push(device);
    return acc;
  }, {} as Record<DeviceStatus, Device[]>);

  const handleDevicePress = (device: Device) => {
    router.push({
      pathname: '/device/[id]',
      params: { id: device.id }
    });
  };

  const handleTransferPress = (device: Device) => {
    setSelectedDevice(device);
    setTransferDetails({ recipientUsername: '', transferPin: '' });
    setTransferError(null);
    setIsTransferModalVisible(true);
  };

  const handleTransferSubmit = () => {
    // Validate transfer details
    if (!transferDetails.recipientUsername || !transferDetails.transferPin) {
      setTransferError('Please fill in all fields');
      return;
    }

    if (transferDetails.transferPin.length < 6) {
      setTransferError('PIN must be at least 6 characters');
      return;
    }

    if (!selectedDevice) {
      setTransferError('No device selected');
      return;
    }

    // Generate a random transfer code
    const transferCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create a mock transfer
    const newTransfer: Transfer = {
      id: `transfer_${Date.now()}`,
      deviceId: selectedDevice.id,
      recipientUsername: transferDetails.recipientUsername,
      status: 'pending',
      transferCode,
      createdAt: new Date().toISOString(),
    };

    // Update local state
    setTransfers(prev => [...prev, newTransfer]);

    // Update device status in local state
    const updatedDevices = devices.map(device => 
      device.id === selectedDevice.id 
        ? {
            ...device,
            status: 'transferred' as DeviceStatus,
            history: [
              ...device.history,
              {
                date: new Date().toISOString(),
                action: 'Transfer Initiated',
                from: device.originalOwner,
                to: transferDetails.recipientUsername
              }
            ]
          }
        : device
    );

    // Show success message with transfer code
    Alert.alert(
      'Transfer Initiated',
      `Transfer code: ${transferCode}\n\nShare this code with ${transferDetails.recipientUsername} to complete the transfer.`,
      [{ 
        text: 'OK',
        onPress: () => {
          setIsTransferModalVisible(false);
          setSelectedDevice(null);
          setTransferDetails({ recipientUsername: '', transferPin: '' });
        }
      }]
    );
  };

  const handleAcceptTransfer = async (transferCode: string, pin: string) => {
    try {
      // Verify transfer code and PIN
      const { data: transferData, error: transferError } = await supabase
        .from('device_transfers')
        .select('*')
        .eq('transfer_code', transferCode)
        .eq('pin', pin)
        .single();

      if (transferError || !transferData) {
        throw new Error('Invalid transfer code or PIN');
      }

      // Complete transfer
      await supabase.from('devices')
        .update({ 
          status: 'transferred',
          owner_id: transferData.to_user_id 
        })
        .eq('id', transferData.device_id);

      // Update transfer status
      await supabase.from('device_transfers')
        .update({ status: 'completed' })
        .eq('id', transferData.id);

      // Add to history
      await supabase.from('device_history')
        .insert({
          device_id: transferData.device_id,
          action: 'Transfer Completed',
          date: new Date().toISOString()
        });

      Alert.alert('Success', 'Device transfer completed successfully');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to complete transfer');
      console.error('Accept transfer error:', error);
    }
  };

  const renderDeviceCard = (device: Device) => (
    <Pressable
      key={device.id}
      style={[
        styles.deviceCard,
        device.isStolen && styles.stolenDevice,
        isDark && styles.darkCard
      ]}
      onPress={() => handleDevicePress(device)}>
      <View style={styles.deviceInfo}>
        <Text style={[styles.deviceModel, isDark && styles.darkText]}>{device.model}</Text>
        <Text style={[styles.deviceImei, isDark && styles.darkSubText]}>ID: {device.id}</Text>
        <Text style={[styles.deviceDate, isDark && styles.darkSubText]}>Added: {device.addedAt}</Text>
        <Text style={[styles.deviceDate, isDark && styles.darkSubText]}>
          Status: {device.status}
        </Text>
        <Text style={[styles.deviceDate, isDark && styles.darkSubText]}>
          Is Stolen: {device.isStolen ? 'Yes' : 'No'}
        </Text>
      </View>
      {device.isStolen && (
        <View style={styles.stolenBadge}>
          <AlertTriangle size={20} color="#dc2626" />
          <Text style={styles.stolenText}>Reported Stolen</Text>
        </View>
      )}
      {device.status === 'transferred' && (
        <View style={styles.transferredBadge}>
          <ArrowLeftRight size={20} color="#0891b2" />
          <Text style={styles.transferredText}>Transferred</Text>
        </View>
      )}
      {device.status === 'owned' && !device.isStolen && (
        <Pressable
          style={styles.transferButton}
          onPress={() => handleTransferPress(device)}>
          <Send size={18} color="#0891b2" />
          <Text style={styles.transferButtonText}>Transfer</Text>
        </Pressable>
      )}
      <ChevronRight size={20} color={isDark ? '#94a3b8' : '#64748b'} style={styles.chevron} />
    </Pressable>
  );

  const renderSection = (title: string, devices: Device[]) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>{title}</Text>
      {devices.map(renderDeviceCard)}
    </View>
  );

  const transferModal = (
    <Modal
      visible={isTransferModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsTransferModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDark && styles.darkText]}>Transfer Device</Text>
            <Pressable
              onPress={() => setIsTransferModalVisible(false)}
              style={styles.closeButton}>
              <X size={24} color={isDark ? '#f1f5f9' : '#1e293b'} />
            </Pressable>
          </View>

          {selectedDevice && (
            <View style={[styles.selectedDevice, isDark && styles.darkSelectedDevice]}>
              <Text style={[styles.selectedDeviceText, isDark && styles.darkText]}>
                {selectedDevice.model}
              </Text>
              <Text style={[styles.selectedDeviceId, isDark && styles.darkSubText]}>
                ID: {selectedDevice.id}
              </Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Recipient Username</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={transferDetails.recipientUsername}
              onChangeText={(text) => setTransferDetails(prev => ({ ...prev, recipientUsername: text }))}
              placeholder="Enter username"
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Transfer PIN</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={transferDetails.transferPin}
              onChangeText={(text) => setTransferDetails(prev => ({ ...prev, transferPin: text }))}
              placeholder="Enter 6-digit PIN"
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {transferError && (
            <Text style={styles.errorText}>{transferError}</Text>
          )}

          <Pressable
            style={[
              styles.transferSubmitButton,
              (!transferDetails.recipientUsername || !transferDetails.transferPin) && 
              styles.transferSubmitButtonDisabled
            ]}
            onPress={handleTransferSubmit}
            disabled={!transferDetails.recipientUsername || !transferDetails.transferPin}>
            <Send size={20} color="#ffffff" />
            <Text style={styles.transferSubmitButtonText}>Initiate Transfer</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  const SelectDeviceModal = ({ visible, onClose, devices, onSelectDevice, isDark }: SelectDeviceModalProps) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDark && styles.darkText]}>Select Device to Transfer</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={isDark ? '#f1f5f9' : '#1e293b'} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.deviceList}>
            {devices
              .filter(device => device.status === 'owned' && !device.isStolen)
              .map(device => (
                <Pressable
                  key={device.id}
                  style={[styles.selectableDeviceCard, isDark && styles.darkCard]}
                  onPress={() => onSelectDevice(device)}>
                  <View style={styles.deviceInfo}>
                    <Text style={[styles.deviceModel, isDark && styles.darkText]}>{device.model}</Text>
                    <Text style={[styles.deviceImei, isDark && styles.darkSubText]}>ID: {device.id}</Text>
                    <Text style={[styles.deviceDate, isDark && styles.darkSubText]}>Added: {device.addedAt}</Text>
                  </View>
                  <ChevronRight size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                </Pressable>
              ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView style={styles.deviceList}>
        {devicesByStatus.owned && renderSection('Currently Owned', devicesByStatus.owned)}
        {devicesByStatus.transferred && renderSection('Transferred Devices', devicesByStatus.transferred)}
        {devicesByStatus.reported && renderSection('Reported Devices', devicesByStatus.reported)}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Link href="/device/add" asChild>
          <Pressable style={styles.addButton}>
            <Plus size={24} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Device</Text>
          </Pressable>
        </Link>
        
        <Pressable 
          style={styles.transferDeviceButton}
          onPress={() => setIsSelectDeviceModalVisible(true)}>
          <Send size={24} color="#ffffff" />
          <Text style={styles.transferDeviceButtonText}>Transfer Device</Text>
        </Pressable>
      </View>

      <SelectDeviceModal
        visible={isSelectDeviceModalVisible}
        onClose={() => setIsSelectDeviceModalVisible(false)}
        devices={devices}
        onSelectDevice={(device) => {
          setIsSelectDeviceModalVisible(false);
          setSelectedDevice(device);
          setTransferDetails({ recipientUsername: '', transferPin: '' });
          setTransferError(null);
          setIsTransferModalVisible(true);
        }}
        isDark={isDark}
      />

      {transferModal}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#1e293b',
  },
  deviceList: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#334155',
  },
  stolenDevice: {
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  deviceInfo: {
    gap: 4,
  },
  deviceModel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  deviceImei: {
    fontSize: 14,
    color: '#64748b',
  },
  deviceDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  darkText: {
    color: '#f1f5f9',
  },
  darkSubText: {
    color: '#94a3b8',
  },
  stolenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  stolenText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  transferredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  transferredText: {
    color: '#0891b2',
    fontSize: 14,
    fontWeight: '500',
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  transferButtonText: {
    color: '#0891b2',
    fontSize: 14,
    fontWeight: '500',
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0891b2',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  transferDeviceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d9488',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  transferDeviceButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  selectableDeviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  darkModalContent: {
    backgroundColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 8,
  },
  selectedDevice: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  darkSelectedDevice: {
    backgroundColor: '#475569',
  },
  selectedDeviceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  selectedDeviceId: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  darkInput: {
    backgroundColor: '#475569',
    color: '#f1f5f9',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginTop: 8,
  },
  transferSubmitButton: {
    backgroundColor: '#0891b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  transferSubmitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  transferSubmitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});