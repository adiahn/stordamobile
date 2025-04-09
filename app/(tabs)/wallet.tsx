import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

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
    description: 'Device Transfer Fee',
    date: 'May 15, 2023',
  },
  {
    id: 3,
    type: 'debit',
    amount: '₦100.00',
    description: 'Device Transfer Fee',
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
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const transactions = showAll ? TRANSACTIONS : TRANSACTIONS.slice(0, 3);

  const handleTopUp = () => {
    Alert.alert(
      "Add Funds",
      "Choose an amount to add to your wallet",
      [
        {
          text: "₦100",
          onPress: () => Alert.alert("Success", "₦100 added to your wallet")
        },
        {
          text: "₦500",
          onPress: () => Alert.alert("Success", "₦500 added to your wallet")
        },
        {
          text: "₦1000",
          onPress: () => Alert.alert("Success", "₦1000 added to your wallet")
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const renderContent = () => (
    <>
      <AnimatedLinearGradient
        colors={['#5A71E4', '#8C3BFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>₦230.00</Text>
            <AnimatedPressable 
              style={styles.balanceActionButton}
              onPress={handleTopUp}
            >
              <Feather name="plus" size={16} color="#FFF" />
              <Text style={styles.actionButtonText}>Top Up</Text>
            </AnimatedPressable>
          </View>
        </View>
      </AnimatedLinearGradient>

      <Animated.View 
        style={styles.walletInfoContainer}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <Text style={styles.walletInfoTitle}>About Transfer Fees</Text>
        <Text style={styles.walletInfoText}>
          Device registration is free. Transfer fees of ₦100 apply when sending a device to another user.
          These fees are automatically withdrawn from your wallet balance.
        </Text>
      </Animated.View>

      <Animated.View 
        style={styles.transactionsContainer}
        entering={FadeInUp.duration(500).delay(500)}
      >
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
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
              onPress={() => Alert.alert("Transaction Details", `${transaction.description}\nAmount: ${transaction.amount}\nDate: ${transaction.date}`)}
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
    </>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Text style={styles.headerTitle}>Wallet</Text>
      </Animated.View>

      {showAll ? (
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          {renderContent()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingTop: 50,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#222D3A',
  },
  balanceCard: {
    borderRadius: 16,
    marginBottom: 16,
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
    padding: 16,
  },
  balanceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  balanceActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  walletInfoContainer: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  walletInfoTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#5A71E4',
    marginBottom: 4,
  },
  walletInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#222D3A',
    lineHeight: 18,
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