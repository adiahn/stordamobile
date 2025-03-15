import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useThemeStore } from '../../store/theme';
import { Mail, Lock, User, Building, UserPlus } from 'lucide-react-native';

export default function SignupScreen() {
  const { isDark } = useThemeStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would register with your backend
      // For demo purposes, we'll simulate a successful registration
      setTimeout(() => {
        // Store user session
        // Navigate to main app
        router.replace('/(tabs)');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, isDark && styles.darkContainer]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>Create Account</Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubText]}>
          Sign up to start securing your devices
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <User size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          </View>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Mail size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          </View>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Lock size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          </View>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Lock size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          </View>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            secureTextEntry
          />
        </View>

        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Account Type</Text>
        
        <View style={styles.accountTypeContainer}>
          <Pressable
            style={[
              styles.accountTypeOption,
              accountType === 'personal' && styles.accountTypeSelected,
              isDark && styles.darkAccountTypeOption,
              accountType === 'personal' && isDark && styles.darkAccountTypeSelected
            ]}
            onPress={() => setAccountType('personal')}
          >
            <User size={24} color={accountType === 'personal' ? '#0891b2' : isDark ? '#94a3b8' : '#64748b'} />
            <Text 
              style={[
                styles.accountTypeText,
                accountType === 'personal' && styles.accountTypeTextSelected,
                isDark && styles.darkText
              ]}
            >
              Personal
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.accountTypeOption,
              accountType === 'business' && styles.accountTypeSelected,
              isDark && styles.darkAccountTypeOption,
              accountType === 'business' && isDark && styles.darkAccountTypeSelected
            ]}
            onPress={() => setAccountType('business')}
          >
            <Building size={24} color={accountType === 'business' ? '#0891b2' : isDark ? '#94a3b8' : '#64748b'} />
            <Text 
              style={[
                styles.accountTypeText,
                accountType === 'business' && styles.accountTypeTextSelected,
                isDark && styles.darkText
              ]}
            >
              Business
            </Text>
          </Pressable>
        </View>

        {accountType === 'business' && (
          <Text style={[styles.businessNote, isDark && styles.darkSubText]}>
            Business accounts have additional features for managing multiple devices and transactions.
          </Text>
        )}

        <Pressable
          style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}>
          <UserPlus size={20} color="#ffffff" />
          <Text style={styles.signupButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, isDark && styles.darkSubText]}>
          Already have an account?
        </Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={[styles.loginLink, isDark && styles.darkAccentText]}>Sign In</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  darkText: {
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  darkSubText: {
    color: '#94a3b8',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  darkInput: {
    color: '#f8fafc',
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 8,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  accountTypeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  darkAccountTypeOption: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  accountTypeSelected: {
    borderColor: '#0891b2',
    backgroundColor: 'rgba(8, 145, 178, 0.1)',
  },
  darkAccountTypeSelected: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  accountTypeText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  accountTypeTextSelected: {
    color: '#0891b2',
    fontWeight: '600',
  },
  businessNote: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  signupButton: {
    backgroundColor: '#0891b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  signupButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891b2',
  },
  darkAccentText: {
    color: '#38bdf8',
  },
}); 