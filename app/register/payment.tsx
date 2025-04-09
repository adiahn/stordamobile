import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function PaymentPage() {
  const params = useLocalSearchParams();
  
  // Collect all device information to pass to success screen
  const deviceData = {
    imei: params.imei,
    macAddress: params.macAddress,
    brand: params.brand,
    model: params.model,
    storage: params.storage,
    color: params.color,
    hasReceipt: params.hasReceipt,
    hasPhoto: params.hasPhoto
  };

  const handlePayment = () => {
    router.push({
      pathname: '/register/success',
      params: deviceData
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={22} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Complete device registration</Text>
      </View>

      <Animated.View 
        style={styles.summaryCard}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <AnimatedLinearGradient
          colors={['rgba(90, 113, 228, 0.15)', 'rgba(140, 59, 255, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}>
          <View style={styles.summaryHeader}>
            <Feather name="credit-card" size={24} color="#5A71E4" />
            <Text style={styles.summaryTitle}>Registration Fee</Text>
          </View>
          <Text style={styles.amount}>₦100</Text>
          <Text style={styles.description}>
            One-time fee for device registration and protection
          </Text>
          
          <View style={styles.deviceSummary}>
            <Text style={styles.deviceSummaryLabel}>Device Summary</Text>
            <View style={styles.deviceDetail}>
              <Text style={styles.deviceDetailLabel}>Device:</Text>
              <Text style={styles.deviceDetailValue}>
                {params.model || 'Unknown Device'} ({params.storage || 'Unknown'})
              </Text>
            </View>
            <View style={styles.deviceDetail}>
              <Text style={styles.deviceDetailLabel}>IMEI:</Text>
              <Text style={styles.deviceDetailValue}>
                {params.imei || 'Not provided'}
              </Text>
            </View>
          </View>
        </AnimatedLinearGradient>
      </Animated.View>

      <Animated.View 
        style={styles.walletSection}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <View style={styles.walletHeader}>
          <Feather name="credit-card" size={20} color="#222D3A" />
          <Text style={styles.walletTitle}>Pay with Wallet</Text>
        </View>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦230.02</Text>
        </View>

        <AnimatedPressable style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay ₦100</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </AnimatedPressable>

        <Text style={styles.disclaimer}>
          By proceeding, you agree to pay the registration fee of ₦100
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#222D3A',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8494A9',
    marginTop: 4,
  },
  summaryCard: {
    marginBottom: 24,
  },
  gradientCard: {
    borderRadius: 20,
    padding: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#222D3A',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    lineHeight: 20,
    marginBottom: 24,
  },
  deviceSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
  },
  deviceSummaryLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  deviceDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  deviceDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
    width: 70,
  },
  deviceDetailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
    flex: 1,
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
    color: '#222D3A',
  },
  balanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
  },
  balanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#222D3A',
  },
  payButton: {
    height: 56,
    backgroundColor: '#5A71E4',
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
    color: '#8494A9',
    textAlign: 'center',
    marginTop: 8,
  },
});