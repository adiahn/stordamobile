import { useRouter } from 'expo-router';
import { useDeviceStore, Device as StoreDevice } from '../store/store';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Modal, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useState, useEffect } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Device type definition
interface Device {
  name: string;
  imei: string;
  macAddress: string;
  id: string;
  ownership: boolean;
  key: number;
  storage?: string;
  color?: string;
  brand?: string;
  registrationDate?: string;
  status?: 'active' | 'reported' | 'lost' | 'stolen' | 'transferred';
  transferredTo?: string;
}

// User profile information
const USER_PROFILE = {
  name: "John Doe",
  email: "john@storda.ng",
  phone: "+2347011313752",
  country: "Nigeria"
};

// PIN for authentication
const USER_PIN = "1234"; // This would be stored securely in a real app

export default function HomeScreen() {
  const router = useRouter();
  const storeDevices = useDeviceStore((state) => state.devices);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showAllDevices, setShowAllDevices] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedDeviceAction, setSelectedDeviceAction] = useState<{
    type: 'transfer' | 'remove' | 'report';
    device?: Device;
  } | null>(null);
  
  // Combine store devices with the initial hardcoded ones if needed
  const [devices, setDevices] = useState<Device[]>([
    {
      name: 'iPhone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      id: 'SRD-21112',
      ownership: true,
      key: 1,
      status: 'active',
      storage: '128GB',
      color: 'Sierra Blue'
    },
    {
      name: 'Samsung Z Fold 3',
      imei: '3121321122112',
      id: 'SRD-21112',
      macAddress: '30291masmdsdmas',
      ownership: false,
      key: 3,
      status: 'active'
    },
  ]);

  // Update devices when store changes
  useEffect(() => {
    if (storeDevices && storeDevices.length > 0) {
      // Convert store devices to local Device type
      const convertedStoreDevices: Device[] = storeDevices.map(d => ({
        name: d.name,
        imei: d.imei,
        macAddress: d.macAddress,
        id: d.id,
        key: d.key || Date.now(),
        ownership: d.ownership || false,
        storage: d.storage,
        color: d.color,
        brand: d.brand,
        registrationDate: d.registrationDate,
        status: d.status,
        transferredTo: d.transferredTo
      }));
      
      // Combine with existing devices
      const combinedDevices = [...convertedStoreDevices, ...devices];
      
      // Filter out duplicates based on key
      const uniqueDevices = combinedDevices.filter((device, index, self) =>
        index === self.findIndex((d) => d.key === device.key)
      );
      
      setDevices(uniqueDevices);
    }
  }, [storeDevices]);

  const handlePinSubmit = () => {
    if (pin === USER_PIN) {
      setShowPinModal(false);
      setPin('');

      if (!selectedDeviceAction) return;

      if (selectedDeviceAction.type === 'transfer' && selectedDeviceAction.device) {
        handleTransferDevice(selectedDeviceAction.device);
      } else if (selectedDeviceAction.type === 'remove' && selectedDeviceAction.device) {
        // Handle device removal
        const updatedDevices = devices.filter(d => d.key !== selectedDeviceAction.device?.key);
        setDevices(updatedDevices);
        
        // Also remove from store if present
        if (useDeviceStore.getState().removeDevice) {
          useDeviceStore.getState().removeDevice(selectedDeviceAction.device.key);
        }
        
        Alert.alert("Device Removed", "The device has been removed successfully.");
      } else if (selectedDeviceAction.type === 'report' && selectedDeviceAction.device) {
        // Navigate to report page
        router.push({
          pathname: '/view/[Id]',
          params: { Id: selectedDeviceAction.device.id }
        });
      }
    } else {
      Alert.alert("Invalid PIN", "The PIN you entered is incorrect. Please try again.");
    }
  };

  const initiateAction = (type: 'transfer' | 'remove' | 'report', device?: Device) => {
    setSelectedDeviceAction({ type, device });
    setShowPinModal(true);
  };

  const handleTransferDevice = (device: Device) => {
    // Convert local Device to StoreDevice for the store
    const storeDevice: StoreDevice = {
      name: device.name,
      imei: device.imei,
      macAddress: device.macAddress,
      id: device.id,
      key: device.key,
      ownership: device.ownership,
      storage: device.storage,
      color: device.color,
      brand: device.brand,
      registrationDate: device.registrationDate,
      status: device.status
    };
    
    useDeviceStore.getState().setSelectedDevice(storeDevice);
    setShowTransferModal(false);
    router.push(`/devices/dev_1`);
  };

  // Display only the first 3 devices unless "See all" is clicked
  const displayDevices = showAllDevices ? devices : devices.slice(0, 3);
  const hasMoreDevices = devices.length > 3;

  // Count active devices (not transferred, lost, or stolen)
  const activeDeviceCount = devices.filter(
    device => device.status !== 'transferred' && device.status !== 'lost' && device.status !== 'stolen'
  ).length;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{USER_PROFILE.name.split(' ')[0]}</Text>
        </View>

        <LinearGradient
          colors={['#5A71E4', '#8C3BFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsCard}
        >
          <View style={styles.statsContent}>
            <View style={styles.statsRow}>
              <View style={styles.iconCircle}>
                <Feather name="shield" size={20} color="#fff" />
              </View>
              <View style={styles.statsTextContainer}>
                <Text style={styles.statsTitle}>Storda Protection</Text>
                <View style={styles.statsInfoRow}>
                  <Text style={styles.statsNumber}>{activeDeviceCount}</Text>
                  <Text style={styles.statsSubtitle}>Devices Protected</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionButtons}>
            <Pressable
              onPress={() => initiateAction('transfer')}
              style={[styles.actionButton]}
            >
              <View style={styles.actionIconContainer}>
                <Feather name="send" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.actionButtonText}>Transfer</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                router.push(`/register`);
              }}
              style={[styles.actionButton]}
            >
              <View style={styles.actionIconContainer}>
                <Feather name="plus" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.actionButtonText}>Add</Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push('/devices')}
              style={[styles.actionButton]}
            >
              <View style={styles.actionIconContainer}>
                <Feather name="smartphone" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.actionButtonText}>View All</Text>
            </Pressable>
            
            <Pressable
              onPress={() => initiateAction('report')}
              style={[styles.actionButton]}
            >
              <View style={styles.actionIconContainer}>
                <Feather name="alert-triangle" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.actionButtonText}>Report</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.devicesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Devices</Text>
            {hasMoreDevices && (
              <Pressable 
                style={styles.seeAllButton}
                onPress={() => setShowAllDevices(!showAllDevices)}
              >
                <Text style={styles.seeAll}>
                  {showAllDevices ? 'Show less' : 'See all'}
                </Text>
              </Pressable>
            )}
          </View>
          
          {displayDevices.map((device) => (
            <Pressable
              key={device.key}
              style={styles.deviceCard}
              onPress={() => {
                // Convert to StoreDevice before setting in store
                const storeDevice: StoreDevice = {
                  name: device.name,
                  imei: device.imei,
                  macAddress: device.macAddress,
                  id: device.id,
                  key: device.key,
                  ownership: device.ownership,
                  storage: device.storage,
                  color: device.color,
                  brand: device.brand,
                  registrationDate: device.registrationDate,
                  status: device.status
                };
                
                useDeviceStore.getState().setSelectedDevice(storeDevice);
                router.push({
                  pathname: '/view/[Id]',
                  params: { Id: device.id },
                });
              }}
            >
              <View style={styles.deviceCardContent}>
                <View style={styles.deviceCardLeft}>
                  <View style={styles.deviceTypeIcon}>
                    <Feather name="smartphone" size={12} color="#5A71E4" />
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName} numberOfLines={1}>{device.name}</Text>
                    <View style={styles.deviceDetailRow}>
                      <Text style={styles.deviceId}>{device.id}</Text>
                      {device.storage && <Text style={styles.deviceDetail}>{device.storage}</Text>}
                      {device.color && <Text style={styles.deviceDetail}>{device.color}</Text>}
                    </View>
                  </View>
                </View>
                <View style={styles.deviceCardRight}>
                  <View
                    style={[
                      styles.deviceBadge,
                      device.status === 'lost' || device.status === 'stolen' 
                        ? styles.reportedBadge 
                        : device.status === 'transferred'
                        ? styles.transferredBadge
                        : device.ownership ? styles.ownedBadge : styles.unownedBadge,
                    ]}
                  >
                    <Text style={[
                      styles.deviceBadgeText,
                      device.status === 'lost' || device.status === 'stolen' 
                        ? styles.reportedText 
                        : device.status === 'transferred'
                        ? styles.transferredText
                        : device.ownership ? styles.ownedText : styles.unownedText,
                    ]}>
                      {device.status === 'lost' ? 'Lost' : 
                       device.status === 'stolen' ? 'Stolen' :
                       device.status === 'transferred' ? 'Transferred' :
                       device.ownership ? 'Owned' : 'Unowned'}
                    </Text>
                  </View>
                  <Pressable 
                    onPress={() => initiateAction('remove', device)}
                    style={styles.removeButton}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <Feather name="trash-2" size={14} color="#E45A5A" />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Transfer Device Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTransferModal}
        onRequestClose={() => setShowTransferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transfer Device</Text>
              <Pressable onPress={() => setShowTransferModal(false)}>
                <Feather name="x" size={20} color="#222D3A" />
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle}>Select a device to transfer</Text>
            
            <ScrollView style={styles.modalDeviceList}>
              {devices.filter(device => 
                device.ownership && 
                device.status !== 'lost' && 
                device.status !== 'stolen' && 
                device.status !== 'transferred'
              ).map((device) => (
                <Pressable
                  key={device.key}
                  style={styles.modalDeviceItem}
                  onPress={() => initiateAction('transfer', device)}
                >
                  <View style={styles.modalDeviceIcon}>
                    <Feather name="smartphone" size={18} color="#5A71E4" />
                  </View>
                  <View style={styles.modalDeviceInfo}>
                    <Text style={styles.modalDeviceName}>{device.name}</Text>
                    <Text style={styles.modalDeviceId}>{device.id}</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#8494A9" />
                </Pressable>
              ))}
              
              {devices.filter(device => 
                device.ownership && 
                device.status !== 'lost' && 
                device.status !== 'stolen' &&
                device.status !== 'transferred'
              ).length === 0 && (
                <View style={styles.noDevicesMessage}>
                  <Feather name="info" size={20} color="#8494A9" />
                  <Text style={styles.noDevicesText}>
                    You don't have any devices eligible for transfer. Devices that are lost, stolen, or already transferred cannot be transferred.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* PIN Authentication Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPinModal}
        onRequestClose={() => {
          setShowPinModal(false);
          setPin('');
          setSelectedDeviceAction(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pinModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter PIN</Text>
              <Pressable 
                onPress={() => {
                  setShowPinModal(false);
                  setPin('');
                  setSelectedDeviceAction(null);
                }}
              >
                <Feather name="x" size={20} color="#222D3A" />
              </Pressable>
            </View>
            
            <Text style={styles.pinDescription}>
              {selectedDeviceAction?.type === 'transfer' ? 'Please enter your PIN to transfer this device' :
               selectedDeviceAction?.type === 'remove' ? 'Please enter your PIN to remove this device' :
               'Please enter your PIN to continue'}
            </Text>
            
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter 4-digit PIN"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              placeholderTextColor="#8494A9"
            />
            
            <Pressable 
              style={[styles.pinSubmitButton, pin.length === 4 && styles.pinSubmitButtonActive]}
              onPress={handlePinSubmit}
              disabled={pin.length !== 4}
            >
              <Text style={[styles.pinSubmitText, pin.length === 4 && styles.pinSubmitTextActive]}>
                Verify
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#222D3A',
  },
  statsCard: {
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#8C3BFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  statsContent: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statsTextContainer: {
    flex: 1,
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statsInfoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginRight: 6,
  },
  statsSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
    textAlign: 'center',
  },
  devicesContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#5A71E4',
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  deviceCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Take up available space
    marginRight: 8, // Add some margin to prevent overlap
  },
  deviceTypeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0, // Don't shrink the icon
  },
  deviceInfo: {
    flex: 1, // Take up available space
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 2,
  },
  deviceDetailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  deviceId: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#8494A9',
    marginRight: 6,
  },
  deviceDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#8494A9',
    backgroundColor: 'rgba(132, 148, 169, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  deviceCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0, // Don't shrink this container
  },
  deviceBadge: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  ownedBadge: {
    backgroundColor: 'rgba(90, 228, 126, 0.1)',
  },
  unownedBadge: {
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
  },
  reportedBadge: {
    backgroundColor: 'rgba(255, 173, 51, 0.1)',
  },
  transferredBadge: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
  },
  deviceBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  ownedText: {
    color: '#30B050',
  },
  unownedText: {
    color: '#E45A5A',
  },
  reportedText: {
    color: '#FF9A00',
  },
  transferredText: {
    color: '#5A71E4',
  },
  removeButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
  },
  modalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 16,
  },
  modalDeviceList: {
    flex: 1,
  },
  modalDeviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 148, 169, 0.1)',
  },
  modalDeviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalDeviceInfo: {
    flex: 1,
  },
  modalDeviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  modalDeviceId: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  noDevicesMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'rgba(132, 148, 169, 0.1)',
    borderRadius: 12,
    marginTop: 12,
  },
  noDevicesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginLeft: 12,
    flex: 1,
  },
  pinModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 24,
  },
  pinDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 16,
    textAlign: 'center',
  },
  pinInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 6,
    fontFamily: 'Inter-Bold',
  },
  pinSubmitButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  pinSubmitButtonActive: {
    backgroundColor: '#5A71E4',
  },
  pinSubmitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8494A9',
  },
  pinSubmitTextActive: {
    color: '#FFFFFF',
  },
});
