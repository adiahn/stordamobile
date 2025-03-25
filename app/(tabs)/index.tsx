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
      id: 'SRD-21112',
      ownership: true,
      key: 1,
    },
    {
      name: 'Iphone 11 Pro',
      imei: '3121321122112',
      id: 'SRD-21112',
      macAddress: '30291masmdsdmas',
      ownership: false,
      key: 2,
    },
    {
      name: 'Samsung Z Fold 3',
      imei: '3121321122112',
      id: 'SRD-21112',
      macAddress: '30291masmasdmas',
      ownership: false,
      key: 3,
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
        {devices.map((device) => (
          <Pressable
            key={device.key}
            style={styles.deviceCard}
            onPress={() => router.push({ pathname: "/view/[id]", params: { id: device.id } })}
          >
            <View style={styles.deviceCardContent}>
              <View style={styles.deviceCardLeft}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceDetailLabel}>Device ID:</Text>
                  <Text style={styles.deviceDetailValue}>{device.id}</Text>
                </View>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceDetailLabel}>IMEI:</Text>
                  <Text style={styles.deviceDetailValue}>{device.imei}</Text>
                </View>
              </View>
              <View style={styles.deviceCardRight}>
                <View
                  style={[
                    styles.ownershipBadge,
                    device.ownership ? styles.ownedBadge : styles.unownedBadge,
                  ]}
                >
                  <Text style={styles.ownershipBadgeText}>
                    {device.ownership ? 'Owned' : 'Unowned'}
                  </Text>
                </View>
                <ArrowRight size={24} color="#A6C8FF" />
              </View>
            </View>
          </Pressable>
        ))}
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  deviceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  deviceCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#121826',
    marginBottom: 8,
  },
  deviceDetails: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  deviceDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666',
    marginRight: 6,
  },
  deviceDetailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#121826',
  },
  deviceCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownershipBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 12,
  },
  ownedBadge: {
    backgroundColor: '#E6F2FF',
  },
  unownedBadge: {
    backgroundColor: '#FFE6E6',
  },
  ownershipBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#121826',
  },
});
