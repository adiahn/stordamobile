import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MENU_ITEMS = [
  {
    icon: 'user',
    title: 'Personal Information',
    description: 'Manage your personal details',
  },
  {
    icon: 'shield',
    title: 'Security',
    description: 'Password and authentication',
  },
  {
    icon: 'bell',
    title: 'Notifications',
    description: 'Configure alert preferences',
  },
  {
    icon: 'help-circle',
    title: 'Help & Support',
    description: 'Get help with Storda',
  },
  {
    icon: 'info',
    title: 'About',
    description: 'Terms, privacy, and app info',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
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
              <View style={styles.profileImageEditButton}>
                <Feather name="edit-2" size={12} color="#5A71E4" />
              </View>
            </View>
            <Text style={styles.profileName}>Adnan Asif</Text>
            <Text style={styles.profileEmail}>adnanasif@gmail.com</Text>
            <AnimatedPressable style={styles.editButton}>
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
          <Text style={styles.statsNumber}>3</Text>
          <Text style={styles.statsLabel}>Devices</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsItem}>
          <Text style={styles.statsNumber}>2</Text>
          <Text style={styles.statsLabel}>Transfers</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsItem}>
          <Text style={styles.statsNumber}>1</Text>
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
            key={item.title} 
            style={styles.menuItem}
            entering={FadeInUp.duration(300).delay(500 + index * 100)}
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#222D3A',
  },
  profileCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#8C3BFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileGradient: {
    borderRadius: 24,
  },
  profileContent: {
    padding: 24,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#222D3A',
    marginBottom: 4,
  },
  statsLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
  },
  statsDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(132, 148, 169, 0.2)',
    alignSelf: 'center',
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#222D3A',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#E45A5A',
  },
});