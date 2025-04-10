import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, FlatList, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { useDeviceStore } from './store/store';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function DevicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'id' | 'imei'>('id');
  const storeDevices = useDeviceStore((state: any) => state.devices) || [];
  
  // Sample devices to combine with store devices
  const sampleDevices = [
    {
      name: 'iPhone 13 Pro',
      imei: '123456789012345',
      macAddress: 'AA:BB:CC:DD:EE:FF',
      id: 'STD-102938',
      ownership: true,
      key: 100,
      registrationDate: '2024-02-01',
      status: 'active',
      storage: '128GB',
      color: 'Sierra Blue',
      registeredBy: 'John Doe',
      currentOwner: 'John Doe'
    },
    {
      name: 'Samsung Galaxy S22',
      imei: '987654321098765',
      macAddress: 'FF:EE:DD:CC:BB:AA',
      id: 'STD-456789',
      ownership: true,
      key: 101,
      registrationDate: '2024-02-15',
      status: 'transferred',
      storage: '256GB',
      color: 'Phantom Black',
      registeredBy: 'John Doe',
      currentOwner: 'Jane Smith'
    }
  ];
  
  // Combine store devices with sample devices
  const allDevices = [...storeDevices, ...sampleDevices];
  
  // Filter devices based on search query
  const filteredDevices = allDevices.filter(device => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    if (searchMode === 'id') {
      return device.id.toLowerCase().includes(query);
    } else {
      return device.imei.toLowerCase().includes(query);
    }
  });
  
  const handleDeviceSelect = (device: any) => {
    useDeviceStore.getState().setSelectedDevice(device);
    router.push({
      pathname: '/view/[Id]',
      params: { Id: device.id }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Find Device</Text>
      </View>

      <Animated.View 
        style={styles.searchContainer}
        entering={FadeInUp.duration(500).delay(100)}
      >
        <View style={styles.searchHeader}>
          <Text style={styles.searchTitle}>Search your device</Text>
          <Text style={styles.searchSubtitle}>Find by Device ID or IMEI</Text>
        </View>
        
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#8494A9" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={searchMode === 'id' ? "Enter Device ID (e.g., STD-123456)" : "Enter IMEI number"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8494A9"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Feather name="x" size={16} color="#8494A9" />
            </Pressable>
          )}
        </View>
        
        <View style={styles.searchOptions}>
          <Pressable
            style={[styles.searchOption, searchMode === 'id' && styles.searchOptionActive]}
            onPress={() => setSearchMode('id')}
          >
            <Text style={[styles.searchOptionText, searchMode === 'id' && styles.searchOptionTextActive]}>
              Device ID
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.searchOption, searchMode === 'imei' && styles.searchOptionActive]}
            onPress={() => setSearchMode('imei')}
          >
            <Text style={[styles.searchOptionText, searchMode === 'imei' && styles.searchOptionTextActive]}>
              IMEI Number
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {!searchQuery.trim() ? (
        <Animated.View 
          style={styles.infoCard}
          entering={FadeInUp.duration(500).delay(200)}
        >
          <View style={styles.infoHeader}>
            <Feather name="info" size={22} color="#5A71E4" />
            <Text style={styles.infoTitle}>How to find your device information</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoBullet}>
              <Text style={styles.bulletText}>1</Text>
            </View>
            <Text style={styles.infoText}>Device ID starts with "STD-" and can be found in your device details</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoBullet}>
              <Text style={styles.bulletText}>2</Text>
            </View>
            <Text style={styles.infoText}>IMEI is a 15-digit unique number that can be found in your phone settings</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoBullet}>
              <Text style={styles.bulletText}>3</Text>
            </View>
            <Text style={styles.infoText}>For iOS: Settings &gt; General &gt; About &gt; IMEI</Text>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoBullet}>
              <Text style={styles.bulletText}>4</Text>
            </View>
            <Text style={styles.infoText}>For Android: Settings &gt; About Phone &gt; IMEI</Text>
          </View>
        </Animated.View>
      ) : (
        <Animated.View 
          style={styles.resultsContainer}
          entering={FadeInUp.duration(500).delay(200)}
        >
          <Text style={styles.resultsTitle}>
            {filteredDevices.length > 0 
              ? `${filteredDevices.length} device${filteredDevices.length !== 1 ? 's' : ''} found`
              : 'No devices found'
            }
          </Text>
          
          <FlatList
            data={filteredDevices}
            keyExtractor={(item) => item.key.toString()}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInUp.duration(500).delay(300 + index * 100)}>
                <Pressable 
                  style={styles.deviceCard}
                  onPress={() => handleDeviceSelect(item)}
                >
                  <View style={styles.deviceIconContainer}>
                    <Feather name="smartphone" size={24} color="#5A71E4" />
                  </View>
                  
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.name}</Text>
                    <Text style={styles.deviceId}>ID: {item.id}</Text>
                    <View style={styles.deviceDetails}>
                      <Text style={styles.deviceImei}>IMEI: {item.imei}</Text>
                      {item.storage && (
                        <View style={styles.deviceChip}>
                          <Text style={styles.deviceChipText}>{item.storage}</Text>
                        </View>
                      )}
                      {item.color && (
                        <View style={styles.deviceChip}>
                          <Text style={styles.deviceChipText}>{item.color}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.ownershipInfo}>
                      <Text style={styles.ownershipText}>
                        <Text style={styles.ownershipLabel}>Registered by: </Text>
                        {item.registeredBy || 'Unknown'}
                      </Text>
                      <Text style={styles.ownershipText}>
                        <Text style={styles.ownershipLabel}>Current owner: </Text>
                        {item.currentOwner || (item.status === 'transferred' ? 'Transferred' : item.registeredBy || 'Unknown')}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.deviceStatus}>
                    <View style={[
                      styles.statusBadge,
                      item.status === 'active' ? styles.activeBadge : 
                      item.status === 'transferred' ? styles.transferredBadge :
                      styles.reportedBadge
                    ]}>
                      <Text style={styles.statusText}>
                        {item.status === 'active' ? 'Active' :
                         item.status === 'transferred' ? 'Transferred' :
                         item.status === 'lost' ? 'Lost' :
                         item.status === 'stolen' ? 'Stolen' : 'Inactive'}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={18} color="#8494A9" />
                  </View>
                </Pressable>
              </Animated.View>
            )}
            contentContainerStyle={styles.devicesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="search" size={40} color="#8494A9" style={{opacity: 0.5}} />
                <Text style={styles.emptyStateTitle}>No devices found</Text>
                <Text style={styles.emptyStateText}>Try searching with a different ID or IMEI</Text>
              </View>
            }
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#222D3A',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchHeader: {
    marginBottom: 16,
  },
  searchTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 4,
  },
  searchSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
  },
  clearButton: {
    padding: 4,
  },
  searchOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  searchOptionActive: {
    borderBottomColor: '#5A71E4',
  },
  searchOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  searchOptionTextActive: {
    color: '#5A71E4',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#5A71E4',
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
    lineHeight: 20,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 12,
  },
  devicesList: {
    paddingBottom: 20,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginBottom: 2,
  },
  deviceId: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 4,
  },
  deviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceImei: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
    marginRight: 8,
  },
  deviceChip: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  deviceChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#5A71E4',
  },
  ownershipInfo: {
    marginTop: 4,
  },
  ownershipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#222D3A',
    marginBottom: 2,
  },
  ownershipLabel: {
    fontWeight: '600',
    color: '#5A71E4',
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
  },
  transferredBadge: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
  },
  reportedBadge: {
    backgroundColor: 'rgba(255, 173, 51, 0.1)',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#30B050',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    textAlign: 'center',
  }
});