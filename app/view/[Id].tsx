import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useDeviceStore } from '../store/store';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DeviceDetailsScreen() {
  const params = useLocalSearchParams();
  const storeDevice = useDeviceStore((state) => state.selectedDevice);
  const [isExpanded, setIsExpanded] = useState(false);

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
            // In a real app, we would remove the device from the store
            // For now just navigate back since we don't have removeDevice in store
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleTransferDevice = () => {
    // Set selected device in store first
    useDeviceStore.getState().setSelectedDevice(device);
    // Navigate to transfer screen (which we'll create)
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
            Alert.alert("Device Reported", "Your device has been reported as lost. We'll notify you if it's found.");
          }
        },
        { 
          text: "Stolen", 
          onPress: () => {
            Alert.alert("Device Reported", "Your device has been reported as stolen. Law enforcement has been notified.");
          }
        }
      ]
    );
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedPressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color="#222D3A" />
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
            <Feather name="smartphone" size={28} color="#FFF" />
          </View>
          <Text style={styles.deviceName}>{device.name}</Text>
          <View style={styles.deviceStatus}>
            <View style={device.ownership ? styles.ownedBadge : styles.unownedBadge}>
              <Text style={device.ownership ? styles.ownedText : styles.unownedText}>
                {device.ownership ? 'Owned' : 'Unowned'}
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
            <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color="#5A71E4" />
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
          >
            <View style={[styles.actionIcon, styles.primaryAction]}>
              <Feather name="refresh-cw" size={18} color="#FFF" />
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </AnimatedPressable>
          
          <AnimatedPressable 
            style={styles.actionButton}
            onPress={handleReportDevice}
          >
            <View style={[styles.actionIcon, styles.secondaryAction]}>
              <Feather name="flag" size={18} color="#FFF" />
            </View>
            <Text style={styles.actionText}>Report</Text>
          </AnimatedPressable>
          
          <AnimatedPressable 
            style={styles.actionButton}
            onPress={handleDeleteDevice}
          >
            <View style={[styles.actionIcon, styles.dangerAction]}>
              <Feather name="trash-2" size={18} color="#FFF" />
            </View>
            <Text style={styles.actionText}>Remove</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>
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
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  deviceGradient: {
    padding: 20,
    alignItems: 'center',
  },
  deviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  deviceStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ownedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  unownedBadge: {
    backgroundColor: 'rgba(228, 90, 90, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  ownedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
  unownedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expandButton: {
    padding: 5,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },
  detailItem: {
    paddingVertical: 8,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#8494A9',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(132, 148, 169, 0.15)',
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    width: '30%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#222D3A',
  },
});