import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const [isBusinessAccount, setIsBusinessAccount] = React.useState(false);
  const points = 500; // Mock points value

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => router.replace('/auth/login')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Feather name="user" size={40} color="#6366f1" />
          </View>
          <Text style={styles.profileName}>Sarah Johnson</Text>
          <Text style={styles.profileEmail}>sarah.johnson@example.com</Text>
          <View style={styles.accountTypeBadge}>
            <Text style={styles.accountTypeText}>
              {isBusinessAccount ? 'Business Account' : 'Personal Account'}
            </Text>
          </View>
        </View>

        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <Feather name="dollar-sign" size={20} color="#6366f1" />
            <Text style={styles.pointsTitle}>Your Points</Text>
          </View>
          <Text style={styles.pointsAmount}>{points}</Text>
          <Pressable 
            style={styles.buyPointsButton}
            onPress={() => router.push('/settings/points')}
          >
            <Text style={styles.buyPointsText}>Buy Points</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings/profile')}>
            <Feather name="user" size={20} color="#64748b" />
            <Text style={styles.menuText}>Personal Information</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings/payment')}>
            <Feather name="credit-card" size={20} color="#64748b" />
            <Text style={styles.menuText}>Payment Methods</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings/security')}>
            <Feather name="shield" size={20} color="#64748b" />
            <Text style={styles.menuText}>Security</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {isBusinessAccount && (
            <Pressable style={styles.menuItem} onPress={() => router.push('/device/bulk-add')}>
              <Feather name="smartphone" size={20} color="#64748b" />
              <Text style={styles.menuText}>Bulk Device Management</Text>
              <Feather name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings/help')}>
            <Feather name="help-circle" size={20} color="#64748b" />
            <Text style={styles.menuText}>Help Center</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('/settings/about')}>
            <Feather name="info" size={20} color="#64748b" />
            <Text style={styles.menuText}>About Storda</Text>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#f43f5e" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
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
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  accountTypeBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  accountTypeText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '500',
  },
  pointsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  pointsAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  buyPointsButton: {
    backgroundColor: '#e0e7ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyPointsText: {
    color: '#4f46e5',
    fontWeight: '500',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#334155',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff1f2',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    marginBottom: 40,
    gap: 8,
  },
  logoutText: {
    color: '#f43f5e',
    fontSize: 16,
    fontWeight: '500',
  },
});