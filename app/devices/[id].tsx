import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowRight,
  ArrowLeft,
  UserCheck,
  History,
  CircleAlert as AlertCircle,
  Shield
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { useDeviceStore, Device as DeviceType } from '../store/store';
import Modal from '../components/Modal';
import UserConfirmationModal from '../components/UserConfirmationModal';
import { debounce, isLowEndDevice } from '../utils/performance';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Separate component for device details card to reduce re-renders
const DeviceDetailsCard = ({ device }: { device: DeviceType | null }) => {
  const getStatusText = useMemo(() => (status?: string) => {
    if (!status) return 'Unknown';
    return {
      'active': 'Active',
      'transferred': 'Transferred',
      'lost': 'Lost',
      'stolen': 'Stolen'
    }[status] || 'Inactive';
  }, []);

  const getStatusStyle = useCallback((status?: string) => {
    return [
      styles.statusBadge,
      status === 'active' ? styles.activeBadge : 
      status === 'transferred' ? styles.transferredBadge :
      styles.reportedBadge
    ];
  }, []);

  // Format date once instead of on every render
  const formattedDate = useMemo(() => {
    if (!device?.registrationDate) return '-';
    return new Date(device.registrationDate).toLocaleDateString();
  }, [device?.registrationDate]);

  return (
    <LinearGradient
      colors={['#A6C8FF33', '#D6B4FC33']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.detailsCard}
    >
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Storda ID</Text>
        <Text style={styles.detailValue}>{device?.id || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>IMEI</Text>
        <Text style={styles.detailValue}>{device?.imei || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Color</Text>
        <Text style={styles.detailValue}>{device?.color || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Storage</Text>
        <Text style={styles.detailValue}>{device?.storage || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Status</Text>
        <View style={getStatusStyle(device?.status)}>
          <Text style={styles.statusText}>{getStatusText(device?.status)}</Text>
        </View>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Added On</Text>
        <Text style={styles.detailValue}>{formattedDate}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Verification</Text>
        <View style={[
          styles.statusBadge,
          device?.verificationStatus === 'verified' ? styles.activeBadge : 
          device?.verificationStatus === 'pending' ? styles.pendingBadge : 
          styles.unverifiedBadge
        ]}>
          <Text style={styles.statusText}>
            {device?.verificationStatus === 'verified' ? 'Verified' : 
             device?.verificationStatus === 'pending' ? 'Pending' : 'Unverified'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default function DeviceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [username, setUsername] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [password, setPassword] = useState('');
  
  // Modal states
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [userConfirmationVisible, setUserConfirmationVisible] = useState(false);
  const [foundUser, setFoundUser] = useState<{name: string, email: string, phone?: string} | null>(null);
  
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [transferSuccessModalVisible, setTransferSuccessModalVisible] = useState(false);
  
  // Use selectors to minimize re-renders
  const deviceId = id as string;
  const getDeviceById = useDeviceStore(state => state.getDeviceById);
  const updateDeviceStatus = useDeviceStore(state => state.updateDeviceStatus);
  
  // Load device data using the new selector
  useEffect(() => {
    const loadDevice = () => {
      const foundDevice = getDeviceById(deviceId);
      if (foundDevice) {
        setDevice(foundDevice);
      }
    };
    
    // Load immediately on mount
    loadDevice();
    
    // Don't set up refresh interval if deviceId is missing
    if (!deviceId) return () => {};
    
    // Setup refresh interval to keep device data in sync with a reasonable interval
    const refreshInterval = setInterval(loadDevice, 10000); // increased to 10 seconds for better performance
    
    // Proper cleanup to prevent memory leaks
    return () => {
      clearInterval(refreshInterval);
    };
  }, [deviceId, getDeviceById]);

  const showErrorModal = useCallback((title: string, message: string, type?: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorModalVisible(true);
  }, []);
  
  // Debounce email validation to improve performance during typing
  const validateEmail = useMemo(() => 
    debounce((email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }, 300), 
  []);
  
  const handleCheckUser = useCallback(() => {
    // Validate email format
    if (!username || !username.includes('@')) {
      showErrorModal('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    // Check if device belongs to current user and is not reported
    if (device) {
      if (device.status === 'lost' || device.status === 'stolen') {
        showErrorModal(
          'Device Reported',
          'This device has been reported as lost or stolen. You cannot transfer a reported device.'
        );
        return;
      }
      
      if (!device.ownership) {
        showErrorModal(
          'Ownership Error',
          'You do not own this device. Only the current owner can transfer ownership.'
        );
        return;
      }

      // Check if device is verified - only allow transfer of verified devices
      if (device.verificationStatus !== 'verified') {
        showErrorModal(
          'Verification Required',
          'To transfer ownership of this device, it must be verified first. Please verify your device through the verification section in the app.',
          'verification'
        );
        return;
      }
      
      // Simulate checking if user exists
      setIsCheckingUser(true);
      
      // Mock API call to check if user exists - use setTimeout with appropriate duration
      setTimeout(() => {
        setIsCheckingUser(false);
        
        // For demo, we'll assume user exists if email contains "user"
        if (username.toLowerCase().includes('user') || username.toLowerCase().includes('@gmail')) {
          const name = username.split('@')[0];
          // User found, show confirmation modal
          setFoundUser({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            email: username,
            phone: '+234 800 555 ' + Math.floor(1000 + Math.random() * 9000)
          });
          setUserConfirmationVisible(true);
        } else {
          // User not found
          showErrorModal(
            'User Not Found',
            'The email address you entered is not registered with Storda. Please check the email and try again.'
          );
        }
      }, isLowEndDevice() ? 300 : 1000);
    }
  }, [device, showErrorModal, username]);
  
  const handleConfirmUser = useCallback(() => {
    setUserConfirmationVisible(false);
    setPasswordModalVisible(true);
  }, []);
  
  const handlePasswordSubmit = useCallback(() => {
    if (!password || password.length < 4) {
      showErrorModal('Invalid Password', 'Please enter a valid password');
      return;
    }
    
    // Mock sending transfer request
    if (device && device.key) {
      // Update device status to 'transferred'
      updateDeviceStatus(device.key, 'transferred', username);
      
      // Show success modal
      setPasswordModalVisible(false);
      setTransferSuccessModalVisible(true);
    }
  }, [device, password, showErrorModal, updateDeviceStatus, username]);
  
  const handleTransferSuccess = useCallback(() => {
    setTransferSuccessModalVisible(false);
    router.push('/devices');
  }, []);

  const toggleTransfer = useCallback(() => {
    setShowTransfer(prev => !prev);
    // Clear form when hiding
    if (showTransfer) {
      setUsername('');
      setPassword('');
    }
  }, [showTransfer]);

  const handleUsernameChange = useCallback((text: string) => {
    setUsername(text);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  // Handler for verification click
  const handleVerifyDevice = useCallback(() => {
    if (device) {
      // In a real app, this would navigate to the verification screen
      // For now, we'll just navigate back to devices screen with a param
      router.push({
        pathname: '/devices',
        params: { verifyDeviceId: device.id }
      });
    }
  }, [device]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable
          onPress={handleBackPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Device Details</Text>
        <Text style={styles.subtitle}>{device?.name || 'Device'}</Text>
      </View>

      <DeviceDetailsCard device={device} />

      {!showTransfer ? (
        <View style={styles.actionButtons}>
          <AnimatedPressable
            style={styles.transferButton}
            onPress={toggleTransfer}
          >
            <UserCheck size={24} color="#FFF" />
            <Text style={styles.transferButtonText}>Transfer Ownership</Text>
          </AnimatedPressable>

          <AnimatedPressable style={styles.historyButton}>
            <History size={24} color="#A6C8FF" />
            <Text style={styles.historyButtonText}>Transfer History</Text>
          </AnimatedPressable>
        </View>
      ) : (
        <View style={styles.transferForm}>
          <View style={styles.warningCard}>
            <AlertCircle size={24} color="#FF6B6B" />
            <Text style={styles.warningText}>
              Transfer fee of ₦100 will be deducted from your wallet
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient's Email</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={handleUsernameChange}
              placeholder="Enter recipient's email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <AnimatedPressable
            style={[styles.transferButton, styles.confirmButton]}
            onPress={handleCheckUser}
            disabled={isCheckingUser}
          >
            {isCheckingUser ? (
              <ActivityIndicator color="#FFF" size="small" style={{marginRight: 8}} />
            ) : null}
            <Text style={styles.transferButtonText}>
              {isCheckingUser ? 'Checking...' : 'Continue'}
            </Text>
            {!isCheckingUser && <ArrowRight size={20} color="#FFF" />}
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.cancelButton}
            onPress={toggleTransfer}
          >
            <Text style={styles.cancelButtonText}>Cancel Transfer</Text>
          </AnimatedPressable>
        </View>
      )}
      
      {/* Error Modal */}
      <Modal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title={errorTitle}
        message={errorMessage}
        type="error"
        primaryButtonText={errorTitle === 'Verification Required' ? 'Verify Device' : 'OK'}
        secondaryButtonText={errorTitle === 'Verification Required' ? 'Cancel' : undefined}
        onPrimaryButtonPress={() => {
          setErrorModalVisible(false);
          if (errorTitle === 'Verification Required') {
            handleVerifyDevice();
          }
        }}
        onSecondaryButtonPress={() => {
          setErrorModalVisible(false);
        }}
      />
      
      {/* User Confirmation Modal */}
      {foundUser && (
        <UserConfirmationModal
          visible={userConfirmationVisible}
          onClose={() => setUserConfirmationVisible(false)}
          user={foundUser}
          onConfirm={handleConfirmUser}
          onCancel={() => setUserConfirmationVisible(false)}
        />
      )}
      
      {/* Password Modal */}
      <Modal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        title="Confirm Password"
        message="Please enter your password to confirm this transfer."
        type="info"
        primaryButtonText="Confirm Transfer"
        secondaryButtonText="Cancel"
        onPrimaryButtonPress={handlePasswordSubmit}
        onSecondaryButtonPress={() => setPasswordModalVisible(false)}
      >
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
      </Modal>
      
      {/* Transfer Success Modal */}
      <Modal
        visible={transferSuccessModalVisible}
        onClose={handleTransferSuccess}
        title="Transfer Request Sent"
        message={`We've sent a transfer request to ${foundUser?.email}. They'll need to accept it to complete the transfer.`}
        type="success"
        primaryButtonText="Done"
      >
        <View style={styles.successNote}>
          <Shield size={16} color="#30B050" style={{marginRight: 8}} />
          <Text style={styles.successNoteText}>
            You'll be notified when they accept or reject the request.
          </Text>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Move styles outside component to prevent recreating on each render
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF3E7',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#121826',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#A6C8FF33',
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#121826',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#30B05033',
  },
  activeBadge: {
    backgroundColor: '#30B05033',
  },
  pendingBadge: {
    backgroundColor: '#FFA50033',
  },
  unverifiedBadge: {
    backgroundColor: '#8494A933',
  },
  transferredBadge: {
    backgroundColor: '#5A71E433',
  },
  reportedBadge: {
    backgroundColor: '#E45A5A33',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#121826',
  },
  actionButtons: {
    gap: 12,
  },
  transferButton: {
    height: 56,
    backgroundColor: '#A6C8FF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  transferButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  historyButton: {
    height: 56,
    backgroundColor: '#A6C8FF15',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  historyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#A6C8FF',
  },
  transferForm: {
    gap: 16,
  },
  warningCard: {
    backgroundColor: '#FF6B6B15',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF6B6B',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#121826',
  },
  input: {
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#121826',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confirmButton: {
    marginTop: 8,
  },
  cancelButton: {
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF6B6B',
  },
  passwordInputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  passwordInput: {
    width: '100%',
    height: 48,
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#121826',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  successNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#30B05015',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  successNoteText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#30B050',
  }
});
