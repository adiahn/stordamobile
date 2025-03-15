import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useThemeStore } from '../../store/theme';
import { Mail, Lock, LogIn } from 'lucide-react-native';

export default function LoginScreen() {
  const { isDark } = useThemeStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would authenticate with your backend
      // For demo purposes, we'll simulate a successful login
      setTimeout(() => {
        // Store user session
        // Navigate to main app
        router.replace('/(tabs)');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to log in');
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>Welcome Back</Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubText]}>
          Sign in to continue managing your devices
        </Text>
      </View>

      <View style={styles.form}>
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

        <Pressable
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}>
          <LogIn size={20} color="#ffffff" />
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        <Link href="/auth/forgot-password" asChild>
          <Pressable>
            <Text style={[styles.forgotPassword, isDark && styles.darkAccentText]}>
              Forgot Password?
            </Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, isDark && styles.darkSubText]}>
          Don't have an account?
        </Text>
        <Link href="/auth/signup" asChild>
          <Pressable>
            <Text style={[styles.signupLink, isDark && styles.darkAccentText]}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
  },
  darkContainer: {
    backgroundColor: '#0f172a',
  },
  header: {
    marginBottom: 40,
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
    gap: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
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
  darkInput: {
    color: '#f8fafc',
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  loginButton: {
    backgroundColor: '#0891b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: 16,
    color: '#0891b2',
    fontSize: 14,
  },
  darkAccentText: {
    color: '#38bdf8',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891b2',
  },
}); 