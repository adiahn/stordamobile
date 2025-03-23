import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { CreditCard, Wallet, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PaymentPage() {
  const handlePayment = () => {
    router.push('/register/success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Complete device registration</Text>
      </View>

      <View style={styles.summaryCard}>
        <LinearGradient
          colors={['#A6C8FF33', '#D6B4FC33']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}>
          <View style={styles.summaryHeader}>
            <CreditCard size={24} color="#A6C8FF" />
            <Text style={styles.summaryTitle}>Registration Fee</Text>
          </View>
          <Text style={styles.amount}>₦100</Text>
          <Text style={styles.description}>
            One-time fee for device registration and protection
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.walletSection}>
        <View style={styles.walletHeader}>
          <Wallet size={20} color="#121826" />
          <Text style={styles.walletTitle}>Pay with Wallet</Text>
        </View>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦230.02</Text>
        </View>

        <AnimatedPressable style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay ₦100</Text>
          <ArrowRight size={20} color="#FFF" />
        </AnimatedPressable>

        <Text style={styles.disclaimer}>
          By proceeding, you agree to pay the registration fee of ₦100
        </Text>
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
    marginBottom: 24,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 20,
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
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#121826',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  walletSection: {
    gap: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#121826',
  },
  balanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
  },
  balanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#121826',
  },
  payButton: {
    height: 56,
    backgroundColor: '#A6C8FF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});