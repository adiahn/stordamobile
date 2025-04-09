import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
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
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={22} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Register Device</Text>
        <Text style={styles.subtitle}>Protect your device with Storda</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.duration(500).delay(200)}
        style={styles.infoCard}
      >
        <AnimatedLinearGradient
          colors={['rgba(90, 113, 228, 0.15)', 'rgba(140, 59, 255, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}>
          <View style={styles.infoContent}>
            <View style={styles.iconContainer}>
              <Feather name="smartphone" size={22} color="#5A71E4" />
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
              <Feather name="zap" size={18} color="#FFF" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.detectButtonText}>
              {isDetecting ? 'Detecting...' : deviceDetected ? 'Device Detected' : 'Auto-Detect Device Info'}
            </Text>
          </AnimatedPressable>
        </AnimatedLinearGradient>
      </Animated.View>

      <Animated.View 
        style={styles.formContainer}
        entering={FadeInUp.duration(500).delay(300)}
      >
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
              <Feather name="camera" size={20} color="#5A71E4" />
            </AnimatedPressable>
          </View>
          <Text style={styles.helper}>Dial *#06# to get your IMEI number</Text>
          {error && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color="#E45A5A" />
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
          <Feather name="arrow-right" size={20} color="#FFF" />
        </AnimatedPressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#222D3A',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8494A9',
    marginTop: 4,
  },
  infoCard: {
    marginBottom: 28,
  },
  gradientCard: {
    borderRadius: 20,
    padding: 20,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    lineHeight: 22,
  },
  detectButton: {
    height: 46,
    backgroundColor: '#5A71E4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFF',
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
    color: '#222D3A',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#222D3A',
  },
  inputDetected: {
    borderWidth: 1,
    borderColor: '#5A71E4',
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
  },
  scanButton: {
    width: 52,
    height: 52,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helper: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#E45A5A',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#5A71E4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});