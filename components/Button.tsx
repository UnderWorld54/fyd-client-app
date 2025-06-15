import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', style }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'secondary' && styles.secondary, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textSecondary: {
    color: '#000',
  },
}); 