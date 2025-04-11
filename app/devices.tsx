import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  TextInput, 
  FlatList, 
  Keyboard,
  ActivityIndicator,
  AccessibilityInfo,
  NativeEventEmitter,
  findNodeHandle
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useDeviceStore, Device } from './store/store';
import { debounce, isLowEndDevice } from './utils/performance';
import Modal from './components/Modal';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Memoize individual device items to prevent re-renders when list changes
const DeviceItem = memo(({ 
  item, 
  onPress,
  index
}: { 
  item: Device; 
  onPress: (device: Device) => void;
  index: number;
}) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  const delay = isLowEndDevice() ? 0 : 100 + index * 50;

  return (
    <Animated.View 
      entering={FadeInUp.duration(400).delay(delay)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.name} ID: ${item.id}, Status: ${item.status || 'unknown'}`}
    >
      <Pressable 
        style={styles.deviceCard}
        onPress={handlePress}
        android_ripple={{ color: 'rgba(90, 113, 228, 0.1)' }}
      >
        <View style={styles.deviceIconContainer}>
          <Feather name="smartphone" size={24} color="#5A71E4" />
        </View>
        
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.deviceId}>ID: {item.id}</Text>
          <View style={styles.deviceDetails}>
            <Text style={styles.deviceImei} numberOfLines={1} ellipsizeMode="middle">
              IMEI: {item.imei}
            </Text>
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
  );
});

DeviceItem.displayName = 'DeviceItem';

// Empty state component
const EmptyState = memo(() => (
  <View style={styles.emptyState} accessible={true} accessibilityLabel="No devices found">
    <Feather name="search" size={40} color="#8494A9" style={{opacity: 0.5}} />
    <Text style={styles.emptyStateTitle}>No devices found</Text>
    <Text style={styles.emptyStateText}>Try searching with a different ID or IMEI</Text>
  </View>
));

EmptyState.displayName = 'EmptyState';

// Info card shown when no search is active
const InfoCard = memo(() => (
  <Animated.View 
    style={styles.infoCard}
    entering={isLowEndDevice() ? undefined : FadeInUp.duration(500).delay(200)}
    accessible={true}
    accessibilityLabel="Information about how to find your device details"
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
));

InfoCard.displayName = 'InfoCard';

export default function DevicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'id' | 'imei'>('id');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  
  // Get devices from store
  const storeDevices = useDeviceStore((state) => state.devices);
  
  // Sample devices to combine with store devices - these should be moved to the store in production
  const sampleDevices: Device[] = useMemo(() => [
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
      currentOwner: 'John Doe',
      ownerNIN: '12345678912'
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
      currentOwner: 'Jane Smith',
      ownerNIN: '98765432109'
    }
  ], []);
  
  // Combine and memoize the devices array
  const allDevices = useMemo(() => [...storeDevices, ...sampleDevices], [storeDevices, sampleDevices]);
  
  // Validate ID format
  const isValidDeviceId = useCallback((id: string): boolean => {
    return /^STD-\d{6}$/i.test(id);
  }, []);
  
  // Validate IMEI format
  const isValidImei = useCallback((imei: string): boolean => {
    return /^\d{15,17}$/.test(imei);
  }, []);
  
  // Memoize filtered devices to prevent recalculation on every render
  const filteredDevices = useMemo(() => {
    if (!searchQuery.trim()) {
      setHasSearchError(false);
      return allDevices;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    try {
      // Handle special search patterns and validation
      if (searchMode === 'id') {
        if (query.startsWith('std-') && !isValidDeviceId(query)) {
          setHasSearchError(true);
          return [];
        }
      } else if (searchMode === 'imei') {
        if (query.length > 5 && !isValidImei(query) && query.length >= 15) {
          setHasSearchError(true);
          return [];
        }
      }
      
      setHasSearchError(false);
      
      // Perform the search
      return allDevices.filter(device => {
        if (searchMode === 'id') {
          return device.id.toLowerCase().includes(query);
        } else {
          return device.imei.toLowerCase().includes(query);
        }
      });
    } catch (error) {
      console.error('Search error:', error);
      setHasSearchError(true);
      return [];
    }
  }, [allDevices, searchQuery, searchMode, isValidDeviceId, isValidImei]);
  
  // Focus search input when component loads or searchMode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchMode]);
  
  // Debounced search to prevent excessive rendering
  const debouncedSearch = useMemo(() => 
    debounce((text: string) => {
      setSearchQuery(text);
    }, 300), 
  []);
  
  // Memoize handlers to prevent new function creation on each render
  const handleDeviceSelect = useCallback((device: Device) => {
    try {
      // Simulate loading state
      setIsLoading(true);
      
      // Validate before proceeding
      if (!device || !device.id) {
        setErrorModalVisible(true);
        setIsLoading(false);
        return;
      }
      
      // Use a small timeout to avoid UI jank during navigation
      setTimeout(() => {
        useDeviceStore.getState().setSelectedDevice(device);
        router.push({
          pathname: '/view/[Id]',
          params: { Id: device.id }
        });
        setIsLoading(false);
      }, isLowEndDevice() ? 0 : 50);
    } catch (error) {
      console.error('Error selecting device:', error);
      setIsLoading(false);
      setErrorModalVisible(true);
    }
  }, []);

  const handleChangeSearchQuery = useCallback((text: string) => {
    debouncedSearch(text);
  }, [debouncedSearch]);
  
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setHasSearchError(false);
    debouncedSearch('');
    if (searchInputRef.current) {
      searchInputRef.current.clear();
      searchInputRef.current.focus();
    }
    Keyboard.dismiss();
  }, [debouncedSearch]);
  
  const handleSetSearchMode = useCallback((mode: 'id' | 'imei') => {
    if (mode === searchMode) return;
    
    setSearchMode(mode);
    setSearchQuery('');
    setHasSearchError(false);
    debouncedSearch('');
    
    // Clear search when switching modes for better UX
    if (searchInputRef.current) {
      searchInputRef.current.clear();
      searchInputRef.current.focus();
    }
  }, [searchMode, debouncedSearch]);
  
  // Memoize the key extractor for FlatList
  const keyExtractor = useCallback((item: Device) => item.key?.toString() || item.id, []);
  
  // Memoize the renderItem function for FlatList
  const renderItem = useCallback(({ item, index }: { item: Device, index: number }) => (
    <DeviceItem item={item} onPress={handleDeviceSelect} index={index} />
  ), [handleDeviceSelect]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={20} color="#222D3A" />
        </Pressable>
        <Text style={styles.title}>Find Device</Text>
      </View>

      <Animated.View 
        style={styles.searchContainer}
        entering={isLowEndDevice() ? undefined : FadeInUp.duration(500).delay(100)}
      >
        <View style={styles.searchHeader}>
          <Text style={styles.searchTitle}>Search your device</Text>
          <Text style={styles.searchSubtitle}>Find by Device ID or IMEI</Text>
        </View>
        
        <View style={[styles.searchBox, hasSearchError && styles.searchBoxError]}>
          <Feather name="search" size={20} color={hasSearchError ? "#E45A5A" : "#8494A9"} style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder={searchMode === 'id' ? "Enter Device ID (STD-123456)" : "Enter IMEI number"}
            onChangeText={handleChangeSearchQuery}
            placeholderTextColor="#8494A9"
            keyboardType={searchMode === 'imei' ? 'number-pad' : 'default'}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel={`Search by ${searchMode === 'id' ? 'Device ID' : 'IMEI number'}`}
            accessibilityHint={`Enter ${searchMode === 'id' ? 'Device ID' : 'IMEI number'} to search`}
          />
          {searchQuery.length > 0 && (
            <Pressable 
              onPress={handleClearSearch} 
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Feather name="x" size={16} color="#8494A9" />
            </Pressable>
          )}
        </View>
        
        {hasSearchError && (
          <Text style={styles.searchErrorText}>
            {searchMode === 'id' 
              ? 'Please enter a valid device ID (STD-xxxxxx)' 
              : 'Please enter a valid IMEI number (15-17 digits)'}
          </Text>
        )}
        
        <View style={styles.searchOptions}>
          <Pressable
            style={[styles.searchOption, searchMode === 'id' && styles.searchOptionActive]}
            onPress={() => handleSetSearchMode('id')}
            accessibilityRole="radio"
            accessibilityState={{ checked: searchMode === 'id' }}
            accessibilityLabel="Search by Device ID"
          >
            <Text style={[styles.searchOptionText, searchMode === 'id' && styles.searchOptionTextActive]}>
              Device ID
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.searchOption, searchMode === 'imei' && styles.searchOptionActive]}
            onPress={() => handleSetSearchMode('imei')}
            accessibilityRole="radio"
            accessibilityState={{ checked: searchMode === 'imei' }}
            accessibilityLabel="Search by IMEI Number"
          >
            <Text style={[styles.searchOptionText, searchMode === 'imei' && styles.searchOptionTextActive]}>
              IMEI Number
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {!searchQuery.trim() ? (
        <InfoCard />
      ) : (
        <Animated.View 
          style={styles.resultsContainer}
          entering={isLowEndDevice() ? undefined : FadeInUp.duration(500).delay(200)}
        >
          <Text style={styles.resultsTitle}>
            {filteredDevices.length > 0 
              ? `${filteredDevices.length} device${filteredDevices.length !== 1 ? 's' : ''} found`
              : 'No devices found'
            }
          </Text>
          
          <FlatList
            data={filteredDevices}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.devicesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState />}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={isLowEndDevice() ? 5 : 10}
            initialNumToRender={isLowEndDevice() ? 5 : 8}
            windowSize={isLowEndDevice() ? 5 : 7}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            getItemLayout={(data, index) => ({
              length: 92, // Fixed height for each item
              offset: 92 * index,
              index,
            })}
          />
        </Animated.View>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5A71E4" />
        </View>
      )}
      
      {/* Error Modal */}
      <Modal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="Error"
        message="An error occurred while trying to view the device details. Please try again."
        type="error"
        primaryButtonText="OK"
      />
    </View>
  );
}

// Move styles outside component to prevent recreating on each render
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#222D3A',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchHeader: {
    marginBottom: 12,
  },
  searchTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#222D3A',
  },
  searchSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
    marginTop: 2,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F1F2F6',
  },
  searchBoxError: {
    borderColor: '#E45A5A',
    backgroundColor: 'rgba(228, 90, 90, 0.05)',
  },
  searchErrorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#E45A5A',
    marginBottom: 8,
    marginLeft: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#222D3A',
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchOptions: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FB',
    padding: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  searchOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  searchOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8494A9',
  },
  searchOptionTextActive: {
    color: '#222D3A',
  },
  infoCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    color: '#8494A9',
    lineHeight: 20,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#8494A9',
    marginBottom: 12,
  },
  devicesList: {
    paddingBottom: 24,
    minHeight: 200,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    height: 80,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  deviceName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#222D3A',
    marginBottom: 2,
  },
  deviceId: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8494A9',
    marginBottom: 4,
  },
  deviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  deviceImei: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8494A9',
    marginRight: 8,
    maxWidth: 120,
  },
  deviceChip: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  deviceChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#5A71E4',
  },
  deviceStatus: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
  },
  activeBadge: {
    backgroundColor: 'rgba(48, 176, 80, 0.1)',
  },
  transferredBadge: {
    backgroundColor: 'rgba(90, 113, 228, 0.1)',
  },
  reportedBadge: {
    backgroundColor: 'rgba(228, 90, 90, 0.1)',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#222D3A',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },
  emptyStateTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#222D3A',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8494A9',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});