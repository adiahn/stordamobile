import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Shield,
  Plus,
  TriangleAlert as AlertTriangle,
  ArrowRight,
} from 'lucide-react-native';
import Feather from '@expo/vector-icons/Feather';
import Animated from 'react-native-reanimated';
import { useState } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const router = useRouter();
  const deviceId = 'dev_1';

  const [devices, setDevices] = useState([
    {
      name: 'Iphone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      key: 1,
    },
    {
      name: 'Iphone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      key: 2,
    },
    {
      name: 'Iphone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      key: 3,
    },
    {
      name: 'Iphone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      key: 4,
    },
    {
      name: 'Iphone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      key: 5,
    },
    {
      name: 'Iphone 13 Pro',
      imei: '3121321122112',
      macAddress: '30291masmasdmas',
      key: 6,
    },
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>Adnan</Text>
      </View>
      <LinearGradient
        colors={['#A6C8FF', '#D6B4FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCard}
      >
        <View style={styles.statsContent}>
          <Shield size={32} color="#FFF" />
          <Text style={styles.statsTitle}>Storda Protection</Text>
          <Text style={styles.statsNumber}>3</Text>
        </View>
      </LinearGradient>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionButtons}>
          <AnimatedPressable
            onPress={() => {
              router.push(`/devices/dev_1`);
            }}
            style={[styles.actionButton, styles.addDevice]}
          >
            <Feather name="send" size={24} color="#A6C8FF" />
            <Text style={styles.actionButtonText}>Transfer Device</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => {
              router.push(`/register`);
            }}
            style={[styles.actionButton, styles.addDevice]}
          >
            <Plus size={24} color="#A6C8FF" />
            <Text style={styles.actionButtonText}>Add Device</Text>
          </AnimatedPressable>
        </View>
      </View>

      <View style={styles.devicesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Devices</Text>
          <Pressable>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        <View>
          {devices.map(
            (
              device
            ) => (
              <View key={device.id}>
                {' '}
                <Text>{device.name}</Text> 
              </View>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pressableButton: {
    alignItems: 'center',
  },
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
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#121826',
  },
  statsCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  statsContent: {
    alignItems: 'center',
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFF',
    marginTop: 12,
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFF',
    marginTop: 8,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#121826',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  addDevice: {
    borderWidth: 1,
    borderColor: '#A6C8FF',
  },
  reportStolen: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
    color: '#121826',
  },
  devicesContainer: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#A6C8FF',
  },
  deviceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#121826',
    marginBottom: 4,
  },
  deviceStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
});

{
  /* <AnimatedPressable key={index} style={styles.deviceCard}>
<View>
  <Text style={styles.deviceName}>{device}</Text>
  <Text style={styles.deviceStatus}>Protected</Text>
</View>
<ArrowRight size={20} color="#A6C8FF" />
</AnimatedPressable> */
}
