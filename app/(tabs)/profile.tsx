import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Settings, ChevronRight, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const menuItems = [
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    subtitle: 'Manage your alerts',
    color: '#A6C8FF',
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Security',
    subtitle: 'Configure security settings',
    color: '#D6B4FC',
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Payment Methods',
    subtitle: 'Manage your payment options',
    color: '#4CAF50',
  },
  {
    id: 'help',
    icon: HelpCircle,
    title: 'Help & Support',
    subtitle: 'Get assistance',
    color: '#FF9800',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Storda Profile</Text>
        <AnimatedPressable style={styles.settingsButton}>
          <Settings size={24} color="#666" />
        </AnimatedPressable>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://media.licdn.com/dms/image/v2/D4D03AQEqENBBrtJ1TQ/profile-displayphoto-shrink_200_200/B4DZPay3ikHMAc-/0/1734542589022?e=2147483647&v=beta&t=Z1y3lAWkUYNsz7DvA_3e0dP4QeJXz-mO8LsXDrUQQ6w' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Adnan Muhammad Mukhtar</Text>
          <Text style={styles.profileEmail}>adnanmukhtar2321@gmail.com</Text>
          <View style={styles.membershipBadge}>
            <Text style={styles.membershipText}>Premium Member</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <AnimatedPressable key={item.id} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
              <item.icon size={24} color={item.color} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </AnimatedPressable>
        ))}
      </View>

      <AnimatedPressable style={styles.logoutButton} onPress={() => router.push(`/auth/login`)}>
        <LogOut size={24} color="#FF6B6B" />
        <Text style={styles.logoutText}>Log Out</Text>
      </AnimatedPressable>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#121826',
  },
  settingsButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  profileSection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#121826',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  membershipBadge: {
    backgroundColor: '#A6C8FF15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  membershipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#A6C8FF',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#121826',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B15',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF6B6B',
    marginLeft: 8,
  },
});