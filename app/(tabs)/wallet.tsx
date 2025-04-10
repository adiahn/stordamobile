import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
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
};

// Simplified recent transactions
const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 50,
    date: '2023-11-15T10:30:00Z',
    type: 'credit',
    description: 'Wallet Top-up',
  },
  {
    id: '2',
    amount: 9.99,
    date: '2023-11-12T14:45:00Z',
    type: 'debit',
    description: 'Device Protection',
  },
  {
    id: '3',
    amount: 25,
    date: '2023-11-05T09:15:00Z',
    type: 'credit',
    description: 'Wallet Top-up',
  },
];

export default function WalletScreen() {
  const [showAll, setShowAll] = useState(false);
  const balance = 65.01;
  
  // Show alert for top-up action
  const handleTopUp = () => {
    Alert.alert(
      'Top Up Wallet',
      'This feature will allow you to add funds to your wallet.',
      [{ text: 'OK' }]
    );
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Handle transaction item press
  const handleTransactionPress = (transaction: Transaction) => {
    Alert.alert(
      'Transaction Details',
      `Amount: ${formatCurrency(transaction.amount)}\nDate: ${formatDate(transaction.date)}\nType: ${transaction.type}\nDescription: ${transaction.description}`,
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
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
            </View>
            <Pressable style={styles.topUpButton} onPress={handleTopUp}>
              <Feather name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.topUpText}>Top Up</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* Transactions Section */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(400)}
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
            {(showAll ? TRANSACTIONS : TRANSACTIONS.slice(0, 2)).map((transaction) => (
              <Pressable
                key={transaction.id}
                style={styles.transactionItem}
                onPress={() => handleTransactionPress(transaction)}
              >
                <View style={styles.transactionIconContainer}>
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
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'credit' ? Colors.success : Colors.error }
                  ]}
                >
                  {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
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
    paddingBottom: 8,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceSection: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.light,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  topUpText: {
    color: Colors.text.light,
    fontWeight: '600',
    marginLeft: 6,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
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
    backgroundColor: Colors.primaryLight,
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
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  }
});