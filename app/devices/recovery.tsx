import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDeviceStore, Device } from '../store/store';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DeviceRecoveryScreen() {
  const params = useLocalSearchParams();
  const deviceId = params.id as string;
  const deviceKey = params.key ? parseInt(params.key as string) : undefined;
  
  const storeDevices = useDeviceStore((state) => state.devices);
  const device = storeDevices.find(d => d.id === deviceId) || null;
  
  const [recoveryInfo, setRecoveryInfo] = useState({
    recoveredBy: '',
    recoveryLocation: '',
    recoveryDetails: '',
    contactInfo: '',
  });

  const handleSubmit = () => {
    // Validate required fields
    if (!recoveryInfo.recoveredBy.trim()) {
      Alert.alert("Required Information", "Please enter your full name.");
      return;
    }
    
    if (!recoveryInfo.recoveryLocation.trim()) {
      Alert.alert("Required Information", "Please enter where you found the device.");
      return;
    }
    
    if (!recoveryInfo.contactInfo.trim()) {
      Alert.alert("Required Information", "Please provide contact information so the owner can reach you.");
      return;
    }
    
    try {
      if (!deviceKey) {
        throw new Error("Device key is missing");
      }
      
      useDeviceStore.getState().markDeviceRecovered(deviceKey, recoveryInfo);
      
      Alert.alert(
        "Recovery Reported",
        "Thank you for reporting this recovery. The owner has been notified and will contact you shortly.",
        [
          { 
            text: "OK", 
            onPress: () => router.push('/(tabs)')
          }
        ]
      );
    } catch (error) {
      console.error("Error reporting recovery:", error);
      Alert.alert("Error", "Failed to submit recovery report. Please try again.");
    }
  };
  
  if (!device) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={18} color="#222D3A" />
          </Pressable>
          <Text style={styles.title}>Device Not Found</Text>
        </View>
        <Text style={styles.errorText}>The device you are looking for could not be found.</Text>
        <Pressable 
          style={styles.homeButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={18} color="#222D3A" />
            </Pressable>
            <Text style={styles.title}>Report Recovery</Text>
          </View>
          
          <Animated.View 
            style={styles.deviceCard}
            entering={FadeInUp.duration(500).delay(100)}
          >
            <LinearGradient
              colors={['#FF9A00', '#FF6B00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.deviceGradient}
            >
              <View style={styles.deviceIcon}>
                <Feather name="smartphone" size={24} color="#FFF" />
              </View>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceId}>ID: {device.id}</Text>
              <View style={styles.deviceImei}>
                <Text style={styles.deviceImeiText}>IMEI: {device.imei}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {device.status === 'lost' ? 'Reported Lost' : 'Reported Stolen'}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
          
          <Animated.View
            style={styles.formContainer}
            entering={FadeInUp.duration(500).delay(200)}
          >
            <Text style={styles.formTitle}>Recovery Information</Text>
            <Text style={styles.formSubtitle}>
              Please provide information about how you found this device. The owner will be notified and may contact you.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={16} color="#8494A9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={recoveryInfo.recoveredBy}
                  onChangeText={(text) => setRecoveryInfo({...recoveryInfo, recoveredBy: text})}
                  placeholder="Enter your full name"
                  placeholderTextColor="#8494A9"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recovery Location *</Text>
              <View style={styles.inputWrapper}>
                <Feather name="map-pin" size={16} color="#8494A9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={recoveryInfo.recoveryLocation}
                  onChangeText={(text) => setRecoveryInfo({...recoveryInfo, recoveryLocation: text})}
                  placeholder="Where did you find the device?"
                  placeholderTextColor="#8494A9"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Information *</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={16} color="#8494A9" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={recoveryInfo.contactInfo}
                  onChangeText={(text) => setRecoveryInfo({...recoveryInfo, contactInfo: text})}
                  placeholder="Phone or email to contact you"
                  placeholderTextColor="#8494A9"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Additional Details</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={recoveryInfo.recoveryDetails}
                  onChangeText={(text) => setRecoveryInfo({...recoveryInfo, recoveryDetails: text})}
                  placeholder="Provide any additional information about how you found this device"
                  placeholderTextColor="#8494A9"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
            
            <AnimatedPressable 
              style={styles.submitButton}
              onPress={handleSubmit}
              entering={FadeInUp.duration(500).delay(300)}
            >
              <Text style={styles.submitButtonText}>Submit Recovery Report</Text>
            </AnimatedPressable>
            
            <Text style={styles.disclaimer}>
              By submitting this form, you confirm that all information provided is accurate. The device owner may contact you via the information you provide.
            </Text>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 30,
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
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8494A9',
    textAlign: 'center',
    marginVertical: 24,
  },
  homeButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  homeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
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
    marginBottom: 4,
  },
  deviceId: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  deviceImei: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  deviceImeiText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  formTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
    marginBottom: 8,
  },
  formSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 24,
    lineHeight: 20,
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
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
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
    padding: 0,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
    textAlign: 'center',
    lineHeight: 18,
  },
}); 