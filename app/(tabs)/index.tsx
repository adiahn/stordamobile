import { useRouter } from 'expo-router';
import { useDeviceStore, Device as StoreDevice } from '../store/store';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Modal } from 'react-native';
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
  name: "Adnan Muhammad Mukhtar",
  email: "adnan@storda.ng",
  phone: "+2347011313752",
  country: "Nigeria"
};

export default function HomeScreen() {
  const router = useRouter();
  const storeDevices = useDeviceStore((state) => state.devices);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAllDevices, setShowAllDevices] = useState(false);
  
  // Combine store devices with the initial hardcoded ones if needed
  const [devices, setDevices] = useState<Device[]>([
    {
      name: 'iPhone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      id: 'SRD-21112',
      ownership: true,
      key: 1,
      status: 'active'
    },
    {
      name: 'iPhone 11 Pro',
      imei: '3121321122112',
      id: 'SRD-21112',
      macAddress: '30291masmdsdmas',
      ownership: false,
      key: 2,
      status: 'active'
    },
    {
      name: 'Samsung Z Fold 3',
      imei: '3121321122112',
      id: 'SRD-21112',
      macAddress: '30291masmasdmas',
      ownership: false,
      key: 3,
      status: 'active'
    },
    {
      name: 'Google Pixel 6',
      imei: '3121321122112',
      id: 'SRD-21113',
      macAddress: '30291masmasdmas',
      ownership: true,
      key: 4,
      status: 'active'
    },
    {
      name: 'OnePlus 9 Pro',
      imei: '3121321122112',
      id: 'SRD-21114',
      macAddress: '30291masmasdmas',
      ownership: true,
      key: 5,
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>{USER_PROFILE.name.split(' ')[0]}</Text>
      </View>

      <LinearGradient
        colors={['#5A71E4', '#8C3BFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCard}
      >
        <View style={styles.statsContent}>
          <View style={styles.iconCircle}>
            <Feather name="shield" size={20} color="#fff" />
          </View>
          <Text style={styles.statsTitle}>Storda Protection</Text>
          <Text style={styles.statsNumber}>{activeDeviceCount}</Text>
          <Text style={styles.statsSubtitle}>Devices Protected</Text>
        </View>
      </LinearGradient>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionButtons}>
          <Pressable
            onPress={() => setShowTransferModal(true)}
            style={[styles.actionButton]}
          >
            <View style={styles.actionIconContainer}>
              <Feather name="send" size={16} color="#5A71E4" />
            </View>
            <Text style={styles.actionButtonText}>Transfer Device</Text>
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
            <Text style={styles.actionButtonText}>Add Device</Text>
          </Pressable>
          
          <Pressable
            onPress={() => router.push('/devices')}
            style={[styles.actionButton]}
          >
            <View style={styles.actionIconContainer}>
              <Feather name="smartphone" size={16} color="#5A71E4" />
            </View>
            <Text style={styles.actionButtonText}>View Devices</Text>
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
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceId}>{device.id}</Text>
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
                <Feather name="chevron-right" size={14} color="#8494A9" />
              </View>
            </View>
          </Pressable>
        ))}
      </View>

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
                  onPress={() => handleTransferDevice(device)}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
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
    marginBottom: 24,
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
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  statsSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    padding: 12,
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
    marginBottom: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
    textAlign: 'center',
  },
  devicesContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  },
  deviceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  deviceCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceTypeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  deviceId: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  deviceCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceBadge: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 10,
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
});
