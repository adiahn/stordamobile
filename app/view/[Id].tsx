import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal, TextInput, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { useDeviceStore, Device } from '../store/store';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const USER_PIN = "1234"; 

// Extended device interface that uses the base Device type
interface ExtendedDevice extends Device {
  // Ensure required properties are required in the extended interface
  ownership: boolean;
  registrationDate: string;
  status: NonNullable<Device['status']>;
  key: number;
}

export default function DeviceDetailsScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    imei?: string;
    macAddress?: string;
    Id?: string;
    ownership?: string;
    storage?: string;
    color?: string;
    brand?: string;
    registrationDate?: string;
    registeredBy?: string;
    currentOwner?: string;
    ownerNIN?: string;
  }>();
  
  const storeDevices = useDeviceStore((state) => state.devices) || [];
  const [isExpanded, setIsExpanded] = useState(false);
  const storeDevice = useDeviceStore((state) => state.selectedDevice) as ExtendedDevice | undefined;
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedAction, setSelectedAction] = useState<{
    type: 'transfer' | 'remove' | 'report';
    reportType?: 'lost' | 'stolen';
  } | null>(null);

const device: ExtendedDevice = storeDevice || {
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
    key: Date.now(),
    registeredBy: String(params.registeredBy || ''),
    currentOwner: String(params.currentOwner || ''),
    ownerNIN: String(params.ownerNIN || '12345678912')
};

  useEffect(() => {
    if (pin.length === 4) {
      Keyboard.dismiss();
    }
  }, [pin]);

  const handlePinSubmit = () => {
    try {
      if (pin === USER_PIN) {
        setShowPinModal(false);
        setPin('');

        if (!selectedAction) {
          console.error("No action selected");
          return;
        }

        if (selectedAction.type === 'transfer') {
          // Navigate to transfer screen after PIN verification
          useDeviceStore.getState().setSelectedDevice(device);
          router.push('/devices/dev_1');
        } else if (selectedAction.type === 'remove') {
          // Remove device after PIN verification
          if (!device.key) {
            Alert.alert("Error", "Device key is missing, cannot remove device");
            return;
          }
          
          try {
            useDeviceStore.getState().removeDevice(device.key);
            router.back();
            router.push('/(tabs)');
          } catch (error) {
            console.error("Error removing device:", error);
            Alert.alert("Error", "Failed to remove device. Please try again.");
          }
        } else if (selectedAction.type === 'report' && selectedAction.reportType) {
          // Report device after PIN verification
          try {
            updateDeviceStatus(selectedAction.reportType);
            Alert.alert(
              "Device Reported", 
              selectedAction.reportType === 'lost'
                ? "Your device has been reported as lost. We'll notify you if it's found."
                : "Your device has been reported as stolen. Law enforcement has been notified."
            );
          } catch (error) {
            console.error("Error reporting device:", error);
            Alert.alert("Error", "Failed to report device. Please try again.");
          }
        }
      } else {
        Alert.alert("Invalid PIN", "The PIN you entered is incorrect. Please try again.");
      }
    } catch (error) {
      console.error("Error in PIN submission:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const initiateAction = (type: 'transfer' | 'remove' | 'report', reportType?: 'lost' | 'stolen') => {
    try {
      // Validate device status before attempting certain actions
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
    } catch (error) {
      console.error("Error initiating action:", error);
      Alert.alert("Error", "Failed to initiate action. Please try again.");
    }
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
    // Transfer device without requiring verification
    initiateAction('transfer');
  };

  const handleReportDevice = () => {
    // Check if device ownership is verified 
    if (device.verificationStatus !== 'verified') {
      Alert.alert(
        "Verification Required",
        "To report a device as lost or stolen, the device must be verified. Please complete the verification process first.",
        [
          { text: "OK" }
        ]
      );
      return;
    }
  
    Alert.alert(
      "Report Device",
      "Report this device as lost or stolen? This will alert authorities and block the device from being transferred.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Lost", 
          onPress: () => showReportForm('lost')
        },
        { 
          text: "Stolen", 
          onPress: () => showReportForm('stolen')
        }
      ]
    );
  };

  // Handle unreporting a device that was previously reported lost/stolen
  const handleUnreportDevice = () => {
    Alert.alert(
      "Unreport Device",
      "Do you want to mark this device as found/recovered? This will change the status back to active.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, Unreport",
          onPress: () => {
            try {
              if (!device.key) {
                throw new Error("Device key is missing");
              }
              
              useDeviceStore.getState().unreportDevice(device.key);
              
              // Update the local device state
              const updatedDevice = useDeviceStore.getState().selectedDevice as ExtendedDevice;
              if (updatedDevice) {
                Alert.alert(
                  "Device Unreported",
                  "Your device has been marked as recovered and is now active again.",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.error("Error unreporting device:", error);
              Alert.alert("Error", "Failed to unreport device. Please try again.");
            }
          }
        }
      ]
    );
  };

  // State for recovery form modal
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);
  const [recoveryInfo, setRecoveryInfo] = useState({
    recoveredBy: '',
    recoveryLocation: '',
    recoveryDetails: '',
    contactInfo: '',
  });
  
  // Handle reporting a device recovery (by someone who found it)
  const handleReportRecovery = () => {
    if (!device.key) {
      Alert.alert("Error", "Device information incomplete. Cannot report recovery.");
      return;
    }
    
    // Navigate to the recovery page with device info
    router.push({
      pathname: '/devices/recovery',
      params: {
        id: device.id,
        key: String(device.key)
      }
    });
  };
  
  // Handle submitting recovery information
  const handleRecoverySubmit = () => {
    // Validate required fields
    if (!recoveryInfo.recoveredBy.trim() || !recoveryInfo.recoveryLocation.trim() || !recoveryInfo.contactInfo.trim()) {
      Alert.alert("Required Information", "Please fill in all required fields.");
      return;
    }
    
    try {
      if (!device.key) {
        throw new Error("Device key is missing");
      }
      
      useDeviceStore.getState().markDeviceRecovered(device.key, recoveryInfo);
      setShowRecoveryForm(false);
      
      // Reset form
      setRecoveryInfo({
        recoveredBy: '',
        recoveryLocation: '',
        recoveryDetails: '',
        contactInfo: '',
      });
      
      Alert.alert(
        "Recovery Reported",
        "Thank you for reporting this recovery. The owner has been notified and will contact you shortly.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error reporting recovery:", error);
      Alert.alert("Error", "Failed to report recovery. Please try again.");
    }
  };

  // New state for showing recovery details
  const [showRecoveryDetails, setShowRecoveryDetails] = useState(false);
  
  // Function to confirm a reported recovery and mark device as active
  const handleConfirmRecovery = () => {
    Alert.alert(
      "Confirm Recovery",
      "Do you confirm that you have received your device? This will mark the device as active again.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm Recovery",
          onPress: () => {
            try {
              if (!device.key) {
                throw new Error("Device key is missing");
              }
              
              // First unreport the device
              useDeviceStore.getState().unreportDevice(device.key);
              
              // Then update the recovery verification status
              const updatedDevice = {...device};
              if (updatedDevice.recoveryInfo) {
                updatedDevice.recoveryInfo.isVerified = true;
                updatedDevice.recoveryInfo.ownerConfirmationDate = new Date().toISOString();
                useDeviceStore.getState().setSelectedDevice(updatedDevice);
              }
              
              Alert.alert(
                "Recovery Confirmed",
                "Your device has been marked as recovered and is now active again.",
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error("Error confirming recovery:", error);
              Alert.alert("Error", "Failed to confirm recovery. Please try again.");
            }
          }
        }
      ]
    );
  };

  // New state for case information
  const [reportInfo, setReportInfo] = useState({
    caseNumber: '',
    location: '',
    date: new Date().toISOString(),
    details: '',
  });
  
  // New state for showing report form modal
  const [showReportFormType, setShowReportFormType] = useState<'lost' | 'stolen' | null>(null);
  
  const showReportForm = (type: 'lost' | 'stolen') => {
    setShowReportFormType(type);
    // Here you would show a modal form
    // For now, we'll just set the type and continue with the action
    initiateAction('report', type);
  };
  
  // Handle report form submission
  const handleReportSubmit = () => {
    // Validate required fields
    if (!reportInfo.location.trim()) {
      Alert.alert("Required Information", "Please enter the location where the device was lost/stolen.");
      return;
    }
    
    // Submit report data and start verification process
    if (showReportFormType) {
      initiateAction('report', showReportFormType);
    }
    setShowReportFormType(null);
  };

  const updateDeviceStatus = (status: 'active' | 'lost' | 'stolen' | 'transferred', transferredTo?: string) => {
    try {
      if (!device.key) {
        throw new Error("Device key is missing");
      }
      
      // Create report data for lost/stolen devices
      const reportData = (status === 'lost' || status === 'stolen') ? {
        reportAuthorities: {
          reportId: `RPT-${Math.floor(100000 + Math.random() * 900000)}`,
          reportDate: new Date().toISOString(),
          reportType: status === 'stolen' ? 'police' as const : 'other' as const,
          reportStatus: 'pending' as const,
          caseNumber: reportInfo.caseNumber || undefined,
        }
      } : {};
      
      useDeviceStore.getState().updateDeviceStatus(device.key, status, transferredTo);      
      
      // Update selected device in store with new status
      useDeviceStore.getState().setSelectedDevice({
        ...device, 
        status,
        ...(transferredTo ? { transferredTo } : {}),
        ...reportData
      });
      
      // For stolen devices, show information about police reporting
      if (status === 'stolen') {
        setTimeout(() => {
          Alert.alert(
            "Police Report Information",
            "For stolen devices, we recommend filing a police report. Would you like information on how to do this?",
            [
              {
                text: "No Thanks",
                style: "cancel"
              },
              {
                text: "Show Information",
                onPress: () => showPoliceReportInfo()
              }
            ]
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating device status:", error);
      throw error; // Re-throw to allow caller to handle
    }
  };
  
  // Function to show police report information
  const showPoliceReportInfo = () => {
    Alert.alert(
      "Filing a Police Report",
      "1. Visit your local police station\n" +
      "2. Bring your device information (IMEI: " + device.imei + ")\n" +
      "3. Get a police report number\n" +
      "4. Update your Storda account with the case number\n\n" +
      "Your report ID from Storda is: " + (device.reportAuthorities?.reportId || "Not yet assigned"),
      [{ text: "OK" }]
    );
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
  
  // Mask NIN number to show only last 4 digits
  const getMaskedNIN = (nin: string = '') => {
    if (!nin || nin.length < 4) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${nin.slice(-4)}`;
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
            
            {/* Show status info for reported devices */}
            {(device.status === 'lost' || device.status === 'stolen') && (
              <View style={styles.reportInfo}>
                <Text style={styles.reportInfoText}>
                  {device.status === 'lost' 
                    ? "This device has been reported as lost" 
                    : "This device has been reported as stolen"}
                </Text>
                {device.reportAuthorities?.reportDate && (
                  <Text style={styles.reportInfoDate}>
                    Reported on: {new Date(device.reportAuthorities.reportDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Recovery Info Card - Show when device has recovery info */}
        {device.recoveryInfo && (
          <Animated.View 
            style={styles.recoveryInfoCard}
            entering={FadeInUp.duration(500).delay(150)}
          >
            <View style={styles.recoveryInfoHeader}>
              <View style={styles.recoveryIcon}>
                <Feather name="alert-circle" size={20} color="#5A71E4" />
              </View>
              <View style={styles.recoveryTextContainer}>
                <Text style={styles.recoveryTitle}>Device Recovery Reported</Text>
                <Text style={styles.recoverySubtitle}>
                  Someone has found your device and reported it
                </Text>
              </View>
              <Pressable 
                onPress={() => setShowRecoveryDetails(!showRecoveryDetails)}
                style={styles.expandButton}
              >
                <Feather name={showRecoveryDetails ? "chevron-up" : "chevron-down"} size={16} color="#5A71E4" />
              </Pressable>
            </View>
            
            {showRecoveryDetails && (
              <View style={styles.recoveryDetails}>
                <View style={styles.recoveryDetailItem}>
                  <Text style={styles.recoveryDetailLabel}>Reported By:</Text>
                  <Text style={styles.recoveryDetailValue}>{device.recoveryInfo.recoveredBy}</Text>
                </View>
                <View style={styles.recoveryDetailItem}>
                  <Text style={styles.recoveryDetailLabel}>Location:</Text>
                  <Text style={styles.recoveryDetailValue}>{device.recoveryInfo.recoveryLocation}</Text>
                </View>
                <View style={styles.recoveryDetailItem}>
                  <Text style={styles.recoveryDetailLabel}>Contact:</Text>
                  <Text style={styles.recoveryDetailValue}>{device.recoveryInfo.contactInfo}</Text>
                </View>
                {device.recoveryInfo.recoveryDetails && (
                  <View style={styles.recoveryDetailItem}>
                    <Text style={styles.recoveryDetailLabel}>Details:</Text>
                    <Text style={styles.recoveryDetailValue}>{device.recoveryInfo.recoveryDetails}</Text>
                  </View>
                )}
                <View style={styles.recoveryDetailItem}>
                  <Text style={styles.recoveryDetailLabel}>Reported On:</Text>
                  <Text style={styles.recoveryDetailValue}>
                    {new Date(device.recoveryInfo.recoveryDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <Pressable 
                  style={styles.confirmRecoveryButton}
                  onPress={handleConfirmRecovery}
                >
                  <Text style={styles.confirmRecoveryButtonText}>Confirm Recovery</Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
        )}

        <Animated.View 
          style={styles.detailsContainer}
          entering={FadeInUp.duration(500).delay(device.recoveryInfo ? 250 : 200)}
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

                <View style={styles.divider} />
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Registered By</Text>
                  <Text style={styles.detailValue}>{device.registeredBy || 'Unknown'}</Text>
                </View>

                <View style={styles.divider} />
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Owner NIN</Text>
                  <Text style={styles.detailValue}>{getMaskedNIN(device.ownerNIN)}</Text>
                </View>

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

                {device.status === 'transferred' && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Current Owner</Text>
                      <Text style={styles.detailValue}>{device.currentOwner || 'Unknown'}</Text>
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
            {/* Show unreport action when device is lost/stolen and user owns it */}
            {(device.status === 'lost' || device.status === 'stolen') && device.ownership && (
              <AnimatedPressable
                onPress={handleUnreportDevice}
                style={styles.actionButton}
              >
                <View style={[styles.actionIcon, styles.unreportIcon]}>
                  <Feather name="check-circle" size={16} color="#30B050" />
                </View>
                <Text style={styles.actionText}>Unreport</Text>
              </AnimatedPressable>
            )}
            
            {/* Show report action when device is active and user owns it */}
            {(device.status !== 'transferred' && device.status !== 'lost' && device.status !== 'stolen' && device.ownership) && (
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
            
            {/* Show recovery action when device is lost/stolen and user does NOT own it */}
            {(device.status === 'lost' || device.status === 'stolen') && !device.ownership && (
              <AnimatedPressable
                onPress={handleReportRecovery}
                style={styles.actionButton}
              >
                <View style={[styles.actionIcon, styles.recoveryIcon]}>
                  <Feather name="box" size={16} color="#30B050" />
                </View>
                <Text style={styles.actionText}>Found It</Text>
              </AnimatedPressable>
            )}
            
            {/* Show transfer action when device is active and user owns it */}
            {(device.status !== 'transferred' && device.status !== 'lost' && device.status !== 'stolen' && device.ownership) && (
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
            
            {/* Always show remove button, but logic inside will handle restrictions */}
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

        {/* Recovery Form Modal */}
        <Modal
          visible={showRecoveryForm}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRecoveryForm(false)}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalOverlay}>
              <View style={styles.recoveryFormContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Report Recovery</Text>
                  <Pressable 
                    onPress={() => setShowRecoveryForm(false)}
                  >
                    <Feather name="x" size={22} color="#222D3A" />
                  </Pressable>
                </View>
                
                <Text style={styles.recoveryFormDescription}>
                  Please provide information about how you found this device. The owner will be notified and may contact you.
                </Text>
                
                <View style={styles.recoveryFormField}>
                  <Text style={styles.recoveryFormLabel}>Your Full Name *</Text>
                  <TextInput
                    style={styles.recoveryFormInput}
                    value={recoveryInfo.recoveredBy}
                    onChangeText={(text) => setRecoveryInfo({...recoveryInfo, recoveredBy: text})}
                    placeholder="Enter your full name"
                    placeholderTextColor="#8494A9"
                  />
                </View>
                
                <View style={styles.recoveryFormField}>
                  <Text style={styles.recoveryFormLabel}>Recovery Location *</Text>
                  <TextInput
                    style={styles.recoveryFormInput}
                    value={recoveryInfo.recoveryLocation}
                    onChangeText={(text) => setRecoveryInfo({...recoveryInfo, recoveryLocation: text})}
                    placeholder="Where did you find the device?"
                    placeholderTextColor="#8494A9"
                  />
                </View>
                
                <View style={styles.recoveryFormField}>
                  <Text style={styles.recoveryFormLabel}>Contact Information *</Text>
                  <TextInput
                    style={styles.recoveryFormInput}
                    value={recoveryInfo.contactInfo}
                    onChangeText={(text) => setRecoveryInfo({...recoveryInfo, contactInfo: text})}
                    placeholder="Phone or email to contact you"
                    placeholderTextColor="#8494A9"
                    keyboardType="email-address"
                  />
                </View>
                
                <View style={styles.recoveryFormField}>
                  <Text style={styles.recoveryFormLabel}>Additional Details</Text>
                  <TextInput
                    style={[styles.recoveryFormInput, styles.recoveryFormTextarea]}
                    value={recoveryInfo.recoveryDetails}
                    onChangeText={(text) => setRecoveryInfo({...recoveryInfo, recoveryDetails: text})}
                    placeholder="Provide any additional information about the recovery"
                    placeholderTextColor="#8494A9"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
                
                <Pressable 
                  style={styles.recoveryFormSubmitButton}
                  onPress={handleRecoverySubmit}
                >
                  <Text style={styles.recoveryFormSubmitText}>Submit Recovery Report</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalOverlay}>
              <View style={styles.pinModalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Security Verification</Text>
                  <Pressable 
                    onPress={() => {
                      setShowPinModal(false);
                      setPin('');
                      setSelectedAction(null);
                    }}
                  >
                    <Feather name="x" size={22} color="#222D3A" />
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
                  placeholder="••••"
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
          </TouchableWithoutFeedback>
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
  unreportIcon: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
  },
  recoveryIcon: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pinModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#222D3A',
  },
  pinDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  pinInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 12,
    fontFamily: 'Inter-Bold',
    height: 60,
    borderWidth: 1,
    borderColor: '#E5E9F0',
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
  recoveryInfoCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  recoveryInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  recoveryTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  recoveryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginLeft: 12,
  },
  recoverySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginLeft: 12,
  },
  recoveryDetails: {
    padding: 16,
  },
  recoveryDetailItem: {
    paddingVertical: 8,
  },
  recoveryDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  recoveryDetailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  confirmRecoveryButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmRecoveryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  recoveryFormContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  recoveryFormField: {
    marginBottom: 16,
  },
  recoveryFormLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  recoveryFormInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#222D3A',
  },
  recoveryFormTextarea: {
    height: 120,
  },
  recoveryFormSubmitButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  recoveryFormSubmitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  recoveryFormDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  reportInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  reportInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 4,
  },
  reportInfoDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
});