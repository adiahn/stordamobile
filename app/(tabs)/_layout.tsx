import { Tabs } from 'expo-router';
import { Smartphone, Search, CircleUser as UserCircle } from 'lucide-react-native';
import { useThemeStore } from '../../store/theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { isDark } = useThemeStore();
  
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
        },
        headerTintColor: isDark ? '#f1f5f9' : '#1e293b',
        tabBarStyle: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderTopColor: isDark ? '#475569' : '#e2e8f0',
        },
        tabBarActiveTintColor: '#0891b2',
        tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
        headerSafeAreaInsets: { top: Platform.OS === 'ios' ? 44 : 0 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Devices',
          tabBarIcon: ({ color }) => <Smartphone size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}