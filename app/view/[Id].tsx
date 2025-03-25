import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function DeviceDetailsScreen() {
  const params = useLocalSearchParams();

  // Convert string params back to their correct types if needed
  const device = {
    name: params.name,
    imei: params.imei,
    macAddress: params.macAddress,
    id: params.id,
    ownership: params.ownership === 'true', // Convert string to boolean
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{device.name}</Text>
      <Text style={styles.detail}>IMEI: {device.imei}</Text>
      <Text style={styles.detail}>MAC Address: {device.macAddress}</Text>
      <Text style={styles.detail}>Device ID: {device.id}</Text>
      <Text style={styles.detail}>
        Ownership: {device.ownership ? 'Owned' : 'Unowned'}
      </Text>
    </View>
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
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
});
