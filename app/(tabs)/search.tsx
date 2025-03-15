import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SearchResult {
  id: string;
  imei: string;
  model: string;
  isStolen: boolean;
  status: string;
  ownerName: string;
  ownerContact: string;
  lastSeen: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SearchResult[]>([]);

  const handleSearch = () => {
    if (!searchQuery) return;
    
    // This is a mock search - in a real app, you would call your API
    const isDeviceStolen = searchQuery.toLowerCase().includes("stolen");
    
    const mockResult = {
      id: 'DEV_123456',
      imei: searchQuery, // Use the search query as IMEI for demo
      model: 'iPhone 13',
      isStolen: isDeviceStolen,
      status: isDeviceStolen ? 'reported' : 'owned',
      ownerName: 'Sarah Johnson',
      ownerContact: 'sarah.j@example.com',
      lastSeen: '2024-02-15',
    };
    
    setSearchResult(mockResult);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const saveSearchResult = () => {
    if (!searchResult) return;
    
    // Check if already saved
    const alreadySaved = savedSearches.some(saved => saved.id === searchResult.id);
    if (alreadySaved) {
      Alert.alert('Already Saved', 'This device is already in your saved searches.');
      return;
    }
    
    setSavedSearches([...savedSearches, searchResult]);
    Alert.alert('Saved', 'Device has been added to your saved searches.');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Devices</Text>
          <Text style={styles.subtitle}>
            Find devices by IMEI or Device ID
          </Text>
        </View>
        
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Enter IMEI or Device ID"
            placeholderTextColor="#94a3b8"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <Pressable style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>

        {searchResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                {searchResult.model}
              </Text>
              {searchResult.isStolen && (
                <View style={styles.stolenBadge}>
                  <Feather name="alert-triangle" size={14} color="#dc2626" />
                  <Text style={styles.stolenText}>Stolen</Text>
                </View>
              )}
            </View>
            
            <View style={styles.resultInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Device ID:</Text>
                <Text style={styles.value}>{searchResult.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>IMEI:</Text>
                <Text style={styles.value}>{searchResult.imei}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>
                  {searchResult.isStolen ? 'Reported Stolen' : searchResult.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.resultActions}>
              <Pressable style={styles.actionButton} onPress={toggleExpand}>
                <Text style={styles.actionButtonText}>
                  {isExpanded ? 'Show Less' : 'Show More Details'}
                </Text>
                <Feather 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#6366f1" 
                />
              </Pressable>
              
              <Pressable style={styles.saveButton} onPress={saveSearchResult}>
                <Feather name="bookmark" size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
            
            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedTitle}>
                  Device Details
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Device ID:</Text>
                  <Text style={styles.value}>{searchResult.id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>IMEI:</Text>
                  <Text style={styles.value}>{searchResult.imei}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Model:</Text>
                  <Text style={styles.value}>{searchResult.model}</Text>
                </View>
                
                <Text style={[styles.expandedTitle, styles.ownerSectionTitle]}>
                  Owner Information
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Owner:</Text>
                  <Text style={styles.value}>{searchResult.ownerName}</Text>
                </View>
                {searchResult.isStolen && (
                  <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>
                      This device has been reported stolen
                    </Text>
                    <Text style={styles.contactInfo}>
                      If you have found this device, please contact the owner at {searchResult.ownerContact} 
                      or report to local authorities.
                    </Text>
                    <Pressable style={styles.contactButton}>
                      <Feather name="mail" size={16} color="#ffffff" />
                      <Text style={styles.contactButtonText}>Contact Owner</Text>
                    </Pressable>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Last Seen:</Text>
                  <Text style={styles.value}>{searchResult.lastSeen}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {savedSearches.length > 0 && (
          <View style={styles.savedSearchesSection}>
            <Text style={styles.sectionTitle}>Saved Searches</Text>
            {savedSearches.map((saved, index) => (
              <Pressable 
                key={`${saved.id}_${index}`}
                style={styles.savedSearchItem}
                onPress={() => {
                  setSearchQuery(saved.imei);
                  setSearchResult(saved);
                }}
              >
                <View>
                  <Text style={styles.savedSearchTitle}>
                    {saved.model}
                  </Text>
                  <Text style={styles.savedSearchSubtitle}>
                    IMEI: {saved.imei}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color="#94a3b8" />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#334155',
  },
  searchButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  stolenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: 100,
  },
  stolenText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  resultInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  actionButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    marginTop: 16,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  ownerSectionTitle: {
    marginTop: 24,
  },
  contactSection: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  savedSearchesSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  savedSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  savedSearchTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
  },
  savedSearchSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
});