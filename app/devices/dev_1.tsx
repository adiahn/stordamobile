import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  Alert, 
  Modal, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDeviceStore, Device } from '../store/store';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mock wallet balance - in a real app, this would come from a wallet/payment store
const TRANSFER_FEE = 100; // Fixed fee of ₦100 for transfer
const WALLET_BALANCE = 230; // ₦230 balance

// PIN for authentication
const USER_PIN = "1234"; // This would be stored securely in a real app

export default function TransferDeviceScreen() {
  const selectedDevice = useDeviceStore((state) => state.selectedDevice);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [transferType, setTransferType] = useState<'email' | 'phone'>('email');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [isTransferAgreementChecked, setIsTransferAgreementChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Custom modals state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showRecipientFoundModal, setShowRecipientFoundModal] = useState(false);
  const [showTransferCompletedModal, setShowTransferCompletedModal] = useState(false);
  const [transferId, setTransferId] = useState('');
  
  const device = selectedDevice || {
    name: 'Unknown Device',
    imei: 'N/A',
    macAddress: 'N/A',
    id: 'Unknown',
    ownership: true,
  };

  // Watch pin length and auto-verify when 4 digits are entered
  useEffect(() => {
    if (pin.length === 4) {
      Keyboard.dismiss();
      // Small delay to allow keyboard to dismiss before verification
      setTimeout(handlePinVerification, 300);
    }
  }, [pin]);

  const initiateTransfer = () => {
    try {
      // Validate inputs based on selected transfer type
      if (transferType === 'email') {
        if (!validateEmail(email)) {
          setErrorMessage('Please enter a valid email address');
          setShowErrorModal(true);
          return;
        }
      } else if (transferType === 'phone') {
        if (!validatePhone(phone)) {
          setErrorMessage('Please enter a valid phone number');
          setShowErrorModal(true);
          return;
        }
      }
      
      // Validate transfer reason
      if (!transferReason.trim()) {
        setErrorMessage('Please provide a reason for the transfer');
        setShowErrorModal(true);
        return;
      }
      
      // Check transfer agreement
      if (!isTransferAgreementChecked) {
        setErrorMessage('Please agree to the transfer terms');
        setShowErrorModal(true);
        return;
      }
      
      // Check if user has enough balance for transfer fee
      if (WALLET_BALANCE < TRANSFER_FEE) {
        setErrorMessage(`You need ₦${TRANSFER_FEE} in your wallet to transfer this device. Please top up your wallet.`);
        setShowErrorModal(true);
        return;
      }

      // Verify recipient details
      verifyRecipient();
    } catch (error) {
      console.error("Error initiating transfer:", error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setShowErrorModal(true);
    }
  };

  const verifyRecipient = () => {
    // Simulate recipient verification
    setIsVerifying(true);
    
    // Mock API call to verify recipient details
    setTimeout(() => {
      setIsVerifying(false);
      
      const recipient = transferType === 'email' ? email : phone;
      
      // Mock verification result - in a real app this would come from an API
      if (transferType === 'email' && email.includes('@')) {
        // For demo purposes, we'll auto-populate the name for certain domains
        if (email.endsWith('@gmail.com')) {
          setFullName('Grace Ayomide');
        } else if (email.endsWith('@yahoo.com')) {
          setFullName('Taiwo Johnson');
        } else if (email.endsWith('@outlook.com')) {
          setFullName('Nkem Okonkwo');
        } else {
          setFullName('User ' + Math.floor(1000 + Math.random() * 9000));
        }
        
        // Show verification confirmation using custom modal
        setShowRecipientFoundModal(true);
      } else if (transferType === 'phone' && phone.length >= 10) {
        // For demo purposes with phone numbers
        setFullName('User ' + phone.substring(phone.length - 4));
        
        // Show verification confirmation using custom modal
        setShowRecipientFoundModal(true);
      } else {
        // Show error using custom modal
        setErrorMessage(`We couldn't find a user with the provided ${transferType}. Please check and try again.`);
        setShowErrorModal(true);
      }
    }, 1500); // Simulate 1.5 seconds delay for API call
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handlePinVerification = () => {
    try {
      if (pin !== USER_PIN) {
        setErrorMessage('Incorrect PIN. Please try again.');
        setShowErrorModal(true);
        setPin('');
        return;
      }

      // Close the PIN modal
      setShowPinModal(false);
      setPin('');

      // Proceed with transfer after PIN verification
      completeTransfer();
    } catch (error) {
      console.error("Error verifying PIN:", error);
      setErrorMessage('Failed to verify PIN. Please try again.');
      setShowErrorModal(true);
      setPin('');
    }
  };

  const completeTransfer = () => {
    try {
      if (!device.key) {
        setErrorMessage('Device key is missing. Cannot complete transfer.');
        setShowErrorModal(true);
        return;
      }
      
      // Prepare recipient info
      const recipient = transferType === 'email' ? email.trim() : phone.trim();
      
      // Create transfer history record
      const transferRecord = {
        transferDate: new Date().toISOString(),
        toEmail: transferType === 'email' ? email : undefined,
        toPhone: transferType === 'phone' ? phone : undefined,
        wasVerified: true,
        recipientName: fullName,
        transferReason: transferReason,
      };
      
      // Update device status to transferred
      useDeviceStore.getState().updateDeviceStatus(
        device.key,
        'transferred',
        recipient
      );
      
      // Create updated device with transfer history
      // We need to cast it to include the transferHistory field
      type DeviceWithHistory = Device & {
        transferHistory?: Array<{
          transferDate: string;
          toEmail?: string;
          toPhone?: string;
          wasVerified: boolean;
          recipientName: string;
          transferReason: string;
        }>;
        transferredTo?: string;
        currentOwner?: string;
      };
      
      // Update device with transfer history
      const updatedDevice: DeviceWithHistory = {
        ...device,
        status: 'transferred' as const,
        transferredTo: recipient,
        currentOwner: fullName,
        transferHistory: [
          ...((device as DeviceWithHistory).transferHistory || []),
          transferRecord
        ]
      };
      
      // Update selected device in store
      useDeviceStore.getState().setSelectedDevice(updatedDevice as Device);
      
      // Generate a transfer ID
      const generatedTransferId = `TRF-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransferId(generatedTransferId);
      
      // Show transfer completion modal
      setShowTransferCompletedModal(true);
    } catch (error) {
      console.error("Error completing transfer:", error);
      setErrorMessage('Failed to complete the transfer. Please try again.');
      setShowErrorModal(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.keyboardAvoidingContainer}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color="#222D3A" />
          </Pressable>
          <Text style={styles.title}>Transfer Device</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Animated.View 
            style={styles.deviceCard}
            entering={FadeInUp.duration(500).delay(100)}
          >
            <LinearGradient
              colors={['rgba(90, 113, 228, 0.15)', 'rgba(140, 59, 255, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientCard}
            >
              <View style={styles.deviceInfo}>
                <View style={styles.deviceIcon}>
                  <Feather name="smartphone" size={24} color="#5A71E4" />
                </View>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceId}>{device.id}</Text>
                  <Text style={styles.deviceImei}>IMEI: {device.imei}</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View
            style={styles.feeInfoSection}
            entering={FadeInUp.duration(500).delay(150)}
          >
            <View style={styles.feeCard}>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Transfer Fee:</Text>
                <Text style={styles.feeAmount}>₦{TRANSFER_FEE}</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Your Balance:</Text>
                <Text style={styles.balanceAmount}>₦{WALLET_BALANCE}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={styles.transferOptions}
            entering={FadeInUp.duration(500).delay(200)}
          >
            <Text style={styles.sectionTitle}>Transfer Details</Text>
            
            {/* Transfer Method Toggle */}
            <View style={styles.methodToggle}>
              <Pressable 
                style={[
                  styles.methodOption, 
                  transferType === 'email' && styles.methodSelected
                ]}
                onPress={() => setTransferType('email')}
              >
                <Feather 
                  name="mail" 
                  size={16} 
                  color={transferType === 'email' ? "#5A71E4" : "#8494A9"} 
                  style={styles.methodIcon} 
                />
                <Text 
                  style={[
                    styles.methodText,
                    transferType === 'email' && styles.methodTextSelected
                  ]}
                >
                  Email
                </Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.methodOption, 
                  transferType === 'phone' && styles.methodSelected
                ]}
                onPress={() => setTransferType('phone')}
              >
                <Feather 
                  name="phone" 
                  size={16} 
                  color={transferType === 'phone' ? "#5A71E4" : "#8494A9"} 
                  style={styles.methodIcon} 
                />
                <Text 
                  style={[
                    styles.methodText,
                    transferType === 'phone' && styles.methodTextSelected
                  ]}
                >
                  Phone
                </Text>
              </Pressable>
            </View>

            {/* Email/Phone Input */}
            {transferType === 'email' ? (
              <View style={styles.inputGroup}>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={16} color="#8494A9" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Recipient's email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#8494A9"
                    returnKeyType="next"
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <View style={styles.inputWrapper}>
                  <Feather name="phone" size={16} color="#8494A9" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Recipient's phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#8494A9"
                    returnKeyType="next"
                  />
                </View>
              </View>
            )}

            {/* Transfer Reason */}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Feather name="info" size={16} color="#8494A9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Reason for transfer"
                  value={transferReason}
                  onChangeText={setTransferReason}
                  placeholderTextColor="#8494A9"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
            </View>

            {/* Transfer Agreement Checkbox */}
            <Pressable 
              style={styles.checkboxContainer}
              onPress={() => setIsTransferAgreementChecked(!isTransferAgreementChecked)}
            >
              <View style={[styles.checkbox, isTransferAgreementChecked && styles.checkboxChecked]}>
                {isTransferAgreementChecked && <Feather name="check" size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>
                I confirm that I am the owner of this device
              </Text>
            </Pressable>

            <Animated.View
              style={styles.infoSection}
              entering={FadeInUp.duration(500).delay(400)}
            >
              <View style={styles.infoCard}>
                <Feather name="info" size={16} color="#5A71E4" style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  We'll verify the recipient's details before completing the transfer. Once accepted, you'll no longer have access to this device.
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>

        <AnimatedPressable
          style={styles.transferButton}
          entering={FadeInUp.duration(500).delay(500)}
          onPress={initiateTransfer}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.transferButtonText}>Continue</Text>
              <Feather name="arrow-right" size={18} color="#FFF" />
            </>
          )}
        </AnimatedPressable>

        {/* Error Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showErrorModal}
          onRequestClose={() => setShowErrorModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowErrorModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <View style={styles.errorIconCircle}>
                    <Feather name="x" size={24} color="#FFFFFF" />
                  </View>
                </View>
                
                <Text style={styles.modalTitle}>Error</Text>
                <Text style={styles.modalMessage}>{errorMessage}</Text>
                
                <Pressable 
                  style={styles.modalButton}
                  onPress={() => setShowErrorModal(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* PIN Verification Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showPinModal}
          onRequestClose={() => {
            setShowPinModal(false);
            setPin('');
          }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalOverlay}>
              <View style={styles.pinModalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Enter PIN</Text>
                  <Pressable 
                    onPress={() => {
                      setShowPinModal(false);
                      setPin('');
                    }}
                  >
                    <Feather name="x" size={20} color="#222D3A" />
                  </Pressable>
                </View>
                
                <View style={styles.pinModalIconContainer}>
                  <LinearGradient
                    colors={['rgba(90, 113, 228, 0.1)', 'rgba(140, 59, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.pinIconCircle}
                  >
                    <Feather name="lock" size={24} color="#5A71E4" />
                  </LinearGradient>
                </View>
                
                <Text style={styles.pinDescription}>
                  Enter your PIN to confirm transferring {device.name}
                </Text>
                
                <View style={styles.transferSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Recipient:</Text>
                    <Text style={styles.summaryValue}>{fullName}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Via:</Text>
                    <Text style={styles.summaryValue}>{transferType === 'email' ? email : phone}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Fee:</Text>
                    <Text style={styles.summaryValue}>₦{TRANSFER_FEE}</Text>
                  </View>
                </View>
                
                <View style={styles.pinInputContainer}>
                  <Text style={styles.pinInputLabel}>Enter 4-digit PIN</Text>
                  <TextInput
                    style={styles.pinInput}
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    placeholderTextColor="#8494A9"
                    autoFocus={true}
                    returnKeyType="done"
                  />
                </View>
                
                <Pressable 
                  style={[styles.pinSubmitButton, pin.length === 4 && styles.pinSubmitButtonActive]}
                  onPress={handlePinVerification}
                  disabled={pin.length !== 4}
                >
                  <Text style={[styles.pinSubmitText, pin.length === 4 && styles.pinSubmitTextActive]}>
                    Complete Transfer
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Recipient Found Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showRecipientFoundModal}
          onRequestClose={() => setShowRecipientFoundModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowRecipientFoundModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <View style={styles.successIconCircle}>
                    <Feather name="user-check" size={24} color="#FFFFFF" />
                  </View>
                </View>
                
                <Text style={styles.modalTitle}>Recipient Found</Text>
                <Text style={styles.modalMessage}>
                  We've found a user with the {transferType}: {transferType === 'email' ? email : phone}
                </Text>
                
                <View style={styles.recipientDetails}>
                  <View style={styles.recipientDetailRow}>
                    <Text style={styles.recipientDetailLabel}>Name:</Text>
                    <Text style={styles.recipientDetailValue}>{fullName}</Text>
                  </View>
                </View>
                
                <Text style={styles.confirmationText}>
                  Do you want to proceed with the transfer?
                </Text>
                
                <View style={styles.modalButtonRow}>
                  <Pressable 
                    style={[styles.modalButton, styles.modalButtonOutline]}
                    onPress={() => setShowRecipientFoundModal(false)}
                  >
                    <Text style={styles.modalButtonTextOutline}>No</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={styles.modalButton}
                    onPress={() => {
                      setShowRecipientFoundModal(false);
                      setShowPinModal(true);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Yes, Continue</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Transfer Completed Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showTransferCompletedModal}
          onRequestClose={() => {
            setShowTransferCompletedModal(false);
            router.push('/(tabs)');
          }}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <LinearGradient
                    colors={['#5A71E4', '#8C3BFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.successGradientCircle}
                  >
                    <Feather name="check" size={24} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                
                <Text style={styles.modalTitle}>Device Transfer Initiated</Text>
                <Text style={styles.modalMessage}>
                  {device.name} transfer has been initiated to {fullName}.
                </Text>
                
                <View style={styles.transferDetails}>
                  <Text style={styles.transferDetailText}>
                    The recipient will receive a confirmation {transferType === 'email' ? 'email' : 'SMS'} with instructions to accept the transfer.
                  </Text>
                  
                  <View style={styles.transferIdContainer}>
                    <Text style={styles.transferIdLabel}>Transfer ID:</Text>
                    <Text style={styles.transferIdValue}>{transferId}</Text>
                  </View>
                </View>
                
                <Pressable 
                  style={styles.modalButton}
                  onPress={() => {
                    setShowTransferCompletedModal(false);
                    router.push('/(tabs)');
                  }}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80, // Extra space for the button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#222D3A',
  },
  deviceCard: {
    marginBottom: 16,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 14,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 2,
  },
  deviceId: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#5A71E4',
    marginBottom: 2,
  },
  deviceImei: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  feeInfoSection: {
    marginBottom: 16,
  },
  feeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  feeAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#E45A5A',
  },
  balanceAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#30B050',
  },
  transferOptions: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 12,
  },
  methodOption: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  methodSelected: {
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
  },
  methodIcon: {
    marginRight: 6,
  },
  methodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  methodTextSelected: {
    color: '#5A71E4',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
  },
  infoSection: {
    marginVertical: 12,
  },
  infoCard: {
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#5A71E4',
    lineHeight: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8494A9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#5A71E4',
    borderColor: '#5A71E4',
  },
  checkboxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
    flex: 1,
  },
  transferButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 36 : 24,
    left: 16,
    right: 16,
    shadowColor: '#5A71E4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  transferButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#222D3A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  modalButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5A71E4',
  },
  modalButtonTextOutline: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#5A71E4',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  errorIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E45A5A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#30B050',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successGradientCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipientDetails: {
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  recipientDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipientDetailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
  },
  recipientDetailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  confirmationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 20,
    textAlign: 'center',
  },
  transferDetails: {
    width: '100%',
    marginBottom: 20,
  },
  transferDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  transferIdContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  transferIdLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
    marginRight: 8,
  },
  transferIdValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#5A71E4',
  },
  pinModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  pinModalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pinIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 16,
    textAlign: 'center',
  },
  pinInputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  pinInputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 8,
    textAlign: 'center',
  },
  pinInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
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
  transferSummary: {
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  summaryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pinModalIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
}); 