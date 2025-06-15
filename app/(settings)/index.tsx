import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Header title="Paramètres" />
      <View style={styles.content}>
        <Text style={styles.text}>Paramètres à venir...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat',
  },
}); 