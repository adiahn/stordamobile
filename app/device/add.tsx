import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Smartphone, Camera, X, ArrowLeft, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import { useThemeStore } from '../../store/theme';
import { Platform } from 'react-native';

interface DeviceImage {
  uri: string;
}

export default function AddDeviceScreen() {
  const { isDark } = useThemeStore();
  const [imei, setImei] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [model, setModel] = useState('');
  const [images, setImages] = useState<DeviceImage[]>([]);

  const generateDeviceId = (model: string, imei: string) => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const imeiPart = imei.substring(imei.length - 6);
    const cleanModel = model.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
    return `${cleanModel}_${imeiPart}_${timestamp}${randomStr}`.toUpperCase();
  };

  const handleAutoDetect = async () => {
    const deviceName = await Device.modelName;
    if (deviceName) {
      setModel(deviceName);
    }
    
    // Instead of trying to get IMEI directly, we'll use a different approach
    // This is just a placeholder - you'll need to implement proper IMEI detection
    // using platform-specific APIs
    setImei('');
  };

  // Update MAC address helper based on platform
  const getMacAddressHelper = () => {
    if (Platform.OS === 'ios') {
      return 'On iPhone: Go to Settings > General > About > Wi-Fi Address';
    } else {
      return 'On Android: Go to Settings > About Phone > Status > Wi-Fi MAC address';
    }
  };

  const handleAddDevice = async () => {
    if (!model || !imei) return;
    
    // Check for duplicate IMEI
    const isDuplicateImei = await checkDuplicateImei(imei);
    if (isDuplicateImei) {
      Alert.alert('Error', 'A device with this IMEI is already registered.');
      return;
    }
    
    // Check for duplicate MAC address if provided
    if (macAddress) {
      const isDuplicateMac = await checkDuplicateMac(macAddress);
      if (isDuplicateMac) {
        Alert.alert('Error', 'A device with this MAC address is already registered.');
        return;
      }
    }
    
    const deviceId = generateDeviceId(model, imei);
    const newDevice = {
      id: deviceId,
      model,
      imei,
      macAddress,
      images,
      addedAt: new Date().toISOString(),
      isStolen: false,
      status: 'owned',
    };

    if (!macAddress) {
      Alert.alert(
        'Warning',
        'Adding a MAC address is highly recommended for device security and recovery purposes. You can add it later in device settings.',
        [{ text: 'OK' }]
      );
    }

    // Here you would save the device to your backend
    console.log('New device:', newDevice);
    router.back();
  };

  // Helper functions to check for duplicates
  const checkDuplicateImei = async (imei: string) => {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we'll return false
    return false;
  };

  const checkDuplicateMac = async (mac: string) => {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we'll return false
    return false;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, { uri: result.assets[0].uri }]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={isDark ? '#f1f5f9' : '#1e293b'} />
        </Pressable>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Add New Device</Text>
      </View>

      <ScrollView style={styles.content}>
        <Pressable style={styles.autoDetectButton} onPress={handleAutoDetect}>
          <Smartphone size={20} color="#ffffff" />
          <Text style={styles.autoDetectText}>Auto Detect Device</Text>
        </Pressable>

        <View style={styles.imageSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.deviceImage} />
                <Pressable
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}>
                  <X size={20} color="#ffffff" />
                </Pressable>
              </View>
            ))}
            <Pressable style={[styles.addImageButton, isDark && styles.darkAddImageButton]} onPress={pickImage}>
              <Plus size={24} color={isDark ? '#94a3b8' : '#64748b'} />
              <Text style={[styles.addImageText, isDark && styles.darkSubText]}>Add Photo</Text>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>IMEI Number *</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={imei}
              onChangeText={setImei}
              placeholder="Enter IMEI number"
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>MAC Address</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={macAddress}
              onChangeText={setMacAddress}
              placeholder="Enter MAC address (XX:XX:XX:XX:XX:XX)"
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            />
            <Text style={[styles.helperText, isDark && styles.darkSubText]}>
              {getMacAddressHelper()}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isDark && styles.darkText]}>Device Model *</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              value={model}
              onChangeText={setModel}
              placeholder="Enter device model"
              placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            />
          </View>

          <Pressable
            style={[styles.addButton, (!imei || !model) && styles.addButtonDisabled]}
            onPress={handleAddDevice}
            disabled={!imei || !model}>
            <Text style={styles.addButtonText}>Add Device</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  darkHeader: {
    backgroundColor: '#334155',
    borderBottomColor: '#475569',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  content: {
    flex: 1,
  },
  autoDetectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0891b2',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    justifyContent: 'center',
    gap: 8,
  },
  autoDetectText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  imageSection: {
    margin: 16,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  deviceImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  addImageButton: {
    width: 120,
    height: 120,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  darkAddImageButton: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  addImageText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  darkInput: {
    backgroundColor: '#334155',
    borderColor: '#475569',
    color: '#f1f5f9',
  },
  addButton: {
    backgroundColor: '#0891b2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#f1f5f9',
  },
  darkSubText: {
    color: '#94a3b8',
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});