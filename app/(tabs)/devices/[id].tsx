import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowRight, UserCheck, History, CircleAlert as AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DeviceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [username, setUsername] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);

  // Mock device data - replace with actual data fetching
  const device = {
    id: 'dev_1',
    name: 'iPhone 13 Pro',
    imei: '123456789012345',
    stordaId: 'STORDA-1002938',
    addedDate: '2024-02-01',
    identity: 'Personal',
    color: 'Sierra Blue',
    storage: '256GB',
  };

  const handleTransfer = () => {
    // Implement transfer logic
    router.push(`/devices/${id}/transfer-confirm`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Device Details</Text>
        <Text style={styles.subtitle}>{device.name}</Text>
      </View>

      <LinearGradient
        colors={['#A6C8FF33', '#D6B4FC33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Storda ID</Text>
          <Text style={styles.detailValue}>{device.stordaId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IMEI</Text>
          <Text style={styles.detailValue}>{device.imei}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Color</Text>
          <Text style={styles.detailValue}>{device.color}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Storage</Text>
          <Text style={styles.detailValue}>{device.storage}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Added On</Text>
          <Text style={styles.detailValue}>{new Date(device.addedDate).toLocaleDateString()}</Text>
        </View>
      </LinearGradient>

      {!showTransfer ? (
        <View style={styles.actionButtons}>
          <AnimatedPressable
            style={styles.transferButton}
            onPress={() => setShowTransfer(true)}>
            <UserCheck size={24} color="#FFF" />
            <Text style={styles.transferButtonText}>Transfer Ownership</Text>
          </AnimatedPressable>

          <AnimatedPressable style={styles.historyButton}>
            <History size={24} color="#A6C8FF" />
            <Text style={styles.historyButtonText}>Transfer History</Text>
          </AnimatedPressable>
        </View>
      ) : (
        <View style={styles.transferForm}>
          <View style={styles.warningCard}>
            <AlertCircle size={24} color="#FF6B6B" />
            <Text style={styles.warningText}>
              Transfer fee of ₦100 will be deducted from your wallet
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient's Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter Storda username"
            />
          </View>

          <AnimatedPressable
            style={[styles.transferButton, styles.confirmButton]}
            onPress={handleTransfer}>
            <Text style={styles.transferButtonText}>Continue to Payment</Text>
            <ArrowRight size={20} color="#FFF" />
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.cancelButton}
            onPress={() => setShowTransfer(false)}>
            <Text style={styles.cancelButtonText}>Cancel Transfer</Text>
          </AnimatedPressable>
        </View>
      )}
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
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#A6C8FF33',
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#121826',
  },
  actionButtons: {
    gap: 12,
  },
  transferButton: {
    height: 56,
    backgroundColor: '#A6C8FF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  transferButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  historyButton: {
    height: 56,
    backgroundColor: '#A6C8FF15',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  historyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#A6C8FF',
  },
  transferForm: {
    gap: 16,
  },
  warningCard: {
    backgroundColor: '#FF6B6B15',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF6B6B',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#121826',
  },
  input: {
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#121826',
  },
  confirmButton: {
    marginTop: 8,
  },
  cancelButton: {
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF6B6B',
  },
});