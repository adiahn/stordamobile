import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MENU_ITEMS = [
  {
    id: 'personal-info',
    icon: 'user',
    title: 'Personal Information',
    description: 'Manage your personal details',
    screen: '/profile/personal-info',
  },
  {
    id: 'security',
    icon: 'shield',
    title: 'Security',
    description: 'Password and authentication',
    screen: '/profile/security',
  },
  {
    id: 'notifications',
    icon: 'bell',
    title: 'Notifications',
    description: 'Configure alert preferences',
    screen: '/profile/notifications',
  },
  {
    id: 'help',
    icon: 'help-circle',
    title: 'Help & Support',
    description: 'Get help with Storda',
    screen: '/profile/help',
  },
  {
    id: 'about',
    icon: 'info',
    title: 'About',
    description: 'Terms, privacy, and app info',
    screen: '/profile/about',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: 'Adnan Asif',
    email: 'adnanasif@gmail.com',
    phone: '+1 234 567 8901',
    address: 'New York, USA',
    devices: 3,
    transfers: 2,
    memberSince: '2023'
  });

  const handleMenuItemPress = (screen) => {
    if (screen.startsWith('/profile/')) {
      router.push({
        pathname: screen,
        params: { profileData: JSON.stringify(profileData) }
      });
    } else {
      // Handle other navigation or actions
      Alert.alert('Coming Soon', 'This feature will be available in the next update.');
    }
  };

  const handleEditProfile = () => {
    router.push({
      pathname: '/profile/edit',
      params: { profileData: JSON.stringify(profileData) }
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Log Out',
          onPress: () => {
            // In a real app, this would handle the logout process
            Alert.alert('Logged Out', 'You have successfully logged out.');
            // Navigate to login screen
            router.push('/auth/login');
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <Text style={styles.headerTitle}>Profile</Text>
      </Animated.View>

      <Animated.View 
        style={styles.profileCard}
        entering={FadeInUp.duration(500).delay(200)}
      >
        <LinearGradient
          colors={['#5A71E4', '#8C3BFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileGradient}
        >
          <View style={styles.profileContent}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.profileImage}
              />
              <Pressable 
                style={styles.profileImageEditButton}
                onPress={handleEditProfile}
              >
                <Feather name="edit-2" size={12} color="#5A71E4" />
              </Pressable>
            </View>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileEmail}>{profileData.email}</Text>
            <AnimatedPressable 
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </AnimatedPressable>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View 
        style={styles.statsContainer}
        entering={FadeInUp.duration(500).delay(300)}
      >
        <View style={styles.statsItem}>
          <Text style={styles.statsNumber}>{profileData.devices}</Text>
          <Text style={styles.statsLabel}>Devices</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsItem}>
          <Text style={styles.statsNumber}>{profileData.transfers}</Text>
          <Text style={styles.statsLabel}>Transfers</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsItem}>
          <Text style={styles.statsNumber}>{new Date().getFullYear() - parseInt(profileData.memberSince)}</Text>
          <Text style={styles.statsLabel}>Year</Text>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.menuContainer}
        entering={FadeInUp.duration(500).delay(400)}
      >
        <Text style={styles.menuTitle}>Settings</Text>
        
        {MENU_ITEMS.map((item, index) => (
          <AnimatedPressable 
            key={item.id} 
            style={styles.menuItem}
            entering={FadeInUp.duration(300).delay(500 + index * 100)}
            onPress={() => handleMenuItemPress(item.screen)}
          >
            <View style={styles.menuIconContainer}>
              <Feather name={item.icon} size={20} color="#5A71E4" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#8494A9" />
          </AnimatedPressable>
        ))}
      </Animated.View>

      <AnimatedPressable 
        style={styles.logoutButton}
        entering={FadeInUp.duration(500).delay(1000)}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color="#E45A5A" />
        <Text style={styles.logoutText}>Log Out</Text>
      </AnimatedPressable>
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
    paddingBottom: 80,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#222D3A',
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#8C3BFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  profileGradient: {
    borderRadius: 16,
  },
  profileContent: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#222D3A',
    marginBottom: 4,
  },
  statsLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
  },
  statsDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(132, 148, 169, 0.2)',
    alignSelf: 'center',
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#E45A5A',
    marginLeft: 8,
  },
});