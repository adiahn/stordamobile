import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useDeviceStore } from '../store/store';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DeviceDetailsScreen() {
  const params = useLocalSearchParams();
  const storeDevice = useDeviceStore((state) => state.selectedDevice);

  // Use the device from store, or fallback to params
  const device = storeDevice || {
    name: params.name || 'Unknown Device',
    imei: params.imei || 'N/A',
    macAddress: params.macAddress || 'N/A',
    id: params.Id || 'Unknown',
    ownership: params.ownership === 'true',
    storage: params.storage || '',
    color: params.color || '',
    brand: params.brand || '',
    registrationDate: params.registrationDate || new Date().toISOString(),
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <AnimatedPressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={22} color="#222D3A" />
        </AnimatedPressable>
      </View>

      <Animated.View 
        style={styles.deviceCard}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <LinearGradient
          colors={['#5A71E4', '#8C3BFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.deviceGradient}
        >
          <View style={styles.deviceIcon}>
            <Feather name="smartphone" size={32} color="#FFF" />
          </View>
          <Text style={styles.deviceName}>{device.name}</Text>
          <View style={styles.deviceStatus}>
            <View style={device.ownership ? styles.ownedBadge : styles.unownedBadge}>
              <Text style={device.ownership ? styles.ownedText : styles.unownedText}>
                {device.ownership ? 'Owned' : 'Unowned'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View 
        style={styles.detailsContainer}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <Text style={styles.sectionTitle}>Device Information</Text>
        
        <View style={styles.detailCard}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Device ID</Text>
            <Text style={styles.detailValue}>{device.id}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>IMEI Number</Text>
            <Text style={styles.detailValue}>{device.imei}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>MAC Address</Text>
            <Text style={styles.detailValue}>{device.macAddress}</Text>
          </View>

          {device.brand && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Brand</Text>
                <Text style={styles.detailValue}>{device.brand}</Text>
              </View>
            </>
          )}

          {device.storage && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Storage</Text>
                <Text style={styles.detailValue}>{device.storage}</Text>
              </View>
            </>
          )}

          {device.color && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Color</Text>
                <Text style={styles.detailValue}>{device.color}</Text>
              </View>
            </>
          )}

          {device.registrationDate && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Registered</Text>
                <Text style={styles.detailValue}>
                  {new Date(device.registrationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </>
          )}
        </View>
      </Animated.View>
      
      <Animated.View 
        style={styles.actionsContainer}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <View style={styles.actionsRow}>
          <AnimatedPressable style={styles.actionButton}>
            <View style={[styles.actionIcon, styles.primaryAction]}>
              <Feather name="refresh-cw" size={20} color="#FFF" />
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </AnimatedPressable>
          
          <AnimatedPressable style={styles.actionButton}>
            <View style={[styles.actionIcon, styles.secondaryAction]}>
              <Feather name="bell" size={20} color="#FFF" />
            </View>
            <Text style={styles.actionText}>Alert</Text>
          </AnimatedPressable>
          
          <AnimatedPressable style={styles.actionButton}>
            <View style={[styles.actionIcon, styles.dangerAction]}>
              <Feather name="trash-2" size={20} color="#FFF" />
            </View>
            <Text style={styles.actionText}>Remove</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  deviceGradient: {
    padding: 24,
    alignItems: 'center',
  },
  deviceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deviceName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  deviceStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ownedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  unownedBadge: {
    backgroundColor: 'rgba(228, 90, 90, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  ownedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  unownedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  detailItem: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 6,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(132, 148, 169, 0.15)',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryAction: {
    backgroundColor: '#5A71E4',
  },
  secondaryAction: {
    backgroundColor: '#5E5EBF',
  },
  dangerAction: {
    backgroundColor: '#E45A5A',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
  },
});