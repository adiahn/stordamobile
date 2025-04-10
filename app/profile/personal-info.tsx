import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function PersonalInfoScreen() {
  const params = useLocalSearchParams();
  const [profileData, setProfileData] = useState({
    name: 'Adnan Mukhtar',
    email: 'adnanmukhtar@gmail.com',
    phone: '+2347011313752',
    address: 'No 123, Main Street, Lagos, Nigeria',
    memberSince: '2023-01-01'
  });

  useEffect(() => {
    try {
      if (params.profileData) {
        const data = JSON.parse(params.profileData as string);
        setProfileData(data);
      }
    } catch (e) {
      console.error("Error parsing profile data:", e);
    }
  }, [params.profileData]);

  const handleEditPress = () => {
    router.push({
      pathname: '/profile/edit',
      params: { profileData: JSON.stringify(profileData) }
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
          <Feather name="arrow-left" size={18} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Personal Information</Text>
      </View>

      <Animated.View 
        style={styles.infoContainer}
        entering={FadeInUp.duration(500)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <Pressable 
            style={styles.editButton}
            onPress={handleEditPress}
          >
            <Feather name="edit-2" size={14} color="#5A71E4" />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{profileData.name}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>{profileData.email}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{profileData.phone}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Home Address</Text>
            <Text style={styles.infoValue}>{profileData.address}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.infoContainer}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{profileData.memberSince}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Account ID</Text>
            <Text style={styles.infoValue}>STD-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.dangerZone}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        
        <Pressable style={styles.deleteButton}>
          <Feather name="trash-2" size={16} color="#E45A5A" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </Pressable>
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
  infoContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#5A71E4',
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoItem: {
    paddingVertical: 10,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(132, 148, 169, 0.1)',
  },
  statusBadge: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#30B050',
  },
  dangerZone: {
    marginBottom: 30,
  },
  dangerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#E45A5A',
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(228, 90, 90, 0.2)',
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#E45A5A',
    marginLeft: 8,
  },
}); 