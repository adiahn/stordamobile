import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

const FAQ_ITEMS = [
  {
    question: "How do I register a new device?",
    answer: "To register a new device, go to the Home screen and tap on 'Add Device'. Follow the on-screen instructions to enter your device information or use the auto-detect feature."
  },
  {
    question: "How does device protection work?",
    answer: "Storda protection provides coverage for theft, damage, and loss. Once your device is registered, you'll receive alerts if unusual activity is detected and can report it as lost or stolen immediately."
  },
  {
    question: "Can I transfer my device to someone else?",
    answer: "Yes, you can transfer ownership of your device. Go to the device details page, tap on 'Transfer', and follow the instructions to transfer ownership to another Storda user."
  },
  {
    question: "How do I update my payment information?",
    answer: "You can update your payment information by going to the Wallet tab, selecting 'Payment Methods', and tapping on 'Add' or editing an existing payment method."
  },
];

export default function HelpScreen() {
  const handleContactSupport = () => {
    Alert.alert("Contact Support", "Would you like to contact our support team?", [
      {
        text: "Email",
        onPress: () => Linking.openURL('mailto:support@storda.com')
      },
      {
        text: "Call",
        onPress: () => Linking.openURL('tel:+18005551234')
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ]);
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
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <Animated.View 
        style={styles.supportOptions}
        entering={FadeInUp.duration(500)}
      >
        <Text style={styles.sectionTitle}>Get Help</Text>
        
        <View style={styles.optionsContainer}>
          <Pressable 
            style={styles.supportOption}
            onPress={handleContactSupport}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(90, 113, 228, 0.1)' }]}>
              <Feather name="message-circle" size={20} color="#5A71E4" />
            </View>
            <Text style={styles.optionText}>Contact Support</Text>
          </Pressable>
          
          <Pressable 
            style={styles.supportOption}
            onPress={() => Linking.openURL('https://storda.com/help')}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(48, 176, 80, 0.1)' }]}>
              <Feather name="book" size={20} color="#30B050" />
            </View>
            <Text style={styles.optionText}>Help Center</Text>
          </Pressable>
          
          <Pressable 
            style={styles.supportOption}
            onPress={() => Alert.alert("Live Chat", "Live chat support will be available in the next update.")}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 154, 0, 0.1)' }]}>
              <Feather name="message-square" size={20} color="#FF9A00" />
            </View>
            <Text style={styles.optionText}>Live Chat</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.faqSection}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {FAQ_ITEMS.map((item, index) => (
          <Animated.View 
            key={index} 
            style={styles.faqItem}
            entering={FadeInUp.duration(300).delay(200 + index * 100)}
          >
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View 
        style={styles.supportInfo}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <Text style={styles.supportInfoTitle}>Support Hours</Text>
        <Text style={styles.supportInfoText}>Monday - Friday: 9AM - 6PM EST</Text>
        <Text style={styles.supportInfoText}>Saturday: 10AM - 4PM EST</Text>
        <Text style={styles.supportInfoText}>Sunday: Closed</Text>
        
        <Text style={[styles.supportInfoTitle, { marginTop: 16 }]}>Contact Information</Text>
        <Text style={styles.supportInfoText}>Email: support@storda.com</Text>
        <Text style={styles.supportInfoText}>Phone: +1 800 555 1234</Text>
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
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  supportOptions: {
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supportOption: {
    width: '31%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  question: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 8,
  },
  answer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
    lineHeight: 18,
  },
  supportInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  supportInfoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 8,
  },
  supportInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
    marginBottom: 4,
  },
}); 