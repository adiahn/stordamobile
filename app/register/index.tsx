import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import * as Device from 'expo-device';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function RegisterDevicePage() {
  const [imei, setImei] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [brand, setBrand] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [deviceDetected, setDeviceDetected] = useState(false);
  const [detectedDeviceName, setDetectedDeviceName] = useState('');
  
  useEffect(() => {
    // Simulate automatic detection when component mounts
    simulateDeviceDetection();
  }, []);

  const simulateDeviceDetection = () => {
    setIsDetecting(true);
    
    // Simulate a detection process
    setTimeout(() => {
      setDeviceDetected(true);
      setDetectedDeviceName('Asus ASUS_I005DA');
      setImei('886857752052945');
      setIsDetecting(false);
    }, 2000);
  };

  const handleContinue = () => {
    if (!imei.trim() || imei.length < 15) {
      return;
    }

    router.push({
      pathname: '/register/details',
      params: { 
        imei,
        macAddress,
        brand,
        detectedName: deviceDetected ? detectedDeviceName : '',
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>Register Device</Text>
          <Text style={styles.subtitle}>Protect your device with Storda</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.infoCard}
        >
          <View style={styles.infoRow}>
            <View style={styles.deviceIconContainer}>
              <Feather name="smartphone" size={24} color="#5A71E4" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Why Register?</Text>
              <Text style={styles.infoText}>
                Registering your device helps protect it from theft and makes recovery easier if lost.
              </Text>
            </View>
          </View>

          <AnimatedPressable 
            style={[
              styles.detectButton,
              deviceDetected && styles.detectButtonSuccess
            ]} 
            disabled={isDetecting || deviceDetected}
          >
            {isDetecting ? (
              <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
            ) : (
              <Feather 
                name={deviceDetected ? "check" : "zap"} 
                size={20} 
                color="#FFF" 
                style={{ marginRight: 8 }} 
              />
            )}
            <Text style={styles.detectButtonText}>
              {isDetecting ? 'Device Detecting...' : deviceDetected ? 'Device Detected' : 'Detect Device'}
            </Text>
          </AnimatedPressable>
        </Animated.View>

        {deviceDetected && (
          <Animated.View 
            entering={FadeInUp.duration(500)}
            style={styles.detectedBanner}
          >
            <View style={styles.detectedIndicator} />
            <Text style={styles.detectedTitle}>Device Detected</Text>
            <Text style={styles.detectedModel}>{detectedDeviceName}</Text>
          </Animated.View>
        )}

        <Animated.View 
          entering={FadeInDown.duration(600).delay(300)}
          style={styles.formSection}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>IMEI Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={imei}
                onChangeText={(text) => setImei(text.replace(/[^0-9]/g, ''))}
                placeholder="886857752052945"
                keyboardType="numeric"
                maxLength={15}
                placeholderTextColor="#8494A9"
              />
              <Pressable style={styles.scanButton}>
                <Feather name="camera" size={24} color="#5A71E4" />
              </Pressable>
            </View>
            <Text style={styles.inputHelper}>Dial *#06# to get your IMEI number</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>MAC Address (Optional)</Text>
            <TextInput
              style={styles.input}
              value={macAddress}
              onChangeText={setMacAddress}
              placeholder=""
              placeholderTextColor="#8494A9"
            />
            <Text style={styles.inputHelper}>Found in your device's network settings</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Brand</Text>
            <TextInput
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
              placeholder=""
              placeholderTextColor="#8494A9"
            />
          </View>
        </Animated.View>
      </ScrollView>

      <AnimatedPressable 
        entering={FadeInUp.duration(600)}
        style={styles.continueButton} 
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
        <Feather name="arrow-right" size={20} color="#FFF" />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  infoCard: {
    backgroundColor: '#F0F4FD',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  deviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  detectButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A71E4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  detectButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  detectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  detectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  detectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  detectedTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4CAF50',
    marginRight: 8,
  },
  detectedModel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    flex: 1,
  },
  formSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scanButton: {
    position: 'absolute',
    right: 12,
    padding: 5,
  },
  inputHelper: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 6,
  },
  continueButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A71E4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});