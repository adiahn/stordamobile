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
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(600).delay(100)}
      >
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>Adnan</Text>
      </Animated.View>

      <AnimatedLinearGradient
        colors={['#5A71E4', '#8C3BFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCard}
        entering={FadeInUp.duration(600).delay(200)}
      >
        <View style={styles.statsContent}>
          <View style={styles.iconCircle}>
            <Feather name="shield" size={26} color="#fff" />
          </View>
          <Text style={styles.statsTitle}>Storda Protection</Text>
          <Text style={styles.statsNumber}>{devices.length}</Text>
          <Text style={styles.statsSubtitle}>Devices Protected</Text>
        </View>
      </AnimatedLinearGradient>

      <Animated.View 
        style={styles.actionsContainer}
        entering={FadeInUp.duration(600).delay(300)}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionButtons}>
          <AnimatedPressable
            onPress={() => setShowTransferModal(true)}
            style={[styles.actionButton]}
          >
            <View style={styles.actionIconContainer}>
              <Feather name="send" size={22} color="#5A71E4" />
            </View>
            <Text style={styles.actionButtonText}>Transfer Device</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => {
              router.push(`/register`);
            }}
            style={[styles.actionButton]}
          >
            <View style={styles.actionIconContainer}>
              <Feather name="plus" size={22} color="#5A71E4" />
            </View>
            <Text style={styles.actionButtonText}>Add Device</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.devicesContainer}
        entering={FadeInUp.duration(600).delay(400)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Devices</Text>
          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        
        {devices.map((device, index) => (
          <AnimatedPressable
            key={device.key}
            style={styles.deviceCard}
            entering={FadeInRight.duration(400).delay(500 + index * 100)}
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
                  <Feather name="smartphone" size={16} color="#5A71E4" />
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
                <Feather name="chevron-right" size={20} color="#8494A9" />
              </View>
            </View>
          </AnimatedPressable>
        ))}
      </Animated.View>

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
                <Feather name="x" size={24} color="#222D3A" />
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
                    <Feather name="smartphone" size={18} color="#5A71E4" />
                  </View>
                  <View style={styles.deviceOptionInfo}>
                    <Text style={styles.deviceOptionName}>{device.name}</Text>
                    <Text style={styles.deviceOptionId}>{device.id}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#8494A9" />
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
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8494A9',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 26,
    color: '#222D3A',
  },
  statsCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#8C3BFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  statsContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFF',
    marginTop: 4,
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 42,
    color: '#FFF',
    marginTop: 12,
  },
  statsSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  actionsContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
  },
  devicesContainer: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#5A71E4',
  },
  deviceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  deviceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  deviceCardLeft: {
    flex: 1,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 6,
  },
  deviceDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  deviceDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8494A9',
    marginRight: 6,
  },
  deviceDetailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#222D3A',
  },
  deviceCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownershipBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 12,
  },
  ownedBadge: {
    backgroundColor: 'rgba(90, 228, 126, 0.1)',
  },
  unownedBadge: {
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
  },
  ownershipBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 148, 169, 0.1)',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
  },
  deviceList: {
    maxHeight: 400,
  },
  deviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 148, 169, 0.1)',
  },
  deviceOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceOptionInfo: {
    flex: 1,
  },
  deviceOptionName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
  },
  deviceOptionId: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
    marginTop: 2,
  },
});
