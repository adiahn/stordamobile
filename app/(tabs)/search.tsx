import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { Search, AlertTriangle, BookmarkPlus, Bookmark } from 'lucide-react-native';
import { useThemeStore } from '../../store/theme';

interface SearchResult {
  id: string;
  imei: string;
  model: string;
  isStolen: boolean;
  owner: string;
  addedAt: string;
  image?: string;
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
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isSearchSaved, setIsSearchSaved] = useState(false);

  const handleSearch = () => {
    // Simulated search result
    if (searchQuery === 'dev_1' || searchQuery === '359269023456789') {
      const result = {
        id: 'dev_1',
        imei: '359269023456789',
        model: 'iPhone 13',
        isStolen: false,
        owner: 'John Doe',
        addedAt: '2024-01-20',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop'
      };
      setSearchResult(result);
      setIsSearchSaved(savedSearches.some(s => s.result.id === result.id));
    }
  };

  const toggleSaveSearch = () => {
    if (!searchResult) return;

    if (isSearchSaved) {
      setSavedSearches(savedSearches.filter(s => s.result.id !== searchResult.id));
      setIsSearchSaved(false);
    } else {
      const newSavedSearch: SavedSearch = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        result: searchResult
      };
      setSavedSearches([newSavedSearch, ...savedSearches]);
      setIsSearchSaved(true);
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.searchBox}>
        <TextInput
          style={[styles.searchInput, isDark && styles.darkInput]}
          placeholder="Enter Device ID or IMEI"
          placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Search size={20} color="#ffffff" />
        </Pressable>
      </View>

      {searchResult && (
        <View style={[styles.resultCard, isDark && styles.darkCard]}>
          <View style={styles.resultHeader}>
            <Text style={[styles.resultTitle, isDark && styles.darkText]}>Device Information</Text>
            <Pressable style={styles.saveButton} onPress={toggleSaveSearch}>
              {isSearchSaved ? (
                <Bookmark size={20} color={isDark ? '#0891b2' : '#0891b2'} />
              ) : (
                <BookmarkPlus size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              )}
            </Pressable>
          </View>
          <View style={styles.resultInfo}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>Device ID:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{searchResult.id}</Text>
          </View>
          <View style={styles.resultInfo}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>Model:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{searchResult.model}</Text>
          </View>
          <View style={styles.resultInfo}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>IMEI:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{searchResult.imei}</Text>
          </View>
          <View style={styles.resultInfo}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>Current Owner:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{searchResult.owner}</Text>
          </View>
          {searchResult.isStolen && (
            <View style={styles.stolenWarning}>
              <AlertTriangle size={20} color="#dc2626" />
              <Text style={styles.stolenText}>
                This device has been reported as stolen
              </Text>
            </View>
          )}
        </View>
      )}

      {savedSearches.length > 0 && (
        <View style={styles.savedSearchesSection}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Saved Searches</Text>
          {savedSearches.map((saved) => (
            <View key={saved.id} style={[styles.savedSearchCard, isDark && styles.darkCard]}>
              <View style={styles.savedSearchHeader}>
                <Text style={[styles.savedSearchDate, isDark && styles.darkSubText]}>
                  {new Date(saved.date).toLocaleDateString()}
                </Text>
                <Bookmark size={16} color={isDark ? '#0891b2' : '#0891b2'} />
              </View>
              <Text style={[styles.savedSearchModel, isDark && styles.darkText]}>
                {saved.result.model}
              </Text>
              <Text style={[styles.savedSearchId, isDark && styles.darkSubText]}>
                ID: {saved.result.id}
              </Text>
              {saved.result.isStolen && (
                <View style={styles.miniStolenWarning}>
                  <AlertTriangle size={16} color="#dc2626" />
                  <Text style={styles.miniStolenText}>Reported Stolen</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
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
  searchBox: {
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
  darkInput: {
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
  saveButton: {
    padding: 8,
  },
  resultInfo: {
    flexDirection: 'row',
    marginBottom: 12,
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
  stolenWarning: {
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
  savedSearchesSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  savedSearchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  savedSearchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  savedSearchDate: {
    fontSize: 12,
    color: '#64748b',
  },
  savedSearchModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  savedSearchId: {
    fontSize: 14,
    color: '#64748b',
  },
  miniStolenWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  miniStolenText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
  },
  darkText: {
    color: '#f1f5f9',
  },
  darkSubText: {
    color: '#94a3b8',
  },
});