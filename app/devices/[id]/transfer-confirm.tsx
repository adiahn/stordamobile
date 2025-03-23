import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Shield, ArrowRight, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TransferConfirmScreen() {
  const handleConfirm = () => {
    router.push('/devices/transfer-success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Transfer</Text>
        <Text style={styles.subtitle}>Review transfer details</Text>
      </View>

      <LinearGradient
        colors={['#A6C8FF33', '#D6B4FC33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Shield size={24} color="#A6C8FF" />
          <Text style={styles.summaryTitle}>Transfer Summary</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Device</Text>
          <Text style={styles.detailValue}>iPhone 13 Pro</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Recipient</Text>
          <Text style={styles.detailValue}>@johndoe</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transfer Fee</Text>
          <Text style={styles.detailValue}>₦100</Text>
        </View>

        <View style={styles.infoBox}>
          <Clock size={20} color="#666" />
          <Text style={styles.infoText}>
            Transfer request expires in 24 hours if not confirmed by the recipient
          </Text>
        </View>
      </LinearGradient>

      <AnimatedPressable style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm & Pay ₦100</Text>
        <ArrowRight size={20} color="#FFF" />
      </AnimatedPressable>

      <AnimatedPressable
        style={styles.cancelButton}
        onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel Transfer</Text>
      </AnimatedPressable>
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
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#121826',
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  confirmButton: {
    height: 56,
    backgroundColor: '#A6C8FF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  confirmButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
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