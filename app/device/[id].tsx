import { View, Text, StyleSheet, ScrollView, Image, Pressable, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangle, ArrowLeft, Shield, X } from 'lucide-react-native';
import { useState } from 'react';
import { useThemeStore } from '../../store/theme';

interface DeviceHistory {
  date: string;
  action: string;
  from?: string;
  to?: string;
}

interface Device {
  id: string;
  imei: string;
  model: string;
  isStolen: boolean;
  addedAt: string;
  status: 'owned' | 'transferred' | 'reported';
  images?: string[];
  history: DeviceHistory[];
  originalOwner: string;
  purchaseDate: string;
  purchasePrice?: string;
  purchaseFrom?: string;
}

export default function DeviceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useThemeStore();
  const [device] = useState<Device>({
    id: 'dev_1',
    imei: '359269023456789',
    model: 'iPhone 13',
    isStolen: false,
    addedAt: '2024-01-20',
    status: 'owned',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=300&auto=format&fit=crop'
    ],
    originalOwner: 'Sarah Johnson',
    purchaseDate: '2024-01-20',
    purchasePrice: '$799',
    purchaseFrom: 'Apple Store',
    history: [
      {
        date: '2024-01-20',
        action: 'Device Added',
        from: 'Apple Store'
      }
    ]
  });

  // Add state for PIN modal
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [userPin, setUserPin] = useState('');
  const [reportError, setReportError] = useState<string | null>(null);

  const handleReportStolen = () => {
    setIsReportModalVisible(true);
  };

  const handleReportConfirm = async () => {
    if (!userPin) {
      setReportError('Please enter your PIN');
      return;
    }

    try {
      // Here you would verify the PIN with your backend
      // For demo purposes, we'll just check if it's 6 digits
      if (userPin.length !== 6) {
        setReportError('Invalid PIN');
        return;
      }

      // Update device status
      // Here you would make an API call to your backend
      Alert.alert(
        'Device Reported',
        'This device has been reported as stolen. The authorities will be notified.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsReportModalVisible(false);
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      setReportError('Failed to report device. Please try again.');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={isDark ? '#f1f5f9' : '#1e293b'} />
        </Pressable>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Device Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {device.images && device.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
            contentContainerStyle={styles.imageScrollContent}>
            {device.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.deviceImage}
              />
            ))}
          </ScrollView>
        )}

        <View style={[styles.infoCard, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>Device Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>Model:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{device.model}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>IMEI:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{device.imei}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>Device ID:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{device.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>Added:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{device.addedAt}</Text>
          </View>
        </View>

        <View style={[styles.infoCard, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>Purchase Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>Original Owner:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{device.originalOwner}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.darkLabel]}>Purchase Date:</Text>
            <Text style={[styles.value, isDark && styles.darkText]}>{device.purchaseDate}</Text>
          </View>
          {device.purchasePrice && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>Price:</Text>
              <Text style={[styles.value, isDark && styles.darkText]}>{device.purchasePrice}</Text>
            </View>
          )}
          {device.purchaseFrom && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>Purchased From:</Text>
              <Text style={[styles.value, isDark && styles.darkText]}>{device.purchaseFrom}</Text>
            </View>
          )}
        </View>

        <View style={[styles.infoCard, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>Device History</Text>
          {device.history.map((event, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={[styles.historyDate, isDark && styles.darkSubText]}>{event.date}</Text>
              <Text style={[styles.historyAction, isDark && styles.darkText]}>{event.action}</Text>
              {event.from && (
                <Text style={[styles.historyDetail, isDark && styles.darkSubText]}>
                  From: {event.from}
                </Text>
              )}
              {event.to && (
                <Text style={[styles.historyDetail, isDark && styles.darkSubText]}>
                  To: {event.to}
                </Text>
              )}
            </View>
          ))}
        </View>

        {device.status === 'owned' && !device.isStolen && (
          <Pressable
            style={styles.reportButton}
            onPress={handleReportStolen}>
            <AlertTriangle size={20} color="#ffffff" />
            <Text style={styles.reportButtonText}>Report as Stolen</Text>
          </Pressable>
        )}

        {device.isStolen && (
          <View style={styles.stolenWarning}>
            <Shield size={24} color="#dc2626" />
            <Text style={styles.stolenWarningText}>
              This device has been reported as stolen. Contact the authorities if found.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add to the render section: */}
      const reportStolenModal = (
        <Modal
          visible={isReportModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsReportModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, isDark && styles.darkText]}>Report Device as Stolen</Text>
                <Pressable
                  onPress={() => setIsReportModalVisible(false)}
                  style={styles.closeButton}>
                  <X size={24} color={isDark ? '#f1f5f9' : '#1e293b'} />
                </Pressable>
              </View>

              <Text style={[styles.modalText, isDark && styles.darkText]}>
                Please enter your PIN to confirm reporting this device as stolen.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkText]}>PIN</Text>
                <TextInput
                  style={[styles.input, isDark && styles.darkInput]}
                  value={userPin}
                  onChangeText={setUserPin}
                  placeholder="Enter your 6-digit PIN"
                  placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              {reportError && (
                <Text style={styles.errorText}>{reportError}</Text>
              )}

              <Pressable
                style={[styles.reportButton, !userPin && styles.reportButtonDisabled]}
                onPress={handleReportConfirm}
                disabled={!userPin}>
                <AlertTriangle size={20} color="#ffffff" />
                <Text style={styles.reportButtonText}>Confirm Report</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      );
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  darkHeader: {
    backgroundColor: '#334155',
    borderBottomColor: '#475569',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageScroll: {
    marginBottom: 16,
  },
  imageScrollContent: {
    gap: 12,
  },
  deviceImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 120,
    fontSize: 16,
    color: '#64748b',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  historyDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  historyAction: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDetail: {
    fontSize: 14,
    color: '#64748b',
  },
  reportButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  reportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  stolenWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 12,
  },
  stolenWarningText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  darkText: {
    color: '#f1f5f9',
  },
  darkSubText: {
    color: '#94a3b8',
  },
  darkLabel: {
    color: '#94a3b8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  darkInput: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 16,
  },
  reportButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
});