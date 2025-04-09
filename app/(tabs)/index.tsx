import { useRouter } from 'expo-router';
import { useDeviceStore } from '../store/store';
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
  status?: 'active' | 'reported' | 'lost' | 'stolen';
}

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
      // Add store devices to the beginning of the list, preserving initial ones
      const combinedDevices = [...storeDevices, ...devices];
      
      // Filter out duplicates based on key
      const uniqueDevices = combinedDevices.filter((device, index, self) =>
        index === self.findIndex((d) => d.key === device.key)
      );
      
      setDevices(uniqueDevices);
    }
  }, [storeDevices]);

  const handleTransferDevice = (device: Device) => {
    useDeviceStore.getState().setSelectedDevice(device);
    setShowTransferModal(false);
    router.push(`/devices/dev_1`);
  };

  // Display only the first 3 devices unless "See all" is clicked
  const displayDevices = showAllDevices ? devices : devices.slice(0, 3);
  const hasMoreDevices = devices.length > 3;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>Adnan</Text>
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
          <Text style={styles.statsNumber}>{devices.length}</Text>
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
              useDeviceStore.getState().setSelectedDevice(device);
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
                      : device.ownership ? styles.ownedBadge : styles.unownedBadge,
                  ]}
                >
                  <Text style={[
                    styles.deviceBadgeText,
                    device.status === 'lost' || device.status === 'stolen' 
                      ? styles.reportedText 
                      : device.ownership ? styles.ownedText : styles.unownedText,
                  ]}>
                    {device.status === 'lost' ? 'Lost' : 
                     device.status === 'stolen' ? 'Stolen' : 
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
        visible={showTransferModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTransferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Device to Transfer</Text>
              <Pressable onPress={() => setShowTransferModal(false)}>
                <Feather name="x" size={18} color="#222D3A" />
              </Pressable>
            </View>
            <ScrollView style={styles.deviceList}>
              {devices.filter(d => d.ownership).map((device) => (
                <Pressable
                  key={device.key}
                  style={styles.deviceOption}
                  onPress={() => handleTransferDevice(device)}
                >
                  <View style={styles.deviceOptionIcon}>
                    <Feather name="smartphone" size={14} color="#5A71E4" />
                  </View>
                  <View style={styles.deviceOptionInfo}>
                    <Text style={styles.deviceOptionName}>{device.name}</Text>
                    <Text style={styles.deviceOptionId}>{device.id}</Text>
                  </View>
                  <Feather name="chevron-right" size={14} color="#8494A9" />
                </Pressable>
              ))}
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
    padding: 14,
    paddingTop: 45,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 14,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#222D3A',
  },
  statsCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  statsContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFF',
    marginTop: 2,
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFF',
    marginTop: 6,
  },
  statsSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
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
    fontSize: 11,
    color: '#222D3A',
  },
  devicesContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllButton: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#5A71E4',
  },
  deviceCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
  },
  deviceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  deviceCardLeft: {
    flex: 1,
    marginRight: 6,
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
    marginRight: 8,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#222D3A',
    marginBottom: 2,
  },
  deviceId: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#8494A9',
  },
  deviceCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceBadge: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 6,
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
  deviceBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 9,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    width: '100%',
    maxHeight: '60%',
    padding: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 148, 169, 0.1)',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  deviceList: {
    maxHeight: 300,
  },
  deviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 148, 169, 0.1)',
  },
  deviceOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deviceOptionInfo: {
    flex: 1,
  },
  deviceOptionName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#222D3A',
  },
  deviceOptionId: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#8494A9',
    marginTop: 1,
  },
});
