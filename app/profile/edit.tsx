import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable, 
  Image, 
  Alert,
  TouchableOpacity 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function EditProfileScreen() {
  const params = useLocalSearchParams();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    devices: 0,
    transfers: 0,
    memberSince: ''
  });
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    try {
      if (params.profileData) {
        const data = JSON.parse(params.profileData as string);
        setProfileData(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || '');
        setAddress(data.address || '');
      }
    } catch (e) {
      console.error("Error parsing profile data:", e);
    }
  }, [params.profileData]);

  const handleSave = () => {
    // Validate inputs
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // In a real app, this would call an API to update the profile
    Alert.alert('Success', 'Profile updated successfully', [
      {
        text: 'OK',
        onPress: () => router.back()
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
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <Animated.View 
        style={styles.profileImageSection}
        entering={FadeInUp.duration(500)}
      >
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.profileImage}
          />
          <TouchableOpacity 
            style={styles.changePhotoButton}
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          >
            <Feather name="camera" size={16} color="#5A71E4" />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.formContainer}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#8494A9"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#8494A9"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#8494A9"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              placeholderTextColor="#8494A9"
            />
          </View>
        </View>

        <Pressable 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    borderRadius: 16,
  },
  changePhotoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#5A71E4',
    marginLeft: 6,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#222D3A',
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(132, 148, 169, 0.2)',
    borderRadius: 12,
    backgroundColor: '#F8F9FB',
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#222D3A',
  },
  saveButton: {
    height: 48,
    backgroundColor: '#5A71E4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});