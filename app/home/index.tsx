import Header from '@/components/Header';
import { authService } from '@/services/auth.service';
import { AuthResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSettingsPress = () => {
    router.push('/(settings)');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Accueil" 
        rightComponent={
          <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text style={styles.welcomeText}>
            Bienvenue {user?.data?.user?.name || 'Utilisateur'}
          </Text>
        )}
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
  welcomeText: {
    fontSize: 24,
    color: '#333',
    fontFamily: 'MontserratBold',
  },
  settingsButton: {
    padding: 8,
  },
}); 