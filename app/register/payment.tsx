import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useDeviceStore } from '../store/store';

export default function PaymentPage() {
  const params = useLocalSearchParams();
  const addDevice = useDeviceStore((state: any) => state.addDevice);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const expiryRef = useRef<TextInput | null>(null);
  const cvvRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);

  const formatCardNumber = (text: string) => {
    const formatted = text.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // limit to 16 digits plus spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryDateChange = (text: string) => {
    setExpiryDate(formatExpiryDate(text));
  };

  const handleSubmit = () => {
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    addDevice({
      id: String(Date.now()),
      name: `${params.brand} ${params.model}`,
      imei: params.imei as string,
      macAddress: params.macAddress as string,
      brand: params.brand as string,
      model: params.model as string,
      color: params.color as string,
      storage: params.storage as string,
      registrationDate: new Date().toISOString(),
      warrantyStatus: 'Active',
      insuranceStatus: 'Active',
      status: 'active',
      key: Date.now(),
      ownership: true,
    });

    router.push('/');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={18} color="#222D3A" />
            </Pressable>
            <Text style={styles.headerTitle}>Payment</Text>
            <Text style={styles.subtitle}>Complete your device protection</Text>
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.deviceSummary}>
              <Text style={styles.summaryTitle}>Device Summary</Text>
              
              <View style={styles.deviceInfo}>
                <View style={styles.deviceIconContainer}>
                  <Feather name="smartphone" size={22} color="#5A71E4" />
                </View>
                
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{params.brand} {params.model}</Text>
                  <View style={styles.detailsGrid}>
                    {params.imei && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>IMEI</Text>
                        <Text style={styles.detailValue}>{params.imei}</Text>
                      </View>
                    )}
                    {params.storage && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Storage</Text>
                        <Text style={styles.detailValue}>{params.storage}</Text>
                      </View>
                    )}
                    {params.color && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Color</Text>
                        <Text style={styles.detailValue}>{params.color}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.pricingCard}>
              <Text style={styles.pricingTitle}>Protection Plan</Text>
              
              <View style={styles.planDetails}>
                <View style={styles.planFeature}>
                  <Feather name="check" size={16} color="#30B050" />
                  <Text style={styles.planFeatureText}>Theft Protection</Text>
                </View>
                <View style={styles.planFeature}>
                  <Feather name="check" size={16} color="#30B050" />
                  <Text style={styles.planFeatureText}>Damage Protection</Text>
                </View>
                <View style={styles.planFeature}>
                  <Feather name="check" size={16} color="#30B050" />
                  <Text style={styles.planFeatureText}>24/7 Support</Text>
                </View>
              </View>
              
              <LinearGradient
                colors={['rgba(90, 113, 228, 0.1)', 'rgba(90, 113, 228, 0.05)']}
                style={styles.pricingRow}
              >
                <Text style={styles.pricingLabel}>Total Price</Text>
                <Text style={styles.pricingValue}>$9.99 / month</Text>
              </LinearGradient>
            </View>

            <View style={styles.paymentForm}>
              <Text style={styles.formLabel}>Payment Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <View style={styles.cardNumberInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#8494A9"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    maxLength={19}
                    returnKeyType="next"
                    onSubmitEditing={() => expiryRef.current?.focus()}
                  />
                  <View style={styles.cardBrand}>
                    <Feather name="credit-card" size={16} color="#8494A9" />
                  </View>
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.inputGroup, {flex: 1}]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    ref={expiryRef}
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#8494A9"
                    keyboardType="numeric"
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    maxLength={5}
                    returnKeyType="next"
                    onSubmitEditing={() => cvvRef.current?.focus()}
                  />
                </View>
                <View style={[styles.inputGroup, {flex: 1}]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    ref={cvvRef}
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#8494A9"
                    keyboardType="numeric"
                    value={cvv}
                    onChangeText={setCvv}
                    maxLength={3}
                    returnKeyType="next"
                    onSubmitEditing={() => nameRef.current?.focus()}
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name on Card</Text>
                <TextInput
                  ref={nameRef}
                  style={styles.input}
                  placeholder="JOHN DOE"
                  placeholderTextColor="#8494A9"
                  value={nameOnCard}
                  onChangeText={setNameOnCard}
                  autoCapitalize="characters"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
              
              <Pressable 
                style={styles.saveCardRow} 
                onPress={() => setSaveCard(!saveCard)}
              >
                <View style={[styles.checkbox, saveCard && styles.checkboxChecked]}>
                  {saveCard && <Feather name="check" size={12} color="#FFF" />}
                </View>
                <Text style={styles.saveCardText}>Save card for future payments</Text>
              </Pressable>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <Pressable style={styles.buyButton} onPress={handleSubmit}>
              <Text style={styles.buyButtonText}>Complete Purchase</Text>
              <Feather name="arrow-right" size={18} color="#FFF" />
            </Pressable>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingTop: 45,
    paddingBottom: 80,
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
    marginBottom: 14,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#222D3A',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
    marginTop: 2,
  },
  deviceSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#222D3A',
    marginBottom: 10,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 6,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  detailItem: {
    marginRight: 12,
    marginBottom: 4,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#8494A9',
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  pricingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#222D3A',
    marginBottom: 10,
  },
  planDetails: {
    marginBottom: 12,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  planFeatureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#222D3A',
    marginLeft: 8,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  pricingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#222D3A',
  },
  pricingValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#5A71E4',
  },
  paymentForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
  },
  formLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#222D3A',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
    marginBottom: 6,
  },
  input: {
    height: 44,
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#222D3A',
  },
  cardNumberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  cardBrand: {
    marginLeft: 'auto',
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8494A9',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#5A71E4',
    borderColor: '#5A71E4',
  },
  saveCardText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#222D3A',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    padding: 14,
  },
  buyButton: {
    height: 48,
    backgroundColor: '#5A71E4',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFF',
  },
});