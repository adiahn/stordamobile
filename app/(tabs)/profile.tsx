import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { Settings, Key, Bell, Moon } from 'lucide-react-native';
import { useThemeStore } from '../../store/theme';

export default function ProfileScreen() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={[styles.name, isDark && styles.darkText]}>John Doe</Text>
        <Text style={[styles.email, isDark && styles.darkSubText]}>john.doe@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Security</Text>
        <Pressable style={[styles.menuItem, isDark && styles.darkMenuItem]}>
          <Key size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          <Text style={[styles.menuText, isDark && styles.darkText]}>Change Device Transfer PIN</Text>
        </Pressable>
        <Pressable style={[styles.menuItem, isDark && styles.darkMenuItem]}>
          <Bell size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          <Text style={[styles.menuText, isDark && styles.darkText]}>Notification Settings</Text>
        </Pressable>
        <View style={[styles.menuItem, isDark && styles.darkMenuItem]}>
          <Moon size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          <Text style={[styles.menuText, isDark && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            style={styles.switch}
          />
        </View>
        <Pressable style={[styles.menuItem, isDark && styles.darkMenuItem]}>
          <Settings size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          <Text style={[styles.menuText, isDark && styles.darkText]}>Account Settings</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Recent Activity</Text>
        <View style={[styles.activityList, isDark && styles.darkMenuItem]}>
          <View style={[styles.activityItem, isDark && styles.darkBorder]}>
            <Text style={[styles.activityText, isDark && styles.darkText]}>Added new device: iPhone 13</Text>
            <Text style={[styles.activityTime, isDark && styles.darkSubText]}>2 hours ago</Text>
          </View>
          <View style={[styles.activityItem, isDark && styles.darkBorder]}>
            <Text style={[styles.activityText, isDark && styles.darkText]}>Changed transfer PIN</Text>
            <Text style={[styles.activityTime, isDark && styles.darkSubText]}>Yesterday</Text>
          </View>
          <View style={[styles.activityItem, isDark && styles.darkBorder]}>
            <Text style={[styles.activityText, isDark && styles.darkText]}>Reported device as stolen</Text>
            <Text style={[styles.activityTime, isDark && styles.darkSubText]}>3 days ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#1e293b',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  darkHeader: {
    backgroundColor: '#334155',
    borderBottomColor: '#475569',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  darkMenuItem: {
    backgroundColor: '#334155',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  switch: {
    marginLeft: 'auto',
  },
  activityList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 16,
  },
  darkBorder: {
    borderBottomColor: '#475569',
  },
  activityText: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
  darkText: {
    color: '#f1f5f9',
  },
  darkSubText: {
    color: '#94a3b8',
  },
});