import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Camera, Upload, ArrowRight } from 'lucide-react-native';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const COLORS = ['Midnight Black', 'Sierra Blue', 'Gold', 'Silver', 'Graphite'];

export default function DeviceDetailsPage() {
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('');
  const [color, setColor] = useState('');
  const [hasReceipt, setHasReceipt] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);

  const handleContinue = () => {
    router.push('/register/payment');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Device Details</Text>
        <Text style={styles.subtitle}>Tell us more about your device</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model Name</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="e.g., iPhone 13 Pro, Galaxy S21"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Storage Capacity</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}>
            {STORAGE_OPTIONS.map((option) => (
              <AnimatedPressable
                key={option}
                style={[
                  styles.chip,
                  storage === option && styles.chipSelected,
                ]}
                onPress={() => setStorage(option)}>
                <Text
                  style={[
                    styles.chipText,
                    storage === option && styles.chipTextSelected,
                  ]}>
                  {option}
                </Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Device Color</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}>
            {COLORS.map((option) => (
              <AnimatedPressable
                key={option}
                style={[
                  styles.chip,
                  color === option && styles.chipSelected,
                ]}
                onPress={() => setColor(option)}>
                <Text
                  style={[
                    styles.chipText,
                    color === option && styles.chipTextSelected,
                  ]}>
                  {option}
                </Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.uploadSection}>
          <Text style={styles.label}>Additional Documents</Text>
          
          <View style={styles.uploadCards}>
            <AnimatedPressable
              style={[styles.uploadCard, hasReceipt && styles.uploadCardActive]}
              onPress={() => setHasReceipt(!hasReceipt)}>
              <View style={[styles.uploadIcon, hasReceipt && styles.uploadIconActive]}>
                <Upload size={24} color={hasReceipt ? '#FFF' : '#A6C8FF'} />
              </View>
              <Text style={styles.uploadTitle}>Purchase Receipt</Text>
              <Text style={styles.uploadSubtitle}>PDF or Image</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={[styles.uploadCard, hasPhoto && styles.uploadCardActive]}
              onPress={() => setHasPhoto(!hasPhoto)}>
              <View style={[styles.uploadIcon, hasPhoto && styles.uploadIconActive]}>
                <Camera size={24} color={hasPhoto ? '#FFF' : '#A6C8FF'} />
              </View>
              <Text style={styles.uploadTitle}>Device Photo</Text>
              <Text style={styles.uploadSubtitle}>Take or upload photo</Text>
            </AnimatedPressable>
          </View>
        </View>

        <AnimatedPressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
          <ArrowRight size={20} color="#FFF" />
        </AnimatedPressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF3E7',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#121826',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#121826',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#121826',
  },
  chipList: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#A6C8FF',
  },
  chipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  chipTextSelected: {
    color: '#FFF',
  },
  uploadSection: {
    gap: 12,
  },
  uploadCards: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  uploadCardActive: {
    backgroundColor: '#A6C8FF15',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#A6C8FF15',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconActive: {
    backgroundColor: '#A6C8FF',
  },
  uploadTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#121826',
  },
  uploadSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#A6C8FF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});