import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Linking } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Constants from 'expo-constants';

export default function AboutScreen() {
  const appVersion = "1.0.0"; // In a real app, you would use Constants.manifest.version
  
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
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
        <Text style={styles.title}>About</Text>
      </View>

      <Animated.View 
        style={styles.appInfoSection}
        entering={FadeInUp.duration(500)}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/storda_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Storda</Text>
        <Text style={styles.appTagline}>Protect Your Digital Life</Text>
        <Text style={styles.appVersion}>Version {appVersion}</Text>
      </Animated.View>

      <Animated.View 
        style={styles.linksSection}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Text style={styles.sectionTitle}>Legal</Text>
        
        <View style={styles.card}>
          <Pressable 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://storda.com/terms')}
          >
            <View style={styles.linkInfo}>
              <View style={styles.linkIconContainer}>
                <Feather name="file-text" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.linkText}>Terms of Service</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8494A9" />
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://storda.com/privacy')}
          >
            <View style={styles.linkInfo}>
              <View style={styles.linkIconContainer}>
                <Feather name="shield" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8494A9" />
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://storda.com/license')}
          >
            <View style={styles.linkInfo}>
              <View style={styles.linkIconContainer}>
                <Feather name="award" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.linkText}>Licenses</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8494A9" />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.linksSection}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <Text style={styles.sectionTitle}>Connect</Text>
        
        <View style={styles.card}>
          <Pressable 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://storda.com/contact')}
          >
            <View style={styles.linkInfo}>
              <View style={styles.linkIconContainer}>
                <Feather name="mail" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.linkText}>Contact Us</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8494A9" />
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://twitter.com/storda')}
          >
            <View style={styles.linkInfo}>
              <View style={styles.linkIconContainer}>
                <Feather name="twitter" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.linkText}>Twitter</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8494A9" />
          </Pressable>
          
          <View style={styles.divider} />
          
          <Pressable 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://instagram.com/storda')}
          >
            <View style={styles.linkInfo}>
              <View style={styles.linkIconContainer}>
                <Feather name="instagram" size={16} color="#5A71E4" />
              </View>
              <Text style={styles.linkText}>Instagram</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8494A9" />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.companyInfo}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <Text style={styles.companyText}>
          Storda is a product of Storda Technologies, Inc.
        </Text>
        <Text style={styles.companyText}>
          © 2023-{new Date().getFullYear()} Storda Technologies. All rights reserved.
        </Text>
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
  appInfoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#5A71E4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#222D3A',
    marginBottom: 4,
  },
  appTagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 8,
  },
  appVersion: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8494A9',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  linksSection: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  linkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#222D3A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(132, 148, 169, 0.1)',
  },
  companyInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  companyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
    textAlign: 'center',
    marginBottom: 4,
  },
}); 