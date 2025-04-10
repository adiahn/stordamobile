import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Transaction type definition
interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

// Sample transactions data
const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Wallet Top-up',
    amount: 100,
    date: '2023-08-01T10:30:00',
    type: 'credit',
    status: 'completed',
    description: 'Added funds via credit card ending in 4242'
  },
  {
    id: '2',
    title: 'Phone Protection Payment',
    amount: 45.99,
    date: '2023-07-25T14:20:00',
    type: 'debit',
    status: 'completed',
    description: 'Monthly protection plan payment for iPhone 12 Pro'
  },
  {
    id: '3',
    title: 'Wallet Top-up',
    amount: 200,
    date: '2023-07-15T09:45:00',
    type: 'credit',
    status: 'completed',
    description: 'Added funds via bank transfer'
  },
  {
    id: '4',
    title: 'Laptop Protection Payment',
    amount: 59.99,
    date: '2023-07-10T16:30:00',
    type: 'debit',
    status: 'completed',
    description: 'Annual protection plan payment for MacBook Pro'
  },
  {
    id: '5',
    title: 'Referral Bonus',
    amount: 25,
    date: '2023-07-05T11:15:00',
    type: 'credit',
    status: 'completed',
    description: 'Bonus for referring John Smith'
  }
];

export default function WalletScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Current wallet balance calculation
  const balance = TRANSACTIONS.reduce((acc, transaction) => {
    return transaction.type === 'credit'
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  // Filter transactions based on search
  const filteredTransactions = searchQuery 
    ? TRANSACTIONS.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : TRANSACTIONS;

  const displayedTransactions = showAll
    ? filteredTransactions
    : filteredTransactions.slice(0, 3);

  const handleTopUp = () => {
    Alert.alert(
      'Top Up Wallet',
      'This feature would allow you to add funds to your wallet.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Top up initiated') }
      ]
    );
  };

  const handleTransactionPress = (transaction: Transaction) => {
    Alert.alert(
      transaction.title,
      `${transaction.description}\nAmount: ${formatCurrency(transaction.amount)}\nDate: ${formatDate(transaction.date, 'long')}\nStatus: ${transaction.status}`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const renderTransactionItem = (transaction: Transaction, index: number) => {
    const isCredit = transaction.type === 'credit';
    return (
      <Animated.View
        key={transaction.id}
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <Pressable
          style={[
            styles.transactionItem,
            index !== 0 && styles.transactionBorder,
          ]}
          onPress={() => handleTransactionPress(transaction)}
        >
          <View
            style={[
              styles.transactionIconContainer,
              isCredit
                ? styles.creditIconContainer
                : styles.debitIconContainer,
            ]}
          >
            <Feather
              name={isCredit ? 'arrow-down-left' : 'arrow-up-right'}
              size={18}
              color={isCredit ? '#4CAF50' : '#F44336'}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={[styles.transactionTitle, { color: colors.text }]}>
              {transaction.title}
            </Text>
            <Text style={styles.transactionDate}>
              {formatDate(transaction.date, 'relative')}
            </Text>
          </View>
          <View style={styles.transactionAmount}>
            <Text
              style={[
                styles.amountText,
                { color: isCredit ? '#4CAF50' : '#F44336' }
              ]}
            >
              {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
            </Text>
            <Text style={[styles.statusText, { color: colors.text }]}>
              {transaction.status}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={[styles.screenTitle, { color: colors.text }]}>Wallet</Text>
            </View>

            {/* Balance Card */}
            <Animated.View
              style={[styles.balanceCard, { backgroundColor: colors.primary }]}
              entering={FadeInDown.delay(100).springify()}
            >
              <BlurView
                intensity={Platform.OS === 'ios' ? 50 : 100}
                tint="dark"
                style={styles.blurContainer}
              >
                <View style={styles.balanceContainer}>
                  <Text style={styles.balanceLabel}>Current Balance</Text>
                  <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
                  <Pressable
                    style={[styles.topUpButton, { backgroundColor: colors.card }]}
                    onPress={handleTopUp}
                  >
                    <Text style={[styles.topUpButtonText, { color: colors.primary }]}>Top Up</Text>
                    <Feather name="plus" size={16} color={colors.primary} style={{ marginLeft: 6 }} />
                  </Pressable>
                </View>
              </BlurView>
            </Animated.View>

            {/* Search Bar */}
            <Animated.View
              style={[styles.searchContainer, { backgroundColor: colors.card }]}
              entering={FadeInDown.delay(150).springify()}
            >
              <View style={styles.searchInputWrapper}>
                <Feather name="search" size={16} color="#555" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search transactions..."
                  placeholderTextColor="#555"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  onSubmitEditing={Keyboard.dismiss}
                />
                {searchQuery.length > 0 && (
                  <Pressable 
                    onPress={() => setSearchQuery('')}
                    style={styles.clearButton}
                  >
                    <Feather name="x" size={16} color="#555" />
                  </Pressable>
                )}
              </View>
            </Animated.View>

            {/* Wallet Info */}
            <Animated.View 
              style={[styles.walletInfoContainer, { backgroundColor: colors.card }]}
              entering={FadeInDown.delay(200).springify()}
            >
              <View style={styles.walletInfoHeader}>
                <Text style={[styles.walletInfoTitle, { color: colors.text }]}>About Your Wallet</Text>
              </View>
              <View style={styles.walletInfoContent}>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="wallet" size={18} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Your Storda Balance
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Feather name="shield" size={18} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Secure Transaction Processing
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Transactions */}
            <Animated.View
              style={[styles.transactionsContainer, { backgroundColor: colors.card }]}
              entering={FadeInDown.delay(300).springify()}
            >
              <View style={styles.transactionsHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Transactions</Text>
                <Pressable
                  style={styles.viewAllButton}
                  onPress={() => setShowAll(!showAll)}
                >
                  <Text style={[styles.viewAllText, { color: colors.primary }]}>
                    {showAll ? 'Show Less' : 'See All'}
                  </Text>
                </Pressable>
              </View>
              
              {displayedTransactions.length > 0 ? (
                <View style={styles.transactionsList}>
                  {displayedTransactions.map(renderTransactionItem)}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Feather name="inbox" size={40} color="#ccc" />
                  <Text style={styles.emptyStateText}>No transactions found</Text>
                </View>
              )}
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  screenTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  blurContainer: {
    overflow: 'hidden',
    backgroundColor: '#5A71E4',
  },
  balanceContainer: {
    padding: 24,
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  topUpButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
  searchContainer: {
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
  },
  clearButton: {
    padding: 4,
  },
  walletInfoContainer: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  walletInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  walletInfoTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#5A71E4',
  },
  walletInfoContent: {
    padding: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 0,
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
  transactionBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
  transactionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 2,
  },
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#555',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#555',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
    marginTop: 12,
  },
});