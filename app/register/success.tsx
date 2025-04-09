import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useDeviceStore, Device as StoreDevice } from '../store/store';

// Define the device status type to match the store definition
type DeviceStatus = 'active' | 'reported' | 'lost' | 'stolen' | 'transferred';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SuccessPage() {
  const params = useLocalSearchParams();
  const deviceId = 'STORDA-' + Math.floor(1000000 + Math.random() * 9000000);
  
  // Create a new device object
  const newDevice: StoreDevice = {
    name: params.model as string || 'New Device',
    imei: params.imei as string || '000000000000000',
    macAddress: params.macAddress as string || 'Unknown',
    id: deviceId,
    ownership: true,
    key: Date.now(), // Use timestamp as unique key
    storage: params.storage as string,
    color: params.color as string,
    brand: params.brand as string,
    registrationDate: new Date().toISOString(),
    status: 'active' as DeviceStatus, // Explicitly type as DeviceStatus
  };

  const { addDevice } = useDeviceStore();
  
  const handleContinue = () => {
    // Add the new device to the store
    if (addDevice) {
      addDevice(newDevice);
    }
    
    // Navigate to the home screen
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(90, 113, 228, 0.1)', 'rgba(140, 59, 255, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}>
        <Animated.View 
          style={styles.iconContainer}
          entering={FadeInUp.duration(600).delay(300)}
        >
          <Feather name="shield" size={48} color="#5A71E4" />
        </Animated.View>
        
        <Animated.View entering={FadeInUp.duration(600).delay(500)}>
          <Text style={styles.title}>Registration Complete!</Text>
          <Text style={styles.subtitle}>Your device is now protected with Storda</Text>
        </Animated.View>

        <Animated.View 
          style={styles.infoCard}
          entering={FadeInUp.duration(600).delay(700)}
        >
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Storda ID</Text>
            <Text style={styles.infoValue}>{deviceId}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device</Text>
            <Text style={styles.infoValue}>{newDevice.name}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IMEI</Text>
            <Text style={styles.infoValue}>{newDevice.imei}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </Animated.View>

        <AnimatedPressable 
          style={styles.continueButton} 
          onPress={handleContinue}
          entering={FadeInUp.duration(600).delay(900)}
        >
          <Text style={styles.continueButtonText}>View My Devices</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </AnimatedPressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#FFF',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#222D3A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8494A9',
    marginBottom: 32,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(132, 148, 169, 0.15)',
    width: '100%',
  },
  statusBadge: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#30B050',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#5A71E4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});