import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Shield, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SuccessPage() {
  const handleContinue = () => {
    router.push('/devices');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#A6C8FF33', '#D6B4FC33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}>
        <View style={styles.iconContainer}>
          <Shield size={48} color="#A6C8FF" />
        </View>
        
        <Text style={styles.title}>Registration Complete!</Text>
        <Text style={styles.subtitle}>Your device is now protected with Storda</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Storda ID</Text>
          <Text style={styles.infoValue}>STORDA-1002938</Text>
        </View>

        <AnimatedPressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>View My Devices</Text>
          <ArrowRight size={20} color="#FFF" />
        </AnimatedPressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF3E7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#FFF',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#121826',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#121826',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#A6C8FF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});