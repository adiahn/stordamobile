import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { Search, AlertTriangle, BookmarkPlus, Bookmark, ChevronUp, ChevronDown, Mail } from 'lucide-react-native';
import { useThemeStore } from '../../store/theme';
import { Alert } from 'react-native';
import { Clipboard } from '@react-native-clipboard/clipboard';

interface SearchResult {
  id: string;
  imei: string;
  model: string;
  isStolen: boolean;
  addedAt: string;
  status: string;
  ownerName: string;
  ownerContact: string;
  lastSeen: string;
}

interface SavedSearch {
  id: string;
  date: string;
  result: SearchResult;
}

export default function SearchScreen() {
  const { isDark } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    if (!searchQuery) return;
    
    // This is a mock search - in a real app, you would call your API
    const mockResult = {
      id: 'DEV_123456',
      imei: '359269023456789',
      model: 'iPhone 13',
      isStolen: true,
      addedAt: '2024-01-20',
      status: 'reported',
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

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.searchBar, isDark && styles.darkSearchBar]}>
        <TextInput
          style={[styles.searchInput, isDark && styles.darkSearchInput]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by IMEI or Device ID"
          placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Search size={20} color="#ffffff" />
        </Pressable>
      </View>

      {searchResult && (
        <View style={[styles.resultCard, isDark && styles.darkCard]}>
          <View style={styles.resultHeader}>
            <Text style={[styles.resultTitle, isDark && styles.darkText]}>
              {searchResult.model}
            </Text>
            {searchResult.isStolen && (
              <View style={styles.stolenBadge}>
                <AlertTriangle size={16} color="#dc2626" />
                <Text style={styles.stolenText}>Stolen</Text>
              </View>
            )}
          </View>
          
          <View style={styles.resultInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>Device ID:</Text>
              <Text style={[styles.value, isDark && styles.darkText]}>{searchResult.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>IMEI:</Text>
              <Text style={[styles.value, isDark && styles.darkText]}>{searchResult.imei}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>Status:</Text>
              <Text style={[styles.value, isDark && styles.darkText]}>
                {searchResult.isStolen ? 'Reported Stolen' : searchResult.status}
              </Text>
            </View>
          </View>
          
          <Pressable style={styles.expandButton} onPress={toggleExpand}>
            <Text style={styles.expandButtonText}>
              {isExpanded ? 'Show Less' : 'Show More Details'}
            </Text>
            {isExpanded ? (
              <ChevronUp size={16} color="#0891b2" />
            ) : (
              <ChevronDown size={16} color="#0891b2" />
            )}
          </Pressable>
          
          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={[styles.expandedTitle, isDark && styles.darkText]}>
                Owner Information
              </Text>
              <View style={styles.infoRow}>
                <Text style={[styles.label, isDark && styles.darkLabel]}>Owner:</Text>
                <Text style={[styles.value, isDark && styles.darkText]}>
                  {searchResult.ownerName}
                </Text>
              </View>
              {searchResult.isStolen && (
                <View style={styles.contactSection}>
                  <Text style={[styles.contactTitle, isDark && styles.darkText]}>
                    This device has been reported stolen
                  </Text>
                  <Text style={[styles.contactInfo, isDark && styles.darkSubText]}>
                    If you have found this device, please contact the owner at {searchResult.ownerContact} 
                    or report to local authorities.
                  </Text>
                  <Pressable style={styles.contactButton}>
                    <Mail size={16} color="#ffffff" />
                    <Text style={styles.contactButtonText}>Contact Owner</Text>
                  </Pressable>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={[styles.label, isDark && styles.darkLabel]}>Last Seen:</Text>
                <Text style={[styles.value, isDark && styles.darkText]}>
                  {searchResult.lastSeen}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
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
  searchBar: {
    flexDirection: 'row',
    gap: 8,
    margin: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    color: '#1e293b',
  },
  darkSearchBar: {
    backgroundColor: '#334155',
  },
  darkSearchInput: {
    backgroundColor: '#334155',
    color: '#f1f5f9',
  },
  searchButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#334155',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  resultInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 120,
    fontSize: 16,
    color: '#64748b',
  },
  darkLabel: {
    color: '#94a3b8',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  stolenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  stolenText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  expandButtonText: {
    color: '#0891b2',
    fontSize: 14,
    fontWeight: '500',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    gap: 12,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  contactButton: {
    backgroundColor: '#0891b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  recoverButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  recoverButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recoverConfirmButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  darkText: {
    color: '#f1f5f9',
  },
  darkSubText: {
    color: '#94a3b8',
  },
});