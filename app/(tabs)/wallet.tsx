import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const PAYMENT_METHODS = [
  {
    id: 1,
    type: 'card',
    name: 'Mastercard',
    number: '•••• 4582',
    icon: 'credit-card',
    color: '#222D3A',
  },
  {
    id: 2,
    type: 'bank',
    name: 'First Bank',
    number: '•••• 7290',
    icon: 'home',
    color: '#E45A5A',
  },
];

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
  const [showAll, setShowAll] = useState(false);
  const transactions = showAll ? TRANSACTIONS : TRANSACTIONS.slice(0, 3);

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
        style={styles.paymentMethodsContainer}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <TouchableOpacity style={styles.addButton}>
            <Feather name="plus" size={16} color="#5A71E4" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {PAYMENT_METHODS.map((method) => (
            <View key={method.id} style={styles.cardItem}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconContainer, { backgroundColor: method.color }]}>
                  <Feather name={method.icon as any} size={16} color="#FFF" />
                </View>
                <Feather name="more-vertical" size={18} color="#8494A9" />
              </View>
              <Text style={styles.cardName}>{method.name}</Text>
              <Text style={styles.cardNumber}>{method.number}</Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addCardButton}>
            <View style={styles.addCardPlus}>
              <Feather name="plus" size={24} color="#5A71E4" />
            </View>
            <Text style={styles.addCardText}>Add Payment Method</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      <Animated.View 
        style={styles.quickActionsContainer}
        entering={FadeInUp.duration(500).delay(400)}
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
        entering={FadeInUp.duration(500).delay(500)}
      >
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <AnimatedPressable 
            style={styles.viewAllButton}
            onPress={() => setShowAll(!showAll)}
          >
            <Text style={styles.viewAllText}>{showAll ? 'Show Less' : 'View All'}</Text>
          </AnimatedPressable>
        </View>
        
        <View style={styles.transactionsList}>
          {transactions.map((transaction, index) => (
            <AnimatedPressable 
              key={transaction.id} 
              style={styles.transactionItem}
              entering={FadeInUp.duration(300).delay(600 + index * 100)}
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
  content: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#222D3A',
  },
  balanceCard: {
    borderRadius: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#8C3BFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  balanceContent: {
    padding: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  balanceActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#5A71E4',
    marginLeft: 4,
  },
  cardsContainer: {
    paddingRight: 16,
  },
  cardItem: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 4,
  },
  cardNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  addCardButton: {
    width: 150,
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(90, 113, 228, 0.3)',
  },
  addCardPlus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addCardText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#5A71E4',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#222D3A',
  },
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#5A71E4',
  },
  transactionsList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 148, 169, 0.1)',
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 2,
  },
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  transactionAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  creditAmount: {
    color: '#30B050',
  },
  debitAmount: {
    color: '#E45A5A',
  },
});