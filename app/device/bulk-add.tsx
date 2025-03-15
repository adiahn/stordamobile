import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Upload, Smartphone, Check, X } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { usePointsStore } from '../../store/points';

interface ScannedDevice {
  imei: string;
  status: 'pending' | 'added' | 'error';
  message?: string;
}

export default function BulkAddScreen() {
  const router = useRouter();
  const { points, usePoints } = usePointsStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([]);
  const [csvData, setCsvData] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    // Check if it looks like an IMEI (15-17 digits)
    if (/^\d{15,17}$/.test(data)) {
      // Check if already scanned
      if (!scannedDevices.some(device => device.imei === data)) {
        setScannedDevices([
          ...scannedDevices,
          { imei: data, status: 'pending' }
        ]);
      }
    }
  };

  const pickCSVFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) return;
      
      // In a real app, you would parse the CSV file here
      // For demo purposes, we'll just simulate some data
      const mockImeis = [
        '359269023456789',
        '351234567891234',
        '357123456789012',
        '356789012345678',
        '358901234567890'
      ];
      
      const newDevices = mockImeis.map(imei => ({ imei, status: 'pending' as const }));
      setScannedDevices([...scannedDevices, ...newDevices]);
      
      Alert.alert('Success', `Imported ${mockImeis.length} devices from CSV`);
    } catch (error) {
      Alert.alert('Error', 'Failed to import CSV file');
    }
  };

  const handleAddDevices = () => {
    const devicesToAdd = scannedDevices.filter(d => d.status === 'pending');
    const pointsNeeded = devicesToAdd.length * 100;
    
    if (devicesToAdd.length === 0) {
      Alert.alert('No Devices', 'There are no new devices to add');
      return;
    }
    
    if (points < pointsNeeded) {
      Alert.alert(
        'Insufficient Points', 
        `You need ${pointsNeeded} points to add ${devicesToAdd.length} devices. You currently have ${points} points.`
      );
      return;
    }
    
    // Process devices
    const updatedDevices = scannedDevices.map(device => {
      if (device.status === 'pending') {
        return { ...device, status: 'added' };
      }
      return device;
    });
    
    // Use points
    usePoints(pointsNeeded);
    setScannedDevices(updatedDevices);
    
    Alert.alert(
      'Success', 
      `Added ${devicesToAdd.length} devices successfully. Used ${pointsNeeded} points.`
    );
  };

  const removeDevice = (imei: string) => {
    setScannedDevices(scannedDevices.filter(device => device.imei !== imei));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#334155" />
        </Pressable>
        <Text style={styles.headerTitle}>Bulk Device Management</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Add Multiple Devices</Text>
          <Text style={styles.infoText}>
            Scan IMEI codes or import a CSV file to add multiple devices at once.
            Each device costs 100 points to add.
          </Text>
          <Text style={styles.pointsInfo}>
            Your current points: <Text style={styles.pointsAmount}>{points}</Text>
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <Pressable 
            style={[styles.actionButton, styles.scanButton]}
            onPress={() => setScanning(true)}
          >
            <Camera size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Scan IMEI</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, styles.importButton]}
            onPress={pickCSVFile}
          >
            <Upload size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Import CSV</Text>
          </Pressable>
        </View>

        {scanning && (
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={styles.scanner}
            />
            <Pressable 
              style={styles.closeScannerButton}
              onPress={() => setScanning(false)}
            >
              <Text style={styles.closeScannerText}>Stop Scanning</Text>
            </Pressable>
          </View>
        )}

        {scannedDevices.length > 0 && (
          <View style={styles.devicesSection}>
            <Text style={styles.devicesSectionTitle}>
              Devices ({scannedDevices.length})
            </Text>
            
            {scannedDevices.map((device, index) => (
              <View key={`${device.imei}_${index}`} style={styles.deviceItem}>
                <View style={styles.deviceInfo}>
                  <Smartphone size={20} color="#64748b" />
                  <Text style={styles.deviceImei}>{device.imei}</Text>
                </View>
                
                <View style={styles.deviceActions}>
                  {device.status === 'added' ? (
                    <View style={styles.addedBadge}>
                      <Check size={16} color="#10b981" />
                      <Text style={styles.addedText}>Added</Text>
                    </View>
                  ) : (
                    <Pressable 
                      style={styles.removeButton}
                      onPress={() => removeDevice(device.imei)}
                    >
                      <X size={16} color="#f43f5e" />
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
            
            {scannedDevices.some(d => d.status === 'pending') && (
              <Pressable 
                style={styles.addAllButton}
                onPress={handleAddDevices}
              >
                <Text style={styles.addAllButtonText}>
                  Add All Devices ({scannedDevices.filter(d => d.status === 'pending').length})
                </Text>
              </Pressable>
            )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  pointsInfo: {
    fontSize: 14,
    color: '#64748b',
  },
  pointsAmount: {
    fontWeight: '600',
    color: '#6366f1',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  scanButton: {
    backgroundColor: '#6366f1',
  },
  importButton: {
    backgroundColor: '#8b5cf6',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 15,
  },
  scannerContainer: {
    height: 300,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  closeScannerButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeScannerText: {
    color: '#f43f5e',
    fontWeight: '600',
  },
  devicesSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 40,
  },
  devicesSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deviceImei: {
    fontSize: 15,
    color: '#334155',
  },
  deviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  addedText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  addAllButton: {
    backgroundColor: '#6366f1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addAllButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
}); 