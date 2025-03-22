import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Smartphone, QrCode, Search, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const devices = [
  {
    id: 'dev_1',
    name: 'iPhone 13 Pro',
    imei: '123456789012345',
    addedDate: '2024-02-01',
    identity: 'Personal',
  },
  {
    id: 'dev_2',
    name: 'MacBook Pro',
    imei: '987654321098765',
    addedDate: '2024-02-10',
    identity: 'Work',
  },
  {
    id: 'dev_3',
    name: 'iPad Air',
    imei: '456789012345678',
    addedDate: '2024-02-15',
    identity: 'Family',
  },
];

export default function DevicesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Devices</Text>
        <Text style={styles.subtitle}>Manage your protected devices</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search devices by IMEI or name"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.actionsContainer}>
        <AnimatedPressable style={styles.actionCard}>
          <LinearGradient
            colors={['#A6C8FF', '#D6B4FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}>
            <Smartphone size={24} color="#FFF" />
          </LinearGradient>
          <Text style={styles.actionTitle}>Register Device</Text>
          <Text style={styles.actionDescription}>Add a new device to protect</Text>
        </AnimatedPressable>

        <AnimatedPressable style={styles.actionCard}>
          <LinearGradient
            colors={['#D6B4FC', '#FF6B6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}>
            <QrCode size={24} color="#FFF" />
          </LinearGradient>
          <Text style={styles.actionTitle}>Scan IMEI</Text>
          <Text style={styles.actionDescription}>Quick device registration</Text>
        </AnimatedPressable>
      </View>

      <View style={styles.devicesSection}>
        <Text style={styles.sectionTitle}>Registered Devices</Text>
        {devices.map((device) => (
          <AnimatedPressable key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceInfo}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <View style={[styles.identityBadge, { backgroundColor: getIdentityColor(device.identity) }]}>
                  <Text style={styles.identityText}>{device.identity}</Text>
                </View>
              </View>
              <Text style={styles.deviceImei}>IMEI: {device.imei}</Text>
              <View style={styles.dateContainer}>
                <Calendar size={16} color="#666" />
                <Text style={styles.dateText}>Added on {formatDate(device.addedDate)}</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Protected</Text>
            </View>
          </AnimatedPressable>
        ))}
      </View>
    </ScrollView>
  );
}

function getIdentityColor(identity: string) {
  switch (identity.toLowerCase()) {
    case 'personal':
      return '#A6C8FF15';
    case 'work':
      return '#D6B4FC15';
    case 'family':
      return '#4CAF5015';
    default:
      return '#66666615';
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#121826',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#121826',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  actionGradient: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#121826',
    marginBottom: 4,
  },
  actionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  devicesSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#121826',
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  deviceInfo: {
    marginBottom: 12,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#121826',
  },
  identityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  identityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666',
  },
  deviceImei: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    backgroundColor: '#A6C8FF33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#A6C8FF',
  },
});