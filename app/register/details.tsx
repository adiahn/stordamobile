import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const COLORS = ['Midnight Black', 'Sierra Blue', 'Gold', 'Silver', 'Graphite'];

export default function DeviceDetailsPage() {
  const params = useLocalSearchParams();
  
  const [model, setModel] = useState(params.detectedName as string || '');
  const [storage, setStorage] = useState(params.detectedStorage as string || '');
  const [color, setColor] = useState(params.detectedColor as string || '');
  const [hasReceipt, setHasReceipt] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isPreFilled, setIsPreFilled] = useState(false);

  useEffect(() => {
    // Check if we have detected information
    if (params.detectedName || params.detectedStorage || params.detectedColor) {
      setIsPreFilled(true);
    }
  }, [params]);

  const handleContinue = () => {
    router.push({
      pathname: '/register/payment',
      params: {
        imei: params.imei,
        macAddress: params.macAddress,
        brand: params.brand,
        model,
        storage,
        color,
        hasReceipt: hasReceipt ? 'true' : 'false',
        hasPhoto: hasPhoto ? 'true' : 'false'
      }
    });
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
          <Feather name="arrow-left" size={22} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Device Details</Text>
        <Text style={styles.subtitle}>Tell us more about your device</Text>
      </View>

      {isPreFilled && (
        <Animated.View 
          style={styles.detectedInfo}
          entering={FadeInUp.duration(500).delay(200)}
        >
          <View style={styles.detectedHeader}>
            <Feather name="check-circle" size={20} color="#30B050" />
            <Text style={styles.detectedHeaderText}>Device Information Detected</Text>
          </View>
          <Text style={styles.detectedSubtext}>
            We've automatically filled in your device information. Please verify or modify as needed.
          </Text>
        </Animated.View>
      )}

      <Animated.View 
        style={styles.formContainer}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Model Name</Text>
            {isPreFilled && <Text style={styles.autoFilled}>Auto-detected</Text>}
          </View>
          <TextInput
            style={[styles.input, isPreFilled && styles.inputDetected]}
            value={model}
            onChangeText={setModel}
            placeholder="e.g., iPhone 13 Pro, Galaxy S21"
            placeholderTextColor="#8494A9"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Storage Capacity</Text>
            {isPreFilled && storage && <Text style={styles.autoFilled}>Auto-detected</Text>}
          </View>
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
          <View style={styles.labelRow}>
            <Text style={styles.label}>Device Color</Text>
            {isPreFilled && color && <Text style={styles.autoFilled}>Auto-detected</Text>}
          </View>
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
                <Feather name="file-text" size={22} color={hasReceipt ? "#FFF" : "#5A71E4"} />
              </View>
              <Text style={styles.uploadTitle}>Purchase Receipt</Text>
              <Text style={styles.uploadSubtitle}>PDF or Image</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={[styles.uploadCard, hasPhoto && styles.uploadCardActive]}
              onPress={() => setHasPhoto(!hasPhoto)}>
              <View style={[styles.uploadIcon, hasPhoto && styles.uploadIconActive]}>
                <Feather name="camera" size={22} color={hasPhoto ? "#FFF" : "#5A71E4"} />
              </View>
              <Text style={styles.uploadTitle}>Device Photo</Text>
              <Text style={styles.uploadSubtitle}>Take or upload photo</Text>
            </AnimatedPressable>
          </View>
        </View>

        <AnimatedPressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </AnimatedPressable>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#222D3A',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8494A9',
    marginTop: 4,
  },
  detectedInfo: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detectedHeaderText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#30B050',
    marginLeft: 8,
  },
  detectedSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
    lineHeight: 20,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
  },
  autoFilled: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#30B050',
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  input: {
    height: 52,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#222D3A',
  },
  inputDetected: {
    borderWidth: 1,
    borderColor: '#5A71E4',
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
  },
  chipList: {
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#5A71E4',
  },
  chipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  chipTextSelected: {
    color: '#FFF',
  },
  uploadSection: {
    gap: 16,
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
    backgroundColor: 'rgba(90, 113, 228, 0.05)',
    borderWidth: 1,
    borderColor: '#5A71E4',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconActive: {
    backgroundColor: '#5A71E4',
  },
  uploadTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  uploadSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#5A71E4',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});