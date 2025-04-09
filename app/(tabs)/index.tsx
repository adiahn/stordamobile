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
}

export default function HomeScreen() {
  const router = useRouter();
  const storeDevices = useDeviceStore((state) => state.devices);
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  // Combine store devices with the initial hardcoded ones if needed
  const [devices, setDevices] = useState<Device[]>([
    {
      name: 'iPhone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      id: 'SRD-21112',
      ownership: true,
      key: 1,
    },
    {
      name: 'iPhone 11 Pro',
      imei: '3121321122112',
      id: 'SRD-21112',
      macAddress: '30291masmdsdmas',
      ownership: false,
      key: 2,
    },
    {
      name: 'Samsung Z Fold 3',
      imei: '3121321122112',
      id: 'SRD-21112',
      macAddress: '30291masmasdmas',
      ownership: false,
      key: 3,
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

  return (
    <View style={styles.container}>
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
            <Feather name="shield" size={22} color="#fff" />
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
              <Feather name="send" size={18} color="#5A71E4" />
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
              <Feather name="plus" size={18} color="#5A71E4" />
            </View>
            <Text style={styles.actionButtonText}>Add Device</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.devicesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Devices</Text>
          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        
        {devices.map((device, index) => (
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
                  <Feather name="smartphone" size={14} color="#5A71E4" />
                </View>
                <View>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceDetailLabel}>Device ID:</Text>
                    <Text style={styles.deviceDetailValue}>{device.id}</Text>
                  </View>
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceDetailLabel}>IMEI:</Text>
                    <Text style={styles.deviceDetailValue}>{device.imei}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.deviceCardRight}>
                <View
                  style={[
                    styles.ownershipBadge,
                    device.ownership ? styles.ownedBadge : styles.unownedBadge,
                  ]}
                >
                  <Text style={[
                    styles.ownershipBadgeText,
                    device.ownership ? styles.ownedText : styles.unownedText,
                  ]}>
                    {device.ownership ? 'Owned' : 'Unowned'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color="#8494A9" />
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
                <Feather name="x" size={20} color="#222D3A" />
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
                    <Feather name="smartphone" size={16} color="#5A71E4" />
                  </View>
                  <View style={styles.deviceOptionInfo}>
                    <Text style={styles.deviceOptionName}>{device.name}</Text>
                    <Text style={styles.deviceOptionId}>{device.id}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color="#8494A9" />
                </Pressable>
              ))}
            </ScrollView>
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
    padding: 16,
    paddingTop: 50,
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
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#222D3A',
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statsContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
    marginTop: 2,
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFF',
    marginTop: 8,
  },
  statsSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
  },
  devicesContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#5A71E4',
  },
  deviceCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 10,
  },
  deviceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  deviceCardLeft: {
    flex: 1,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 3,
  },
  deviceDetails: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  deviceDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#8494A9',
    marginRight: 4,
  },
  deviceDetailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#222D3A',
  },
  deviceCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownershipBadge: {
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
  ownershipBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  ownedText: {
    color: '#30B050',
  },
  unownedText: {
    color: '#E45A5A',
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
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 148, 169, 0.1)',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
  },
  deviceList: {
    maxHeight: 350,
  },
  deviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 148, 169, 0.1)',
  },
  deviceOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deviceOptionInfo: {
    flex: 1,
  },
  deviceOptionName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  deviceOptionId: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#8494A9',
    marginTop: 2,
  },
});
