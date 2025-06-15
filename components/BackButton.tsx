import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.button} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={28} color="#222" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f5f7fa',
    borderRadius: 16,
    padding: 8,
    alignSelf: 'center',
  },
}); 