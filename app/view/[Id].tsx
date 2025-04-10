import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useDeviceStore } from '../store/store';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// PIN for authentication
const USER_PIN = "1234"; // This would be stored securely in a real app

export default function DeviceDetailsScreen() {
  const params = useLocalSearchParams();
  const storeDevices = useDeviceStore((state) => state.devices) || [];
  const [isExpanded, setIsExpanded] = useState(false);
  const storeDevice = useDeviceStore((state) => state.selectedDevice);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedAction, setSelectedAction] = useState<{
    type: 'transfer' | 'remove' | 'report';
    reportType?: 'lost' | 'stolen';
  } | null>(null);

  // Use the device from store, or fallback to params
  const device = storeDevice || {
    name: String(params.name || 'Unknown Device'),
    imei: String(params.imei || 'N/A'),
    macAddress: String(params.macAddress || 'N/A'),
    id: String(params.Id || 'Unknown'),
    ownership: params.ownership === 'true',
    storage: String(params.storage || ''),
    color: String(params.color || ''),
    brand: String(params.brand || ''),
    registrationDate: String(params.registrationDate || new Date().toISOString()),
    status: 'active',
    key: Date.now() // Add a key for the fallback device
  };

  // Automatically dismiss keyboard when PIN is 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      Keyboard.dismiss();
    }
  }, [pin]);

  const handlePinSubmit = () => {
    if (pin === USER_PIN) {
      setShowPinModal(false);
      setPin('');

      if (!selectedAction) return;

      if (selectedAction.type === 'transfer') {
        // Navigate to transfer screen after PIN verification
        useDeviceStore.getState().setSelectedDevice(device);
        router.push('/devices/dev_1');
      } else if (selectedAction.type === 'remove') {
        // Remove device after PIN verification
        if (device.key) {
          useDeviceStore.getState().removeDevice(device.key);
        }
        router.back();
        router.push('/(tabs)');
      } else if (selectedAction.type === 'report' && selectedAction.reportType) {
        // Report device after PIN verification
        updateDeviceStatus(selectedAction.reportType);
        Alert.alert(
          "Device Reported", 
          selectedAction.reportType === 'lost'
            ? "Your device has been reported as lost. We'll notify you if it's found."
            : "Your device has been reported as stolen. Law enforcement has been notified."
        );
      }
    } else {
      Alert.alert("Invalid PIN", "The PIN you entered is incorrect. Please try again.");
    }
  };

  const initiateAction = (type: 'transfer' | 'remove' | 'report', reportType?: 'lost' | 'stolen') => {
    if (type === 'transfer' && (device.status === 'lost' || device.status === 'stolen' || device.status === 'transferred')) {
      Alert.alert(
        "Cannot Transfer Device",
        device.status === 'transferred'
          ? "This device has already been transferred."
          : "You cannot transfer a device that has been reported as lost or stolen.",
        [{ text: "OK" }]
      );
      return;
    }

    if (type === 'remove' && device.status === 'transferred') {
      Alert.alert(
        "Cannot Remove Device",
        "This device has been transferred to another user and cannot be removed from your history.",
        [{ text: "OK" }]
      );
      return;
    }

    setSelectedAction({ type, reportType });
    setShowPinModal(true);
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
          onPress: () => initiateAction('remove'),
          style: "destructive"
        }
      ]
    );
  };

  const handleTransferDevice = () => {
    initiateAction('transfer');
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
          onPress: () => initiateAction('report', 'lost')
        },
        { 
          text: "Stolen", 
          onPress: () => initiateAction('report', 'stolen')
        }
      ]
    );
  };

  const updateDeviceStatus = (status: 'active' | 'lost' | 'stolen' | 'transferred', transferredTo?: string) => {
    if (device.key) {
      // Use the new updateDeviceStatus function from the store
      useDeviceStore.getState().updateDeviceStatus(device.key, status, transferredTo);
      
      // Update selected device in local state for UI updates
      useDeviceStore.getState().setSelectedDevice({
        ...device, 
        status,
        ...(transferredTo ? { transferredTo } : {})
      });
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
    if (device.status === 'transferred') return 'Transferred';
    return device.ownership ? 'Owned' : 'Unowned';
  };

  return (
    <KeyboardAvoidingView 
      style={{flex: 1}} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
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
            end={{ x: 1, y: 0 }}
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
                      <Text style={styles.detailLabel}>Registration Date</Text>
                      <Text style={styles.detailValue}>
                        {new Date(device.registrationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
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
          <View style={styles.actionRow}>
            {(device.status !== 'transferred' && device.ownership) && (
              <AnimatedPressable
                onPress={handleReportDevice}
                style={styles.actionButton}
              >
                <View style={[styles.actionIcon, styles.reportIcon]}>
                  <Feather name="alert-triangle" size={16} color="#FF9A00" />
                </View>
                <Text style={styles.actionText}>Report</Text>
              </AnimatedPressable>
            )}
            
            {(device.status !== 'transferred' && device.ownership) && (
              <AnimatedPressable
                onPress={handleTransferDevice}
                style={styles.actionButton}
              >
                <View style={[styles.actionIcon, styles.transferIcon]}>
                  <Feather name="send" size={16} color="#5A71E4" />
                </View>
                <Text style={styles.actionText}>Transfer</Text>
              </AnimatedPressable>
            )}
            
            <AnimatedPressable
              onPress={handleDeleteDevice}
              style={styles.actionButton}
            >
              <View style={[styles.actionIcon, styles.deleteIcon]}>
                <Feather name="trash-2" size={16} color="#E45A5A" />
              </View>
              <Text style={styles.actionText}>Remove</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        <Modal
          visible={showPinModal}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setShowPinModal(false);
            setPin('');
            setSelectedAction(null);
          }}
        >
          <KeyboardAvoidingView 
            style={{flex: 1}} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.pinModalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Enter PIN</Text>
                  <Pressable 
                    onPress={() => {
                      setShowPinModal(false);
                      setPin('');
                      setSelectedAction(null);
                    }}
                  >
                    <Feather name="x" size={20} color="#222D3A" />
                  </Pressable>
                </View>
                
                <Text style={styles.pinDescription}>
                  {selectedAction?.type === 'transfer' ? 'Please enter your PIN to transfer this device' :
                   selectedAction?.type === 'remove' ? 'Please enter your PIN to remove this device' :
                   selectedAction?.type === 'report' && selectedAction?.reportType === 'lost' ? 'Please enter your PIN to report this device as lost' :
                   selectedAction?.type === 'report' && selectedAction?.reportType === 'stolen' ? 'Please enter your PIN to report this device as stolen' :
                   'Please enter your PIN to continue'}
                </Text>
                
                <TextInput
                  style={styles.pinInput}
                  value={pin}
                  onChangeText={(text) => {
                    // Only allow digits and limit to 4 characters
                    const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 4);
                    setPin(cleanedText);
                  }}
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
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  deviceStatus: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
  },
  expandButton: {
    padding: 4,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  detailItem: {
    paddingVertical: 10,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
    backgroundColor: 'rgba(132, 148, 169, 0.1)',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '31%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportIcon: {
    backgroundColor: 'rgba(255, 154, 0, 0.1)',
  },
  transferIcon: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
  },
  deleteIcon: {
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pinModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 24,
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