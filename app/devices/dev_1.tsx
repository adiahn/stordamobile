import { View, Text, StyleSheet, Pressable, TextInput, Alert, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDeviceStore } from '../store/store';
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
  const selectedDevice = useDeviceStore((state: any) => state.selectedDevice);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [transferType, setTransferType] = useState<'email' | 'phone'>('email');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  
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
    // Validate input
    if (transferType === 'email' && !email.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    if (transferType === 'phone' && !phone.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    // Check if user has enough balance for transfer fee
    if (WALLET_BALANCE < TRANSFER_FEE) {
      Alert.alert(
        'Insufficient Balance',
        `You need ₦${TRANSFER_FEE} in your wallet to transfer this device. Please top up your wallet.`,
        [
          {
            text: 'Top Up',
            onPress: () => router.push('/(tabs)/wallet'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // Show PIN verification modal
    setShowPinModal(true);
  };

  const handlePinVerification = () => {
    if (pin !== USER_PIN) {
      Alert.alert('Error', 'Incorrect PIN. Please try again.');
      setPin('');
      return;
    }

    // Close the PIN modal
    setShowPinModal(false);
    setPin('');

    // Proceed with transfer after PIN verification
    completeTransfer();
  };

  const completeTransfer = () => {
    if (device.key) {
      // Update device status to transferred
      useDeviceStore.getState().updateDeviceStatus(
        device.key,
        'transferred',
        transferType === 'email' ? email : phone
      );
    }
    
    // Show success message
    Alert.alert(
      'Device Transferred',
      `${device.name} has been transferred successfully. A fee of ₦${TRANSFER_FEE} has been deducted from your wallet.`,
      [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.keyboardAvoidingContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Text style={styles.sectionTitle}>Transfer Method</Text>
            
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
          </Animated.View>

          <Animated.View
            style={styles.inputSection}
            entering={FadeInUp.duration(500).delay(300)}
          >
            {transferType === 'email' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Recipient's Email</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={16} color="#8494A9" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#8494A9"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={true}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Recipient's Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="phone" size={16} color="#8494A9" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholderTextColor="#8494A9"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={true}
                  />
                </View>
              </View>
            )}
          </Animated.View>

          <Animated.View
            style={styles.infoSection}
            entering={FadeInUp.duration(500).delay(400)}
          >
            <View style={styles.infoCard}>
              <Feather name="info" size={16} color="#5A71E4" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                The recipient will receive a notification with instructions to accept the transfer. 
                Once accepted, you will no longer have access to this device.
              </Text>
            </View>
          </Animated.View>

          <AnimatedPressable
            style={styles.transferButton}
            entering={FadeInUp.duration(500).delay(500)}
            onPress={initiateTransfer}
          >
            <Text style={styles.transferButtonText}>Continue</Text>
            <Feather name="arrow-right" size={18} color="#FFF" />
          </AnimatedPressable>

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
                  
                  <Text style={styles.pinDescription}>
                    Please enter your PIN to confirm the transfer of {device.name} to {transferType === 'email' ? email : phone}
                  </Text>
                  
                  <View style={styles.transferSummary}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Device:</Text>
                      <Text style={styles.summaryValue}>{device.name}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Recipient:</Text>
                      <Text style={styles.summaryValue}>{transferType === 'email' ? email : phone}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Fee:</Text>
                      <Text style={styles.summaryValue}>₦{TRANSFER_FEE}</Text>
                    </View>
                  </View>
                  
                  <TextInput
                    style={styles.pinInput}
                    value={pin}
                    onChangeText={setPin}
                    placeholder="Enter 4-digit PIN"
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    placeholderTextColor="#8494A9"
                    autoFocus={true}
                    returnKeyType="done"
                  />
                  
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
        </View>
      </TouchableWithoutFeedback>
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
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 16,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
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
    marginBottom: 20,
  },
  feeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginBottom: 20,
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
  },
  methodOption: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  methodSelected: {
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
  },
  methodIcon: {
    marginRight: 8,
  },
  methodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  methodTextSelected: {
    color: '#5A71E4',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#5A71E4',
    lineHeight: 20,
  },
  transferButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  transferButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
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
    marginBottom: 12,
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
  transferSummary: {
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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