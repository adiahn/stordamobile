import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, ArrowUpRight, Clock, RefreshCw } from 'lucide-react-native';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const transactions = [
  {
    id: 1,
    type: 'Device Protection',
    device: 'iPhone 13 Pro',
    amount: -29.99,
    date: '2024-02-15',
    status: 'completed'
  },
  {
    id: 2,
    type: 'Wallet Top-up',
    amount: 100,
    date: '2024-02-14',
    status: 'completed'
  },
  {
    id: 3,
    type: 'Device Protection',
    device: 'MacBook Pro',
    amount: -39.99,
    date: '2024-02-13',
    status: 'completed'
  }
];

export default function WalletScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
        <Text style={styles.subtitle}>Manage your balance and transactions</Text>
      </View>

      <LinearGradient
        colors={['#A6C8FF', '#D6B4FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <CreditCard size={24} color="#FFF" />
          <Text style={styles.balanceLabel}>Available Balance</Text>
        </View>
        <Text style={styles.balanceAmount}>₦230.02</Text>
        <View style={styles.balanceActions}>
          <AnimatedPressable style={styles.balanceButton}>
            <Text style={styles.balanceButtonText}>Add Money</Text>
            <ArrowUpRight size={20} color="#A6C8FF" />
          </AnimatedPressable>
        </View>
      </LinearGradient>

      <View style={styles.transactionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <AnimatedPressable>
            <RefreshCw size={20} color="#A6C8FF" />
          </AnimatedPressable>
        </View>

        {transactions.map((transaction) => (
          <AnimatedPressable key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <Clock size={24} color="#A6C8FF" />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionType}>{transaction.type}</Text>
              {transaction.device && (
                <Text style={styles.transactionDevice}>{transaction.device}</Text>
              )}
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: transaction.amount > 0 ? '#4CAF50' : '#121826' }
              ]}>
              ₦{Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </AnimatedPressable>
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
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFF',
    marginBottom: 16,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  balanceButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#A6C8FF',
  },
  transactionsContainer: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#121826',
  },
  transactionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#A6C8FF15',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#121826',
    marginBottom: 4,
  },
  transactionDevice: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
});