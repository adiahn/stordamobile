import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FAQ_ITEMS = [
  {
    question: "How do I register a new device?",
    answer: "To register a new device, go to the Home screen and tap on 'Add Device'. Follow the on-screen instructions to enter your device information or use the auto-detect feature which can scan your device details automatically."
  },
  {
    question: "How do device transfers work?",
    answer: "When you transfer a device to another user, a ₦100 fee is deducted from your wallet. The recipient will need to accept the transfer through their Storda app, and the device will be removed from your account but remain in your history with a 'Transferred' status."
  },
  {
    question: "How does device protection work?",
    answer: "Storda protection provides coverage for theft, damage, and loss. Once your device is registered, you'll receive alerts if unusual activity is detected and can report it as lost or stolen immediately."
  },
  {
    question: "What happens when I report a device as lost or stolen?",
    answer: "When you report a device as lost or stolen, its status changes in your account. You cannot transfer reported devices, but you can still view them in your device list. If the device is recovered, contact support to restore its status."
  },
  {
    question: "How do I update my payment information?",
    answer: "You can update your payment information by going to the Wallet screen and tapping on 'Top Up'. The transfer fees are automatically deducted from your wallet balance when you transfer a device."
  },
];

const QUICK_HELP_TOPICS = [
  { id: 1, title: "Device Registration", icon: "smartphone" },
  { id: 2, title: "Transfer Issues", icon: "refresh-cw" },
  { id: 3, title: "Wallet & Payments", icon: "credit-card" },
  { id: 4, title: "Account Settings", icon: "settings" },
  { id: 5, title: "App Features", icon: "grid" },
  { id: 6, title: "Lost Devices", icon: "map-pin" },
];

export default function HelpScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support", 
      "Our support team is available to help you with any issues.", 
      [
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
      ]
    );
  };
  
  const handleTopicSelect = (id: number) => {
    setSelectedTopic(id === selectedTopic ? null : id);
    
    // Show appropriate content based on selected topic
    const topicInfo = QUICK_HELP_TOPICS.find(topic => topic.id === id);
    if (topicInfo) {
      Alert.alert(
        topicInfo.title,
        `Here's quick information about ${topicInfo.title}. For more details, please refer to our FAQ section or contact support.`,
        [{ text: "OK" }]
      );
    }
  };

  const toggleFaqExpand = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={18} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={styles.heroSection}
          entering={FadeInUp.duration(500)}
        >
          <LinearGradient
            colors={['#5A71E4', '#8C3BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>How can we help you?</Text>
              <Text style={styles.heroSubtitle}>
                Find answers to common questions or contact our support team
              </Text>
              
              <Pressable 
                style={styles.contactButton}
                onPress={handleContactSupport}
              >
                <Feather name="headphones" size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Contact Support</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View 
          style={styles.quickHelpSection}
          entering={FadeInUp.duration(500).delay(100)}
        >
          <Text style={styles.sectionTitle}>Quick Help Topics</Text>
          
          <View style={styles.topicGrid}>
            {QUICK_HELP_TOPICS.map((topic) => (
              <AnimatedPressable 
                key={topic.id}
                style={[
                  styles.topicItem,
                  selectedTopic === topic.id && styles.topicItemSelected
                ]}
                onPress={() => handleTopicSelect(topic.id)}
                entering={FadeInUp.duration(300).delay(150 + topic.id * 50)}
              >
                <View style={[
                  styles.topicIcon,
                  selectedTopic === topic.id && styles.topicIconSelected
                ]}>
                  <Feather 
                    name={topic.icon as any} 
                    size={18} 
                    color={selectedTopic === topic.id ? "#FFFFFF" : "#5A71E4"} 
                  />
                </View>
                <Text style={[
                  styles.topicText,
                  selectedTopic === topic.id && styles.topicTextSelected
                ]}>
                  {topic.title}
                </Text>
              </AnimatedPressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View 
          style={styles.faqSection}
          entering={FadeInUp.duration(500).delay(200)}
        >
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {FAQ_ITEMS.map((item, index) => (
            <AnimatedPressable 
              key={index} 
              style={[
                styles.faqItem,
                expandedFaq === index && styles.faqItemExpanded
              ]}
              onPress={() => toggleFaqExpand(index)}
              entering={FadeInUp.duration(300).delay(250 + index * 50)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.question}>{item.question}</Text>
                <Feather 
                  name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#5A71E4" 
                />
              </View>
              
              {expandedFaq === index && (
                <Text style={styles.answer}>{item.answer}</Text>
              )}
            </AnimatedPressable>
          ))}
        </Animated.View>

        <Animated.View 
          style={styles.supportInfoCard}
          entering={FadeInUp.duration(500).delay(300)}
        >
          <View style={styles.supportHours}>
            <Text style={styles.supportInfoTitle}>Support Hours</Text>
            <View style={styles.hoursRow}>
              <Feather name="clock" size={14} color="#5A71E4" style={styles.hoursIcon} />
              <Text style={styles.hoursText}>Monday - Friday: 9AM - 6PM EST</Text>
            </View>
            <View style={styles.hoursRow}>
              <Feather name="clock" size={14} color="#5A71E4" style={styles.hoursIcon} />
              <Text style={styles.hoursText}>Saturday: 10AM - 4PM EST</Text>
            </View>
            <View style={styles.hoursRow}>
              <Feather name="clock" size={14} color="#5A71E4" style={styles.hoursIcon} />
              <Text style={styles.hoursText}>Sunday: Closed</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.contactInfo}>
            <Text style={styles.supportInfoTitle}>Contact Information</Text>
            <View style={styles.contactRow}>
              <Feather name="mail" size={14} color="#5A71E4" style={styles.contactIcon} />
              <Text style={styles.contactText}>support@storda.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Feather name="phone" size={14} color="#5A71E4" style={styles.contactIcon} />
              <Text style={styles.contactText}>+1 800 555 1234</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingTop: 50,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
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
  heroSection: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroGradient: {
    borderRadius: 16,
  },
  heroContent: {
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    textAlign: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contactButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  quickHelpSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 16,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicItemSelected: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(90, 113, 228, 0.3)',
  },
  topicIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  topicIconSelected: {
    backgroundColor: '#5A71E4',
  },
  topicText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#222D3A',
    flex: 1,
  },
  topicTextSelected: {
    color: '#5A71E4',
    fontFamily: 'Inter-SemiBold',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  faqItemExpanded: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(90, 113, 228, 0.3)',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    flex: 1,
    marginRight: 8,
  },
  answer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
    lineHeight: 19,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(132, 148, 169, 0.1)',
  },
  supportInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  supportInfoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 12,
  },
  supportHours: {
    marginBottom: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursIcon: {
    marginRight: 8,
  },
  hoursText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(132, 148, 169, 0.1)',
    marginBottom: 16,
  },
  contactInfo: {
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
  },
}); 