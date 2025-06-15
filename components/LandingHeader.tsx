import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LandingHeader() {
  const router = useRouter();
  
  return (
    <View style={styles.header}>
      <View style={{ width: 40 }} />
      <View style={{ flex: 1 }} />
      <TouchableOpacity 
        style={styles.settingsButton} 
        onPress={() => router.push('/(settings)')}
      >
        <Ionicons name="settings-outline" size={24} color="#222" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  settingsButton: {
    backgroundColor: '#f5f7fa',
    borderRadius: 16,
    padding: 8,
    alignSelf: 'center',
  },
}); 