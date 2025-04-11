import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { formatCurrency } from '../utils/formatters';
import { Colors } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Simplified transaction type
type Transaction = {
  id: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  description: string;
  status: 'completed' | 'pending' | 'failed';
};

// Payment method type
type PaymentMethod = {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  number: string;
  expiryDate?: string;
  isDefault: boolean;
};

// Sample payment methods
const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Mastercard',
    number: '****2345',
    expiryDate: '05/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'bank',
    name: 'GTBank',
    number: '****7890',
    isDefault: false,
  }
];

// Simplified recent transactions
const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 15000,
    date: '2023-11-15T10:30:00Z',
    type: 'credit',
    description: 'Wallet Top-up',
    status: 'completed',
  },
  {
    id: '2',
    amount: 3500,
    date: '2023-11-12T14:45:00Z',
    type: 'debit',
    description: 'Device Protection',
    status: 'completed',
  },
  {
    id: '3',
    amount: 10000,
    date: '2023-11-05T09:15:00Z',
    type: 'credit',
    description: 'Wallet Top-up',
    status: 'completed',
  },
  {
    id: '4',
    amount: 500,
    date: '2023-10-25T09:15:00Z',
    type: 'debit',
    description: 'Service Fee',
    status: 'completed',
  },
];

export default function WalletScreen() {
  const [showAll, setShowAll] = useState(false);
  const balance = 21000;

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Show top-up modal
  const handleTopUp = () => {
    Alert.alert(
      'Top Up Wallet',
      'Choose an amount to add to your wallet',
      [
        {
          text: '₦5,000',
          onPress: () => handleTopUpAmount(5000)
        },
        {
          text: '₦10,000',
          onPress: () => handleTopUpAmount(10000)
        },
        {
          text: 'Other Amount',
          onPress: () => Alert.alert('Enter Amount', 'Custom amount functionality coming soon')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  // Handle top-up amount selection
  const handleTopUpAmount = (amount: number) => {
    Alert.alert(
      'Payment Method',
      'Select a payment method',
      [
        ...PAYMENT_METHODS.map(method => ({
          text: `${method.name} (${method.number})`,
          onPress: () => {
            Alert.alert(
              'Top-up Successful',
              `You have added ${formatCurrency(amount)} to your wallet`,
              [{ text: 'OK' }]
            );
          }
        })),
        { text: 'Cancel', style: 'cancel' as 'cancel' }
      ]
    );
  };

  // Handle transaction item press
  const handleTransactionPress = (transaction: Transaction) => {
    Alert.alert(
      'Transaction Details',
      `Amount: ${formatCurrency(transaction.amount)}\nDate: ${formatDate(transaction.date)}\nType: ${transaction.type}\nDescription: ${transaction.description}\nStatus: ${transaction.status}`,
      [{ text: 'OK' }]
    );
  };

  // Handle adding a payment method
  const handleAddPaymentMethod = () => {
    Alert.alert(
      'Add Payment Method',
      'You can add a new card or bank account',
      [
        {
          text: 'Add Card',
          onPress: () => Alert.alert('Add Card', 'Card adding functionality coming soon')
        },
        {
          text: 'Add Bank Account',
          onPress: () => Alert.alert('Add Bank', 'Bank adding functionality coming soon')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  // Show withdrawal modal
  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Funds',
      'This feature will be available soon',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.balanceContainer}
        >
          <LinearGradient
            colors={[Colors.primary, '#8C3BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.balanceCard}
          >
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
            </View>
            <View style={styles.actionButtons}>
              <Pressable style={styles.topUpButton} onPress={handleTopUp}>
                <Feather name="plus" size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Top Up</Text>
              </Pressable>
              <Pressable style={styles.withdrawButton} onPress={handleWithdraw}>
                <Feather name="arrow-down" size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Withdraw</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(400)}
          style={styles.quickActionsContainer}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Pressable style={styles.quickActionButton} onPress={handleTopUp}>
              <View style={[styles.quickActionIcon, { backgroundColor: Colors.primaryLight }]}>
                <Feather name="credit-card" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Add Money</Text>
            </Pressable>
            <Pressable style={styles.quickActionButton} onPress={handleWithdraw}>
              <View style={[styles.quickActionIcon, { backgroundColor: Colors.successLight }]}>
                <Feather name="refresh-cw" size={22} color={Colors.success} />
              </View>
              <Text style={styles.quickActionText}>Transfer</Text>
            </Pressable>
            <Pressable style={styles.quickActionButton} onPress={handleAddPaymentMethod}>
              <View style={[styles.quickActionIcon, { backgroundColor: Colors.warningLight }]}>
                <Feather name="plus" size={22} color={Colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Add Method</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Payment Methods */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.paymentMethodsContainer}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <Pressable onPress={handleAddPaymentMethod}>
              <Text style={styles.addMethodText}>Add New</Text>
            </Pressable>
          </View>
          <View style={styles.paymentMethods}>
            {PAYMENT_METHODS.map((method) => (
              <Animated.View 
                key={method.id}
                entering={FadeInRight.delay(250 + parseInt(method.id) * 50).duration(400)}
                style={styles.paymentMethodCard}
              >
                <View style={styles.paymentMethodIcon}>
                  {method.type === 'card' ? (
                    <Feather name="credit-card" size={20} color={Colors.primary} />
                  ) : (
                    <Feather name="home" size={20} color={Colors.primary} />
                  )}
                </View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  <Text style={styles.paymentMethodNumber}>{method.number}</Text>
                </View>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Transactions Section */}
        <Animated.View 
          entering={FadeInUp.delay(300).duration(400)}
          style={styles.transactionsContainer}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable onPress={() => setShowAll(!showAll)}>
              <Text style={styles.viewAllText}>
                {showAll ? 'Show Less' : 'View All'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.transactionsList}>
            {(showAll ? TRANSACTIONS : TRANSACTIONS.slice(0, 3)).map((transaction) => (
              <Pressable
                key={transaction.id}
                style={styles.transactionItem}
                onPress={() => handleTransactionPress(transaction)}
              >
                <View style={[
                  styles.transactionIconContainer,
                  { backgroundColor: transaction.type === 'credit' ? Colors.successLight : Colors.errorLight }
                ]}>
                  <Feather
                    name={transaction.type === 'credit' ? 'arrow-down-left' : 'arrow-up-right'}
                    size={16}
                    color={transaction.type === 'credit' ? Colors.success : Colors.error}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                </View>
                <View style={styles.transactionAmountContainer}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: transaction.type === 'credit' ? Colors.success : Colors.error }
                    ]}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: transaction.status === 'completed' ? Colors.success : 
                                     transaction.status === 'pending' ? Colors.warning : 
                                     Colors.error }
                  ]} />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  balanceContainer: {
    marginBottom: 24,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text.light,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: Colors.text.light,
    fontWeight: '600',
    marginLeft: 6,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMethodText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethodCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  paymentMethodNumber: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  defaultBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  transactionsContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  transactionsList: {
    gap: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  }
});