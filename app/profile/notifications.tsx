import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  
  const [deviceAlerts, setDeviceAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [promotionalAlerts, setPromotionalAlerts] = useState(false);
  
  const handleSavePreferences = () => {
    // In a real app, this would call an API
    Alert.alert('Success', 'Notification preferences updated successfully');
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={18} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <Animated.View 
        style={styles.section}
        entering={FadeInUp.duration(500)}
      >
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="bell" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive alerts on your device</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={pushEnabled ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="mail" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive alerts via email</Text>
              </View>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={emailEnabled ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="message-circle" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>SMS Notifications</Text>
                <Text style={styles.settingDescription}>Receive alerts via text message</Text>
              </View>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={smsEnabled ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.section}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Text style={styles.sectionTitle}>Notification Types</Text>
        
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="smartphone" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Device Alerts</Text>
                <Text style={styles.settingDescription}>Device registration, status updates</Text>
              </View>
            </View>
            <Switch
              value={deviceAlerts}
              onValueChange={setDeviceAlerts}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={deviceAlerts ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="shield" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Security Alerts</Text>
                <Text style={styles.settingDescription}>Login attempts, profile changes</Text>
              </View>
            </View>
            <Switch
              value={securityAlerts}
              onValueChange={setSecurityAlerts}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={securityAlerts ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="credit-card" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Payment Alerts</Text>
                <Text style={styles.settingDescription}>Subscription updates, billing info</Text>
              </View>
            </View>
            <Switch
              value={paymentAlerts}
              onValueChange={setPaymentAlerts}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={paymentAlerts ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="tag" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Promotional Alerts</Text>
                <Text style={styles.settingDescription}>New features, special offers</Text>
              </View>
            </View>
            <Switch
              value={promotionalAlerts}
              onValueChange={setPromotionalAlerts}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={promotionalAlerts ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.notificationSchedule}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <Text style={styles.sectionTitle}>Quiet Hours</Text>
        
        <View style={styles.card}>
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleTitle}>Do Not Disturb</Text>
            <Text style={styles.scheduleDescription}>
              Notifications will be silenced during your device's Do Not Disturb hours.
              Configure these settings in your device's system settings.
            </Text>
          </View>
        </View>
      </Animated.View>

      <Pressable 
        style={styles.saveButton}
        onPress={handleSavePreferences}
      >
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </Pressable>
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
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#222D3A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(132, 148, 169, 0.1)',
    marginVertical: 4,
  },
  notificationSchedule: {
    marginBottom: 24,
  },
  scheduleInfo: {
    padding: 4,
  },
  scheduleTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 8,
  },
  scheduleDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
    lineHeight: 18,
  },
  saveButton: {
    height: 48,
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
}); 