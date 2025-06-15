import Header from '@/components/Header';
import InterestsSelector from '@/components/InterestsSelector';
import { authService } from '@/services/auth.service';
import { AuthResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setSelectedInterests(userData?.data?.user?.interests || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      Alert.alert('Erreur', 'Impossible de charger les données utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestsChange = async (interests: string[]) => {
    try {
      setSelectedInterests(interests);
      await authService.updateInterests(interests);
      Alert.alert('Succès', 'Centres d\'intérêts mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des centres d\'intérêts:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour les centres d\'intérêts');
      loadUserData();
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/main');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      router.replace('/main');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression du compte');
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Suppression du compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmation finale',
              'Cette action supprimera définitivement votre compte et toutes vos données. Êtes-vous absolument sûr ?',
              [
                {
                  text: 'Annuler',
                  style: 'cancel',
                },
                {
                  text: 'Oui, supprimer',
                  style: 'destructive',
                  onPress: handleDeleteAccount,
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Paramètres" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <LinearGradient
            colors={['#FF8989', '#FEC180']}
            style={styles.profileHeader}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.data?.user?.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            </View>
            <Text style={styles.userName}>{user?.data?.user?.name || 'Chargement...'}</Text>
            <Text style={styles.userEmail}>{user?.data?.user?.email || 'Chargement...'}</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart-outline" size={24} color="#4c669f" />
            <Text style={styles.sectionTitle}>Centres d&apos;intérêts</Text>
          </View>
          <InterestsSelector
            interests={[]}
            selectedInterests={selectedInterests}
            onInterestsChange={handleInterestsChange}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#4c669f" />
            <Text style={styles.sectionTitle}>Sécurité</Text>
          </View>
          <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={24} color="#666" />
            <Text style={styles.menuItemText}>Se déconnecter</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.dangerZone}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning-outline" size={24} color="#d32f2f" />
            <Text style={[styles.sectionTitle, styles.dangerZoneTitle]}>Zone dangereuse</Text>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDeleteAccount}>
            <Ionicons name="trash-outline" size={24} color="#fff" style={styles.deleteButtonIcon} />
            <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileHeader: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'MontserratBold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'MontserratBold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Montserrat',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
    color: '#333',
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Montserrat',
    marginLeft: 12,
  },
  dangerZone: {
    backgroundColor: '#fff5f5',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  dangerZoneTitle: {
    color: '#d32f2f',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonIcon: {
    marginRight: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
}); 