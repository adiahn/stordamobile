import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
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

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate Google authentication
    setTimeout(() => {
      router.replace('/(tabs)');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Storda</Text>
        <Text style={styles.subtitle}>
          Secure your devices with confidence
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Feather name="mail" size={20} color="#94a3b8" />
          </View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Feather name="lock" size={20} color="#94a3b8" />
          </View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry
          />
        </View>

        <Pressable
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}>
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <Pressable
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isLoading}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>
            Continue with Google
          </Text>
        </Pressable>

        <Link href="/auth/forgot-password" asChild>
          <Pressable>
            <Text style={styles.forgotPassword}>
              Forgot Password?
            </Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?
        </Text>
        <Link href="/auth/signup" asChild>
          <Pressable>
            <Text style={styles.signupLink}>Sign Up</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
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
    color: '#334155',
  },
  loginButton: {
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#94a3b8',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: 16,
    color: '#6366f1',
    fontSize: 14,
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
    color: '#6366f1',
  },
}); 