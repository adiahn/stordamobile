import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function SecurityScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);

  const handleChangePassword = () => {
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters');
      return;
    }
    
    // Success - in a real app this would call an API
    Alert.alert('Success', 'Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleToggleTwoFactor = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    
    if (newValue) {
      Alert.alert(
        'Two-Factor Authentication', 
        'Two-factor authentication has been enabled. You will receive a verification code via SMS when logging in.'
      );
    }
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
        <Text style={styles.title}>Security</Text>
      </View>

      <Animated.View 
        style={styles.section}
        entering={FadeInUp.duration(500)}
      >
        <Text style={styles.sectionTitle}>Change Password</Text>
        
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#8494A9"
                secureTextEntry={!showCurrentPassword}
              />
              <Pressable 
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeIcon}
              >
                <Feather 
                  name={showCurrentPassword ? "eye-off" : "eye"} 
                  size={16} 
                  color="#8494A9" 
                />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#8494A9"
                secureTextEntry={!showNewPassword}
              />
              <Pressable 
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                <Feather 
                  name={showNewPassword ? "eye-off" : "eye"} 
                  size={16} 
                  color="#8494A9" 
                />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#8494A9"
                secureTextEntry={!showConfirmPassword}
              />
              <Pressable 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Feather 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={16} 
                  color="#8494A9" 
                />
              </Pressable>
            </View>
          </View>
          
          <Pressable 
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.section}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Text style={styles.sectionTitle}>Authentication</Text>
        
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="shield" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>Receive a verification code via SMS</Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={handleToggleTwoFactor}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={twoFactorEnabled ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="unlock" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>Use fingerprint or face recognition</Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={biometricsEnabled ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Feather name="mail" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Security Notifications</Text>
                <Text style={styles.settingDescription}>Receive email alerts for login attempts</Text>
              </View>
            </View>
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
              trackColor={{ false: '#E9ECF2', true: 'rgba(90, 113, 228, 0.5)' }}
              thumbColor={emailNotificationsEnabled ? '#5A71E4' : '#F4F3F4'}
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.section}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <Text style={styles.sectionTitle}>Login Sessions</Text>
        
        <View style={styles.card}>
          <View style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <View style={styles.deviceIconContainer}>
                <Feather name="smartphone" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.deviceName}>iPhone 13 Pro</Text>
                <Text style={styles.sessionDetails}>New York, USA • Active now</Text>
              </View>
            </View>
            <Text style={styles.currentDevice}>Current</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <View style={styles.deviceIconContainer}>
                <Feather name="monitor" size={16} color="#5A71E4" />
              </View>
              <View>
                <Text style={styles.deviceName}>MacBook Pro</Text>
                <Text style={styles.sessionDetails}>New York, USA • 2 days ago</Text>
              </View>
            </View>
            <Pressable>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
    marginBottom: 6,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(132, 148, 169, 0.2)',
    borderRadius: 12,
    backgroundColor: '#F8F9FB',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#222D3A',
  },
  eyeIcon: {
    padding: 10,
  },
  changePasswordButton: {
    height: 44,
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
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
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 2,
  },
  sessionDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  currentDevice: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#30B050',
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#5A71E4',
  },
}); 