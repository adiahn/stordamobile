import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Smartphone, QrCode, ArrowRight, CircleAlert as AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DEVICE_BRANDS = [
  'Apple',
  'Samsung',
  'Google',
  'OnePlus',
  'Xiaomi',
  'Huawei',
  'Tecno',
  'Infinix',
  'Others',
];

export default function RegisterDevicePage() {
  const [imei, setImei] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [brand, setBrand] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!imei.trim()) {
      setError('IMEI number is required');
      return;
    }
    
    if (imei.length !== 15) {
      setError('IMEI must be 15 digits');
      return;
    }

    router.push('/register/details');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Register Device</Text>
        <Text style={styles.subtitle}>Protect your device with Storda</Text>
      </View>

      <View style={styles.infoCard}>
        <LinearGradient
          colors={['#A6C8FF33', '#D6B4FC33']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}>
          <View style={styles.iconContainer}>
            <Smartphone size={24} color="#A6C8FF" />
          </View>
          <Text style={styles.infoTitle}>Why Register?</Text>
          <Text style={styles.infoText}>
            Registering your device helps protect it from theft and makes recovery easier if lost.
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>IMEI Number</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={imei}
              onChangeText={(text) => {
                setImei(text.replace(/[^0-9]/g, ''));
                setError(null);
              }}
              placeholder="Enter 15-digit IMEI number"
              keyboardType="numeric"
              maxLength={15}
            />
            <AnimatedPressable style={styles.scanButton}>
              <QrCode size={20} color="#A6C8FF" />
            </AnimatedPressable>
          </View>
          <Text style={styles.helper}>Dial *#06# to get your IMEI number</Text>
          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>MAC Address (Optional)</Text>
          <TextInput
            style={styles.input}
            value={macAddress}
            onChangeText={setMacAddress}
            placeholder="Enter MAC address"
            autoCapitalize="characters"
          />
          <Text style={styles.helper}>Found in your device's network settings</Text>
        </View>

        <View style={styles.brandSelector}>
          <Text style={styles.label}>Select Brand</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandList}>
            {DEVICE_BRANDS.map((deviceBrand) => (
              <AnimatedPressable
                key={deviceBrand}
                style={[
                  styles.brandChip,
                  brand === deviceBrand && styles.brandChipSelected,
                ]}
                onPress={() => setBrand(deviceBrand)}>
                <Text
                  style={[
                    styles.brandChipText,
                    brand === deviceBrand && styles.brandChipTextSelected,
                  ]}>
                  {deviceBrand}
                </Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>

        <AnimatedPressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <ArrowRight size={20} color="#FFF" />
        </AnimatedPressable>
      </View>
    </ScrollView>
  );
}

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
  infoCard: {
    marginBottom: 24,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#121826',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#121826',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#121826',
  },
  scanButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helper: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF6B6B',
  },
  brandSelector: {
    gap: 12,
  },
  brandList: {
    gap: 8,
    paddingVertical: 4,
  },
  brandChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 8,
  },
  brandChipSelected: {
    backgroundColor: '#A6C8FF',
  },
  brandChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  brandChipTextSelected: {
    color: '#FFF',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#A6C8FF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});