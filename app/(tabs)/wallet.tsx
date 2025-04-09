import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const TRANSACTIONS = [
  {
    id: 1,
    type: 'credit',
    amount: '₦230.00',
    description: 'Wallet Topup',
    date: 'Today, 10:42 AM',
  },
  {
    id: 2,
    type: 'debit',
    amount: '₦100.00',
    description: 'iPhone Registration',
    date: 'May 15, 2023',
  },
  {
    id: 3,
    type: 'debit',
    amount: '₦100.00',
    description: 'Samsung Registration',
    date: 'Apr 30, 2023',
  },
  {
    id: 4,
    type: 'credit',
    amount: '₦200.00',
    description: 'Wallet Topup',
    date: 'Apr 28, 2023',
  },
];

export default function WalletScreen() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Text style={styles.headerTitle}>Wallet</Text>
      </Animated.View>

      <AnimatedLinearGradient
        colors={['#5A71E4', '#8C3BFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦230.00</Text>
          
          <View style={styles.balanceActions}>
            <AnimatedPressable style={styles.balanceActionButton}>
              <View style={styles.actionIconContainer}>
                <Feather name="plus" size={18} color="#FFF" />
              </View>
              <Text style={styles.actionButtonText}>Top Up</Text>
            </AnimatedPressable>
            
            <AnimatedPressable style={styles.balanceActionButton}>
              <View style={styles.actionIconContainer}>
                <Feather name="arrow-up-right" size={18} color="#FFF" />
              </View>
              <Text style={styles.actionButtonText}>Send</Text>
            </AnimatedPressable>
          </View>
        </View>
      </AnimatedLinearGradient>

      <Animated.View 
        style={styles.quickActionsContainer}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.quickActions}>
          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIcon}>
              <Feather name="credit-card" size={20} color="#5A71E4" />
            </View>
            <Text style={styles.quickActionText}>Pay Fees</Text>
          </AnimatedPressable>
          
          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIcon}>
              <Feather name="refresh-cw" size={20} color="#5A71E4" />
            </View>
            <Text style={styles.quickActionText}>History</Text>
          </AnimatedPressable>
          
          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIcon}>
              <Feather name="life-buoy" size={20} color="#5A71E4" />
            </View>
            <Text style={styles.quickActionText}>Support</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.transactionsContainer}
        entering={FadeInUp.duration(500).delay(400)}
      >
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <AnimatedPressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </AnimatedPressable>
        </View>
        
        {TRANSACTIONS.map((transaction, index) => (
          <AnimatedPressable 
            key={transaction.id} 
            style={styles.transactionItem}
            entering={FadeInUp.duration(300).delay(500 + index * 100)}
          >
            <View style={[
              styles.transactionIconContainer,
              transaction.type === 'credit' 
                ? styles.creditIconContainer 
                : styles.debitIconContainer
            ]}>
              <Feather 
                name={transaction.type === 'credit' ? 'arrow-down-left' : 'arrow-up-right'} 
                size={18} 
                color={transaction.type === 'credit' ? '#30B050' : '#E45A5A'} 
              />
            </View>
            
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            
            <Text style={[
              styles.transactionAmount,
              transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
            ]}>
              {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
            </Text>
          </AnimatedPressable>
        ))}
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
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#222D3A',
  },
  balanceCard: {
    borderRadius: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#8C3BFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  balanceContent: {
    padding: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  balanceActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
  },
  transactionsContainer: {
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    padding: 8,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#5A71E4',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  creditIconContainer: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
  },
  debitIconContainer: {
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  transactionAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  creditAmount: {
    color: '#30B050',
  },
  debitAmount: {
    color: '#E45A5A',
  },
});