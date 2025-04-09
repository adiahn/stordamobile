import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Device from 'expo-device';
import { useDeviceStore, Device as DeviceType } from '../store/store';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const COLORS = ['Midnight Black', 'Sierra Blue', 'Gold', 'Silver', 'Graphite'];

export default function DeviceDetailsPage() {
  const params = useLocalSearchParams();
  const addDevice = useDeviceStore((state) => state.addDevice);
  
  const [model, setModel] = useState(params.detectedName as string || '');
  const [storage, setStorage] = useState(params.detectedStorage as string || '');
  const [color, setColor] = useState(params.detectedColor as string || '');
  const [hasReceipt, setHasReceipt] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isPreFilled, setIsPreFilled] = useState(false);
  const [deviceModelName, setDeviceModelName] = useState('');

  useEffect(() => {
    // Check if we have detected information
    if (params.detectedName || params.detectedStorage || params.detectedColor) {
      setIsPreFilled(true);
    }

    // Get real device model name
    const getDeviceInfo = async () => {
      try {
        const modelName = Device.modelName || '';
        
        if (modelName && !model) {
          setModel(modelName);
          setDeviceModelName(modelName);
        }
      } catch (err) {
        console.error('Error getting device info:', err);
      }
    };

    getDeviceInfo();
  }, [params, model]);

  const handleContinue = () => {
    // Add the device to the store
    const newDevice: DeviceType = {
      name: model || deviceModelName,
      imei: params.imei as string,
      macAddress: params.macAddress as string,
      id: `STD-${Math.floor(100000 + Math.random() * 900000)}`, // Generate random ID
      ownership: true,
      storage,
      color, 
      registrationDate: new Date().toISOString(),
      status: 'active',
      key: Date.now() // Use timestamp as key
    };
    
    addDevice(newDevice);
    
    // Navigate directly to success screen
    router.push({
      pathname: '/register/success',
      params: {
        imei: params.imei,
        macAddress: params.macAddress,
        model: model || deviceModelName,
        storage,
        color,
        hasReceipt: hasReceipt ? 'true' : 'false',
        hasPhoto: hasPhoto ? 'true' : 'false'
      }
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={18} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Device Details</Text>
        <Text style={styles.subtitle}>Tell us more about your device</Text>
      </View>

      {isPreFilled && (
        <Animated.View 
          style={styles.detectedInfo}
          entering={FadeInUp.duration(500).delay(200)}
        >
          <View style={styles.detectedHeader}>
            <Feather name="check-circle" size={18} color="#30B050" />
            <Text style={styles.detectedHeaderText}>Device Information Detected</Text>
          </View>
          <Text style={styles.detectedSubtext}>
            We've automatically filled in your device information. Auto-detected fields cannot be modified.
          </Text>
        </Animated.View>
      )}

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Model Name</Text>
            {isPreFilled && <Text style={styles.autoFilled}>Auto-detected</Text>}
          </View>
          <TextInput
            style={[styles.input, isPreFilled && styles.inputDetected]}
            value={model}
            onChangeText={setModel}
            placeholder="e.g., iPhone 13 Pro, Galaxy S21"
            placeholderTextColor="#8494A9"
            editable={!isPreFilled}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Storage Capacity</Text>
            {isPreFilled && storage && <Text style={styles.autoFilled}>Auto-detected</Text>}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}>
            {STORAGE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.chip,
                  storage === option && styles.chipSelected,
                  isPreFilled && storage && option !== storage && styles.chipDisabled
                ]}
                onPress={() => !isPreFilled && setStorage(option)}
                disabled={isPreFilled && !!storage}>
                <Text
                  style={[
                    styles.chipText,
                    storage === option && styles.chipTextSelected,
                    isPreFilled && storage && option !== storage && styles.chipTextDisabled
                  ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Device Color</Text>
            {isPreFilled && color && <Text style={styles.autoFilled}>Auto-detected</Text>}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}>
            {COLORS.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.chip,
                  color === option && styles.chipSelected,
                  isPreFilled && color && option !== color && styles.chipDisabled
                ]}
                onPress={() => !isPreFilled && setColor(option)}
                disabled={isPreFilled && !!color}>
                <Text
                  style={[
                    styles.chipText,
                    color === option && styles.chipTextSelected,
                    isPreFilled && color && option !== color && styles.chipTextDisabled
                  ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.uploadSection}>
          <Text style={styles.label}>Additional Documents (Optional)</Text>
          
          <View style={styles.uploadCards}>
            <Pressable
              style={[styles.uploadCard, hasReceipt && styles.uploadCardActive]}
              onPress={() => setHasReceipt(!hasReceipt)}>
              <View style={[styles.uploadIcon, hasReceipt && styles.uploadIconActive]}>
                <Feather name="file-text" size={18} color={hasReceipt ? "#FFF" : "#5A71E4"} />
              </View>
              <Text style={styles.uploadTitle}>Purchase Receipt</Text>
              <Text style={styles.uploadSubtitle}>PDF or Image</Text>
            </Pressable>

            <Pressable
              style={[styles.uploadCard, hasPhoto && styles.uploadCardActive]}
              onPress={() => setHasPhoto(!hasPhoto)}>
              <View style={[styles.uploadIcon, hasPhoto && styles.uploadIconActive]}>
                <Feather name="camera" size={18} color={hasPhoto ? "#FFF" : "#5A71E4"} />
              </View>
              <Text style={styles.uploadTitle}>Device Photo</Text>
              <Text style={styles.uploadSubtitle}>Take or upload photo</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Register Device</Text>
          <Feather name="arrow-right" size={18} color="#FFF" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 14,
    paddingTop: 45,
    paddingBottom: 20,
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
  title: {
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
  detectedInfo: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  detectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detectedHeaderText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#30B050',
    marginLeft: 8,
  },
  detectedSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#30B050',
    opacity: 0.8,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
  },
  autoFilled: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#30B050',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
  },
  inputDetected: {
    backgroundColor: 'rgba(48, 176, 80, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(48, 176, 80, 0.2)',
  },
  chipList: {
    paddingVertical: 6,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#5A71E4',
  },
  chipDisabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.5,
  },
  chipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#8494A9',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextDisabled: {
    color: '#CCCCCC',
  },
  uploadSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  uploadCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  uploadCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  uploadCardActive: {
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(90, 113, 228, 0.2)',
  },
  uploadIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadIconActive: {
    backgroundColor: '#5A71E4',
  },
  uploadTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#222D3A',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#8494A9',
  },
  continueButton: {
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});