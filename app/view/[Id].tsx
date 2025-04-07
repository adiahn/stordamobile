import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDeviceStore } from '../store/store';

export default function DeviceDetailsScreen() {
  const params = useLocalSearchParams();
  const storeDevice = useDeviceStore((state) => state.selectedDevice);

  // Potential error: Overwriting the previous device variable
  // Fixed: Rename the second declaration and use params for type conversion
  const deviceFromParams = {
    name: params.name,
    imei: params.imei,
    macAddress: params.macAddress,
    id: params.id,
    ownership: params.ownership === 'true', // Convert string to boolean
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{deviceFromParams.name}</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detail}>IMEI: {deviceFromParams.imei}</Text>
        <Text style={styles.detail}>MAC Address: {deviceFromParams.macAddress}</Text>
        <Text style={styles.detail}>Device ID: {deviceFromParams.id}</Text>
        <Text style={styles.detail}>
          Ownership: {deviceFromParams.ownership ? 'Owned' : 'Unowned'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailContainer: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 15,
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
});