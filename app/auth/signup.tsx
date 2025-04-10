import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Link, router } from 'expo-router';
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, CreditCard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nin, setNin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const ninRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleSignup = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !nin.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (nin.length !== 11) {
      setError('NIN must be 11 digits');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Store NIN with user info
    const userInfo = {
      fullName,
      email,
      phone,
      nin, // Store NIN with user account for binding devices
    };
    
    // Here you would typically make an API call to register
    // For now, we'll just navigate to the main app
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={['#A6C8FF33', '#D6B4FC33']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}>
            <View style={styles.header}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2264&auto=format&fit=crop' }}
                style={styles.headerImage}
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Storda to protect your devices</Text>
            </View>

            <View style={styles.form}>
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <User size={20} color="#555" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#555"
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      setError(null);
                    }}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Mail size={20} color="#555" style={styles.inputIcon} />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#555"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Phone size={20} color="#555" style={styles.inputIcon} />
                  <TextInput
                    ref={phoneRef}
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#555"
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text);
                      setError(null);
                    }}
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => ninRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <CreditCard size={20} color="#555" style={styles.inputIcon} />
                  <TextInput
                    ref={ninRef}
                    style={styles.input}
                    placeholder="National ID Number (NIN)"
                    placeholderTextColor="#555"
                    value={nin}
                    onChangeText={(text) => {
                      setNin(text.replace(/[^0-9]/g, ''));
                      setError(null);
                    }}
                    keyboardType="numeric"
                    maxLength={11}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color="#555" style={styles.inputIcon} />
                  <TextInput
                    ref={passwordRef}
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#555"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError(null);
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                    {showPassword ? (
                      <EyeOff size={20} color="#555" />
                    ) : (
                      <Eye size={20} color="#555" />
                    )}
                  </Pressable>
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color="#555" style={styles.inputIcon} />
                  <TextInput
                    ref={confirmPasswordRef}
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#555"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError(null);
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleSignup}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#555" />
                    ) : (
                      <Eye size={20} color="#555" />
                    )}
                  </Pressable>
                </View>
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}>
                  Your NIN is required to bind all registered devices to your identity for enhanced security.
                </Text>
              </View>

              <AnimatedPressable style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupButtonText}>Create Account</Text>
                <ArrowRight size={20} color="#FFF" />
              </AnimatedPressable>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Link href="/auth/login" asChild>
                  <Pressable>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF3E7',
  },
  content: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#121826',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
  },
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#121826',
  },
  eyeIcon: {
    padding: 8,
  },
  infoTextContainer: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#5A71E4',
    lineHeight: 18,
    textAlign: 'center',
  },
  signupButton: {
    height: 56,
    backgroundColor: '#5A71E4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signupButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#5A71E4',
  },
});