import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Device from 'expo-device';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function RegisterDevicePage() {
  const [imei, setImei] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [brand, setBrand] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [deviceDetected, setDeviceDetected] = useState(false);
  
  useEffect(() => {
    // Automatically fetch device brand on load
    const fetchDeviceBrand = async () => {
      const brand = Device.manufacturer || '';
      setBrand(brand);
    };
    
    fetchDeviceBrand();
  }, []);

  const handleContinue = () => {
    if (!imei.trim()) {
      setError('IMEI number is required');
      return;
    }
    
    if (imei.length !== 15) {
      setError('IMEI must be 15 digits');
      return;
    }

    router.push({
      pathname: '/register/details',
      params: { 
        imei,
        macAddress,
        brand,
        detectedName: deviceDetected ? Device.modelName || 'Unknown Model' : '',
        detectedStorage: deviceDetected ? '128GB' : '',
        detectedColor: deviceDetected ? 'Black' : ''
      }
    });
  };

  const handleDetectDevice = async () => {
    setIsDetecting(true);
    setError(null);
    
    try {
      // Get real device information
      const deviceName = Device.deviceName || '';
      const modelName = Device.modelName || 'Unknown Model';
      
      // Generate a pseudo IMEI (would be replaced with actual API in production)
      const randomIMEI = Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
      
      setImei(randomIMEI);
      setBrand(Device.manufacturer || '');
      setDeviceDetected(true);
    } catch (err) {
      console.error(err);
      setError('Could not detect device information');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={20} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Register Device</Text>
        <Text style={styles.subtitle}>Protect your device with Storda</Text>
      </View>

      <LinearGradient
        colors={['rgba(90, 113, 228, 0.15)', 'rgba(140, 59, 255, 0.15)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        <View style={styles.infoContent}>
          <View style={styles.iconContainer}>
            <Feather name="smartphone" size={20} color="#5A71E4" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Why Register?</Text>
            <Text style={styles.infoText}>
              Registering your device helps protect it from theft and makes recovery easier if lost.
            </Text>
          </View>
        </View>
        
        <AnimatedPressable 
          style={styles.detectButton} 
          onPress={handleDetectDevice}
          disabled={isDetecting}
        >
          {isDetecting ? (
            <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
          ) : (
            <Feather name="zap" size={16} color="#FFF" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.detectButtonText}>
            {isDetecting ? 'Detecting...' : deviceDetected ? 'Device Detected' : 'Auto-Detect Device Info'}
          </Text>
        </AnimatedPressable>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>IMEI Number</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, deviceDetected && styles.inputDetected]}
              value={imei}
              onChangeText={(text) => {
                setImei(text.replace(/[^0-9]/g, ''));
                setError(null);
              }}
              placeholder="Enter 15-digit IMEI number"
              keyboardType="numeric"
              maxLength={15}
              placeholderTextColor="#8494A9"
              editable={!isDetecting}
            />
            <AnimatedPressable style={styles.scanButton} disabled={isDetecting}>
              <Feather name="camera" size={18} color="#5A71E4" />
            </AnimatedPressable>
          </View>
          <Text style={styles.helper}>Dial *#06# to get your IMEI number</Text>
          {error && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={14} color="#E45A5A" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>MAC Address (Optional)</Text>
          <TextInput
            style={[styles.input, deviceDetected && styles.inputDetected]}
            value={macAddress}
            onChangeText={setMacAddress}
            placeholder="Enter MAC address"
            autoCapitalize="characters"
            placeholderTextColor="#8494A9"
            editable={!isDetecting}
          />
          <Text style={styles.helper}>Found in your device's network settings</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={[styles.input, deviceDetected && styles.inputDetected]}
            value={brand}
            onChangeText={setBrand}
            placeholder="Enter device brand"
            placeholderTextColor="#8494A9"
            editable={!isDetecting}
          />
        </View>

        <AnimatedPressable 
          style={styles.continueButton} 
          onPress={handleContinue}
          disabled={isDetecting}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Feather name="arrow-right" size={18} color="#FFF" />
        </AnimatedPressable>
      </View>
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
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#222D3A',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginTop: 2,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#FFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 6,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
    lineHeight: 20,
  },
  detectButton: {
    height: 44,
    backgroundColor: '#5A71E4',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#FFF',
  },
  formContainer: {
    gap: 18,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#222D3A',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
  },
  inputDetected: {
    borderWidth: 1,
    borderColor: '#5A71E4',
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
  },
  scanButton: {
    width: 46,
    height: 46,
    backgroundColor: '#FFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helper: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#8494A9',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#E45A5A',
  },
  continueButton: {
    height: 50,
    backgroundColor: '#5A71E4',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFF',
  },
});