import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDeviceStore, Device } from '../store/store';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as DeviceInfo from 'expo-device';

export default function DeviceDetailsPage() {
  const params = useLocalSearchParams();
  const addDevice = useDeviceStore((state) => state.addDevice);
  
  const [model] = useState(params.detectedName as string || 'Asus ASUS_I005DA');
  const [storageCapacity, setStorageCapacity] = useState<'64GB' | '128GB' | '256GB' | '512GB' | '1TB'>('128GB');
  const [deviceColor, setDeviceColor] = useState<'Midnight Black' | 'Sierra Blue' | 'Gold' | 'Silver' | 'Graphite'>('Midnight Black');
  const [hasReceipt, setHasReceipt] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);

  const handleRegister = () => {
    // Create the device object with proper typing
    const newDevice: Device = {
      name: model,
      imei: params.imei as string,
      macAddress: params.macAddress as string || '',
      id: `STD-${Math.floor(100000 + Math.random() * 900000)}`, // Generate random ID
      ownership: true,
      storage: storageCapacity,
      color: deviceColor, 
      registrationDate: new Date().toISOString(),
      status: 'active',
      key: Date.now(), // Use timestamp as key
      verificationStatus: hasReceipt || hasPhoto ? 'verified' : 'pending',
      verificationMethod: hasReceipt ? 'receipt' : hasPhoto ? 'photo' : 'none',
    };
    
    // Add device to store
    if (addDevice) {
      addDevice(newDevice);
    }
    
    // Navigate to success
    router.push('/register/success');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#333" />
          </Pressable>
        </View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>Device Details</Text>
          <Text style={styles.subtitle}>Tell us more about your device</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.detectionBanner}
        >
          <Feather name="check-circle" size={20} color="#4CAF50" />
          <View style={styles.detectionTextContainer}>
            <Text style={styles.detectionTitle}>Device Information Detected</Text>
            <Text style={styles.detectionText}>
              We've automatically filled in your device information.
              Auto-detected fields cannot be modified.
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(300)}
          style={styles.formSection}
        >
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Model Name</Text>
              <Text style={styles.autoDetected}>Auto-detected</Text>
            </View>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{model}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Storage Capacity</Text>
            <View style={styles.optionsContainer}>
              <StorageOption 
                value="64GB" 
                selected={storageCapacity === "64GB"} 
                onSelect={() => setStorageCapacity("64GB")} 
              />
              <StorageOption 
                value="128GB" 
                selected={storageCapacity === "128GB"} 
                onSelect={() => setStorageCapacity("128GB")} 
              />
              <StorageOption 
                value="256GB" 
                selected={storageCapacity === "256GB"} 
                onSelect={() => setStorageCapacity("256GB")} 
              />
              <StorageOption 
                value="512GB" 
                selected={storageCapacity === "512GB"} 
                onSelect={() => setStorageCapacity("512GB")} 
              />
              <StorageOption 
                value="1TB" 
                selected={storageCapacity === "1TB"} 
                onSelect={() => setStorageCapacity("1TB")} 
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Device Color</Text>
            <View style={styles.optionsContainer}>
              <ColorOption 
                value="Midnight Black" 
                selected={deviceColor === "Midnight Black"} 
                onSelect={() => setDeviceColor("Midnight Black")} 
              />
              <ColorOption 
                value="Sierra Blue" 
                selected={deviceColor === "Sierra Blue"} 
                onSelect={() => setDeviceColor("Sierra Blue")} 
              />
              <ColorOption 
                value="Gold" 
                selected={deviceColor === "Gold"} 
                onSelect={() => setDeviceColor("Gold")} 
              />
              <ColorOption 
                value="Silver" 
                selected={deviceColor === "Silver"} 
                onSelect={() => setDeviceColor("Silver")} 
              />
              <ColorOption 
                value="Graphite" 
                selected={deviceColor === "Graphite"} 
                onSelect={() => setDeviceColor("Graphite")} 
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Documents (Optional)</Text>
            <View style={styles.documentsContainer}>
              <DocumentOption
                icon="file-text"
                title="Purchase Receipt"
                subtitle="PDF or Image"
                selected={hasReceipt}
                onToggle={() => setHasReceipt(!hasReceipt)}
              />
              <DocumentOption
                icon="camera"
                title="Device Photo"
                subtitle="Take or upload photo"
                selected={hasPhoto}
                onToggle={() => setHasPhoto(!hasPhoto)}
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <Pressable 
        style={styles.registerButton} 
        onPress={handleRegister}
      >
        <Text style={styles.registerButtonText}>Register Device</Text>
        <Feather name="arrow-right" size={20} color="#FFF" />
      </Pressable>
    </View>
  );
}

const StorageOption = ({ value, selected, onSelect }: { 
  value: string; 
  selected: boolean; 
  onSelect: () => void 
}) => (
  <Pressable 
    style={[styles.optionButton, selected && styles.optionButtonSelected]} 
    onPress={onSelect}
  >
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
      {value}
    </Text>
  </Pressable>
);

const ColorOption = ({ value, selected, onSelect }: { 
  value: string; 
  selected: boolean; 
  onSelect: () => void 
}) => (
  <Pressable 
    style={[styles.optionButton, selected && styles.optionButtonSelected]} 
    onPress={onSelect}
  >
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
      {value}
    </Text>
  </Pressable>
);

const DocumentOption = ({ 
  icon, 
  title, 
  subtitle, 
  selected, 
  onToggle 
}: { 
  icon: any; 
  title: string; 
  subtitle: string; 
  selected: boolean; 
  onToggle: () => void 
}) => (
  <Pressable 
    style={[styles.documentOption, selected && styles.documentOptionSelected]} 
    onPress={onToggle}
  >
    <View style={[styles.documentIconContainer, selected && styles.documentIconContainerSelected]}>
      <Feather name={icon} size={24} color={selected ? "#FFF" : "#5A71E4"} />
    </View>
    <Text style={styles.documentTitle}>{title}</Text>
    <Text style={styles.documentSubtitle}>{subtitle}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 50,
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
  titleContainer: {
    marginTop: 10,
    marginBottom: 20,
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
  detectionBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  detectionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  detectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  detectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 8,
  },
  autoDetected: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4CAF50',
  },
  disabledInput: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
  },
  disabledInputText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionButtonSelected: {
    backgroundColor: '#5A71E4',
    borderColor: '#5A71E4',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  optionTextSelected: {
    color: '#FFF',
  },
  documentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentOption: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  documentOptionSelected: {
    borderColor: '#5A71E4',
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
  },
  documentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIconContainerSelected: {
    backgroundColor: '#5A71E4',
  },
  documentTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  documentSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  registerButton: {
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
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});