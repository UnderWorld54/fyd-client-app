import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function BackButton() {
  const canGoBack = router.canGoBack();

  if (!canGoBack) {
    return <View style={styles.placeholder} />;
  }

  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.button}>
      <Ionicons name="chevron-back" size={24} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
}); 