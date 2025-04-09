import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useDeviceStore } from '../store/store';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DeviceDetailsScreen() {
  const params = useLocalSearchParams();
  const storeDevices = useDeviceStore((state) => state.devices) || [];
  const [isExpanded, setIsExpanded] = useState(false);
  const storeDevice = useDeviceStore((state) => state.selectedDevice);

  // Use the device from store, or fallback to params
  const device = storeDevice || {
    name: params.name || 'Unknown Device',
    imei: params.imei || 'N/A',
    macAddress: params.macAddress || 'N/A',
    id: params.Id || 'Unknown',
    ownership: params.ownership === 'true',
    storage: params.storage || '',
    color: params.color || '',
    brand: params.brand || '',
    registrationDate: params.registrationDate || new Date().toISOString(),
    status: 'active'
  };

  const handleDeleteDevice = () => {
    Alert.alert(
      "Remove Device",
      "Are you sure you want to remove this device from your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => {
            // Mark device as removed in global state
            const devices = [...storeDevices];
            const deviceIndex = devices.findIndex(d => d.key === device.key);
            
            if (deviceIndex !== -1) {
              devices.splice(deviceIndex, 1);
              // Update store with devices
              useDeviceStore.getState().setDevices(devices);
            }
            
            router.back();
            router.push('/(tabs)');
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleTransferDevice = () => {
    // Set selected device in store first
    useDeviceStore.getState().setSelectedDevice(device);
    // Navigate to transfer screen 
    router.push('/devices/dev_1');
  };

  const handleReportDevice = () => {
    Alert.alert(
      "Report Device",
      "Report this device as lost or stolen?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Lost", 
          onPress: () => {
            updateDeviceStatus('lost');
            Alert.alert("Device Reported", "Your device has been reported as lost. We'll notify you if it's found.");
          }
        },
        { 
          text: "Stolen", 
          onPress: () => {
            updateDeviceStatus('stolen');
            Alert.alert("Device Reported", "Your device has been reported as stolen. Law enforcement has been notified.");
          }
        }
      ]
    );
  };

  const updateDeviceStatus = (status: 'active' | 'lost' | 'stolen') => {
    // Update status in global state
    const devices = [...storeDevices];
    const deviceIndex = devices.findIndex(d => d.key === device.key);
    
    if (deviceIndex !== -1) {
      devices[deviceIndex] = { ...devices[deviceIndex], status };
      // Update store with modified devices
      useDeviceStore.getState().setDevices(devices);
      // Update selected device
      useDeviceStore.getState().setSelectedDevice({...device, status});
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusColor = () => {
    switch(device.status) {
      case 'lost':
      case 'stolen':
        return 'rgba(255, 173, 51, 0.3)';
      default:
        return device.ownership 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'rgba(228, 90, 90, 0.3)';
    }
  };

  const getStatusText = () => {
    if (device.status === 'lost') return 'Lost';
    if (device.status === 'stolen') return 'Stolen';
    return device.ownership ? 'Owned' : 'Unowned';
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <AnimatedPressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={18} color="#222D3A" />
        </AnimatedPressable>
      </View>

      <Animated.View 
        style={styles.deviceCard}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <LinearGradient
          colors={['#5A71E4', '#8C3BFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.deviceGradient}
        >
          <View style={styles.deviceIcon}>
            <Feather name="smartphone" size={24} color="#FFF" />
          </View>
          <Text style={styles.deviceName}>{device.name}</Text>
          <View style={styles.deviceStatus}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>
                {getStatusText()}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View 
        style={styles.detailsContainer}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          <Pressable onPress={toggleExpand} style={styles.expandButton}>
            <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color="#5A71E4" />
          </Pressable>
        </View>
        
        <View style={styles.detailCard}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Device ID</Text>
            <Text style={styles.detailValue}>{device.id}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>IMEI Number</Text>
            <Text style={styles.detailValue}>{device.imei}</Text>
          </View>
          
          {isExpanded && (
            <>
              <View style={styles.divider} />
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>MAC Address</Text>
                <Text style={styles.detailValue}>{device.macAddress}</Text>
              </View>

              {device.brand && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Brand</Text>
                    <Text style={styles.detailValue}>{device.brand}</Text>
                  </View>
                </>
              )}

              {device.storage && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Storage</Text>
                    <Text style={styles.detailValue}>{device.storage}</Text>
                  </View>
                </>
              )}

              {device.color && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Color</Text>
                    <Text style={styles.detailValue}>{device.color}</Text>
                  </View>
                </>
              )}

              {device.registrationDate && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Registered</Text>
                    <Text style={styles.detailValue}>
                      {new Date(device.registrationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                </>
              )}
              
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={[
                  styles.statusChip, 
                  device.status === 'lost' || device.status === 'stolen' 
                    ? styles.reportedChip 
                    : device.ownership ? styles.ownedChip : styles.unownedChip
                ]}>
                  <Text style={[
                    styles.statusChipText,
                    device.status === 'lost' || device.status === 'stolen' 
                      ? styles.reportedChipText 
                      : device.ownership ? styles.ownedChipText : styles.unownedChipText
                  ]}>
                    {getStatusText()}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </Animated.View>
      
      <Animated.View 
        style={styles.actionsContainer}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <View style={styles.actionsRow}>
          <AnimatedPressable 
            style={styles.actionButton}
            onPress={handleTransferDevice}
            disabled={device.status === 'lost' || device.status === 'stolen'}
          >
            <View style={[styles.actionIcon, styles.primaryAction, 
              (device.status === 'lost' || device.status === 'stolen') && styles.disabledAction]}>
              <Feather name="refresh-cw" size={16} color="#FFF" />
            </View>
            <Text style={[styles.actionText, 
              (device.status === 'lost' || device.status === 'stolen') && styles.disabledText]}>
              Transfer
            </Text>
          </AnimatedPressable>
          
          <AnimatedPressable 
            style={styles.actionButton}
            onPress={handleReportDevice}
            disabled={device.status === 'lost' || device.status === 'stolen'}
          >
            <View style={[styles.actionIcon, styles.secondaryAction,
              (device.status === 'lost' || device.status === 'stolen') && styles.disabledAction]}>
              <Feather name="flag" size={16} color="#FFF" />
            </View>
            <Text style={[styles.actionText,
              (device.status === 'lost' || device.status === 'stolen') && styles.disabledText]}>
              Report
            </Text>
          </AnimatedPressable>
          
          <AnimatedPressable 
            style={styles.actionButton}
            onPress={handleDeleteDevice}
          >
            <View style={[styles.actionIcon, styles.dangerAction]}>
              <Feather name="trash-2" size={16} color="#FFF" />
            </View>
            <Text style={styles.actionText}>Remove</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>
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
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
  },
  deviceGradient: {
    padding: 16,
    alignItems: 'center',
  },
  deviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  deviceStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  detailsContainer: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expandButton: {
    padding: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
  },
  detailItem: {
    paddingVertical: 6,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8494A9',
    marginBottom: 3,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#222D3A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(132, 148, 169, 0.15)',
  },
  statusChip: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 2,
  },
  ownedChip: {
    backgroundColor: 'rgba(90, 228, 126, 0.1)',
  },
  unownedChip: {
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
  },
  reportedChip: {
    backgroundColor: 'rgba(255, 173, 51, 0.1)',
  },
  statusChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  ownedChipText: {
    color: '#30B050',
  },
  unownedChipText: {
    color: '#E45A5A',
  },
  reportedChipText: {
    color: '#FF9A00',
  },
  actionsContainer: {
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    width: '30%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  primaryAction: {
    backgroundColor: '#5A71E4',
  },
  secondaryAction: {
    backgroundColor: '#5E5EBF',
  },
  dangerAction: {
    backgroundColor: '#E45A5A',
  },
  disabledAction: {
    backgroundColor: '#CCCCCC',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
  },
  disabledText: {
    color: '#8494A9',
  },
});