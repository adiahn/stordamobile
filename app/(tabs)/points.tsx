import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { usePointsStore } from '../../store/points';
import { Coins, Plus, CreditCard, Clock, ArrowRight } from 'lucide-react-native';

export default function PointsScreen() {
  const { isDark } = useThemeStore();
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
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.balanceCard, isDark && styles.darkCard]}>
          <View style={styles.balanceHeader}>
            <Coins size={24} color={isDark ? '#38bdf8' : '#0891b2'} />
            <Text style={[styles.balanceTitle, isDark && styles.darkText]}>Your Points</Text>
          </View>
          <Text style={[styles.balanceAmount, isDark && styles.darkText]}>{points}</Text>
          <Text style={[styles.balanceSubtext, isDark && styles.darkSubText]}>
            Use points to add or transfer devices
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Buy Points</Text>
          
          <View style={styles.pointsPackages}>
            <Pressable 
              style={[styles.packageCard, isDark && styles.darkCard]}
              onPress={() => handlePurchase(500, '$4.99')}
              disabled={isLoading}
            >
              <View style={styles.packageHeader}>
                <Text style={[styles.packagePoints, isDark && styles.darkText]}>500</Text>
                <Coins size={16} color={isDark ? '#38bdf8' : '#0891b2'} />
              </View>
              <Text style={[styles.packagePrice, isDark && styles.darkText]}>$4.99</Text>
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
              style={[styles.packageCard, isDark && styles.darkCard]}
              onPress={() => handlePurchase(1000, '$8.99')}
              disabled={isLoading}
            >
              <View style={styles.packageHeader}>
                <Text style={[styles.packagePoints, isDark && styles.darkText]}>1000</Text>
                <Coins size={16} color={isDark ? '#38bdf8' : '#0891b2'} />
              </View>
              <Text style={[styles.packagePrice, isDark && styles.darkText]}>$8.99</Text>
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
              style={[styles.packageCard, isDark && styles.darkCard]}
              onPress={() => handlePurchase(2500, '$19.99')}
              disabled={isLoading}
            >
              <View style={styles.packageHeader}>
                <Text style={[styles.packagePoints, isDark && styles.darkText]}>2500</Text>
                <Coins size={16} color={isDark ? '#38bdf8' : '#0891b2'} />
              </View>
              <Text style={[styles.packagePrice, isDark && styles.darkText]}>$19.99</Text>
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
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Points Usage</Text>
          
          <View style={[styles.usageCard, isDark && styles.darkCard]}>
            <View style={styles.usageItem}>
              <Plus size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              <Text style={[styles.usageText, isDark && styles.darkText]}>
                Adding a device
              </Text>
              <Text style={[styles.usageCost, isDark && styles.darkText]}>
                100 points
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.usageItem}>
              <ArrowRight size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              <Text style={[styles.usageText, isDark && styles.darkText]}>
                Transferring a device
              </Text>
              <Text style={[styles.usageCost, isDark && styles.darkText]}>
                100 points
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Transaction History</Text>
          
          <View style={[styles.historyCard, isDark && styles.darkCard]}>
            <View style={styles.historyItem}>
              <View style={styles.historyIconContainer}>
                <CreditCard size={16} color={isDark ? '#38bdf8' : '#0891b2'} />
              </View>
              <View style={styles.historyDetails}>
                <Text style={[styles.historyTitle, isDark && styles.darkText]}>
                  Purchased Points
                </Text>
                <Text style={[styles.historyDate, isDark && styles.darkSubText]}>
                  Today, 10:30 AM
                </Text>
              </View>
              <Text style={[styles.historyAmount, isDark && styles.darkText]}>
                +500 points
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.historyItem}>
              <View style={styles.historyIconContainer}>
                <Plus size={16} color={isDark ? '#94a3b8' : '#64748b'} />
              </View>
              <View style={styles.historyDetails}>
                <Text style={[styles.historyTitle, isDark && styles.darkText]}>
                  Added Device
                </Text>
                <Text style={[styles.historyDate, isDark && styles.darkSubText]}>
                  Yesterday, 3:45 PM
                </Text>
              </View>
              <Text style={[styles.historyAmountNegative, isDark && styles.darkText]}>
                -100 points
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.historyItem}>
              <View style={styles.historyIconContainer}>
                <ArrowRight size={16} color={isDark ? '#94a3b8' : '#64748b'} />
              </View>
              <View style={styles.historyDetails}>
                <Text style={[styles.historyTitle, isDark && styles.darkText]}>
                  Transferred Device
                </Text>
                <Text style={[styles.historyDate, isDark && styles.darkSubText]}>
                  Jan 15, 2024
                </Text>
              </View>
              <Text style={[styles.historyAmountNegative, isDark && styles.darkText]}>
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
  darkContainer: {
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1e293b',
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
    color: '#0f172a',
  },
  darkText: {
    color: '#f8fafc',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  darkSubText: {
    color: '#94a3b8',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  pointsPackages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  packageCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  packagePoints: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#0891b2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    color: '#ffffff',
    fontSize: 10,
  },
  buyButton: {
    backgroundColor: '#0891b2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  usageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  usageText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  usageCost: {
    fontSize: 14,
    color: '#64748b',
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDetails: {
    flex: 1,
    marginHorizontal: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  historyDate: {
    fontSize: 14,
    color: '#64748b',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0891b2',
  },
  historyAmountNegative: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
}); 