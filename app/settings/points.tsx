import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Coins, CreditCard, Clock } from 'lucide-react-native';
import { usePointsStore } from '../../store/points';

export default function PointsScreen() {
  const router = useRouter();
  const { points, addPoints } = usePointsStore();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = (amount: number, cost: string) => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      addPoints(amount);
      Alert.alert('Success', `You've added ${amount} points to your account!`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#334155" />
        </Pressable>
        <Text style={styles.headerTitle}>Points Management</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Coins size={24} color="#6366f1" />
            <Text style={styles.balanceTitle}>Your Points</Text>
          </View>
          <Text style={styles.balanceAmount}>{points}</Text>
          <Text style={styles.balanceSubtext}>
            Use points to add or transfer devices
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buy Points</Text>
          
          <View style={styles.pointsPackages}>
            <Pressable 
              style={styles.packageCard}
              onPress={() => handlePurchase(500, '$4.99')}
              disabled={isLoading}
            >
              <View style={styles.packageHeader}>
                <Text style={styles.packagePoints}>500</Text>
                <Coins size={16} color="#6366f1" />
              </View>
              <Text style={styles.packagePrice}>$4.99</Text>
              <Pressable 
                style={[styles.buyButton, isLoading && styles.buyButtonDisabled]}
                onPress={() => handlePurchase(500, '$4.99')}
                disabled={isLoading}
              >
                <Text style={styles.buyButtonText}>
                  {isLoading ? 'Processing...' : 'Buy'}
                </Text>
              </Pressable>
            </Pressable>

            <Pressable 
              style={styles.packageCard}
              onPress={() => handlePurchase(1000, '$8.99')}
              disabled={isLoading}
            >
              <View style={styles.packageHeader}>
                <Text style={styles.packagePoints}>1000</Text>
                <Coins size={16} color="#6366f1" />
              </View>
              <Text style={styles.packagePrice}>$8.99</Text>
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>Best Value</Text>
              </View>
              <Pressable 
                style={[styles.buyButton, isLoading && styles.buyButtonDisabled]}
                onPress={() => handlePurchase(1000, '$8.99')}
                disabled={isLoading}
              >
                <Text style={styles.buyButtonText}>
                  {isLoading ? 'Processing...' : 'Buy'}
                </Text>
              </Pressable>
            </Pressable>

            <Pressable 
              style={styles.packageCard}
              onPress={() => handlePurchase(2500, '$19.99')}
              disabled={isLoading}
            >
              <View style={styles.packageHeader}>
                <Text style={styles.packagePoints}>2500</Text>
                <Coins size={16} color="#6366f1" />
              </View>
              <Text style={styles.packagePrice}>$19.99</Text>
              <Pressable 
                style={[styles.buyButton, isLoading && styles.buyButtonDisabled]}
                onPress={() => handlePurchase(2500, '$19.99')}
                disabled={isLoading}
              >
                <Text style={styles.buyButtonText}>
                  {isLoading ? 'Processing...' : 'Buy'}
                </Text>
              </Pressable>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points Usage</Text>
          
          <View style={styles.usageCard}>
            <View style={styles.usageItem}>
              <Text style={styles.usageText}>
                Adding a device
              </Text>
              <Text style={styles.usageCost}>
                100 points
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.usageItem}>
              <Text style={styles.usageText}>
                Transferring a device
              </Text>
              <Text style={styles.usageCost}>
                100 points
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          
          <View style={styles.historyCard}>
            <View style={styles.historyItem}>
              <View style={styles.historyIconContainer}>
                <CreditCard size={16} color="#6366f1" />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>
                  Purchased Points
                </Text>
                <Text style={styles.historyDate}>
                  Today, 10:30 AM
                </Text>
              </View>
              <Text style={styles.historyAmount}>
                +500 points
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.historyItem}>
              <View style={styles.historyIconContainer}>
                <Smartphone size={16} color="#64748b" />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>
                  Added Device
                </Text>
                <Text style={styles.historyDate}>
                  Yesterday, 3:45 PM
                </Text>
              </View>
              <Text style={styles.historyAmountNegative}>
                -100 points
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#334155',
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 16,
    marginBottom: 8,
  },
  pointsPackages: {
    flexDirection: 'row',
    gap: 12,
  },
  packageCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  packagePoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  packagePrice: {
    fontSize: 14,
    color: '#64748b',
  },
  buyButton: {
    backgroundColor: '#6366f1',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  bestValueBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestValueText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500',
  },
  usageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  usageText: {
    fontSize: 16,
    color: '#334155',
  },
  usageCost: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  historyIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  historyDate: {
    fontSize: 14,
    color: '#64748b',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  historyAmountNegative: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f43f5e',
  },
}); 