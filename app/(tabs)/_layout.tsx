import { Tabs } from 'expo-router';
import { Search, CircleUser as UserCircle } from 'lucide-react-native';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#334155',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        headerSafeAreaInsets: { top: Platform.OS === 'ios' ? 44 : 0 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Devices',
          tabBarIcon: ({ color }) => <Feather name="smartphone" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}