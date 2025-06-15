import { authService } from '@/services/auth.service';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Header';
import { useRegistration } from '../../../contexts/RegistrationContext';
import { Interest } from '../../../types';

// Mock data pour les intérêts
const MOCK_INTERESTS: Interest[] = [
  { id: '1', name: 'Sport' },
  { id: '2', name: 'Musique' },
  { id: '3', name: 'Cinéma' },
  { id: '4', name: 'Lecture' },
  { id: '5', name: 'Cuisine' },
  { id: '6', name: 'Danse' },
  { id: '7', name: 'Art' },
  { id: '8', name: 'Technologie' },
  { id: '9', name: 'Nature' },
  { id: '10', name: 'Photographie' }
];

export default function Step3Interests() {
  const { data, setData } = useRegistration();
  const [selected, setSelected] = useState<string[]>(data.interests);
  const [error, setError] = useState('');

  const toggleInterest = (interestId: string) => {
    setSelected((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
    setError('');
  };

  const handleValidate = async () => {
    if (selected.length === 0) {
      setError('Veuillez sélectionner au moins un centre d&apos;intérêt');
      return;
    }

    // Convertir les IDs en noms
    const selectedInterests = selected.map(id => 
      MOCK_INTERESTS.find(interest => interest.id === id)?.name || ''
    ).filter(name => name !== '');

    const finalData = {
      ...data,
      interests: selectedInterests
    };
    
    setData(finalData);

    if(!finalData){
      return;
    }

    try {
      const response = await authService.register({
        name: finalData.username,
        email: finalData.email,
        password: finalData.password,
        interests: finalData.interests,
        city: finalData.city
      });
      console.log('Inscription réussie:', response);
      router.replace('/home');
    } catch (error) {
      console.error('Erreur lors de l&apos;inscription:', error);
      Alert.alert(
        'Erreur de connexion',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion'
      );
    }

    console.log('Données d&apos;inscription complètes:', finalData);
  };

  return (
    <View style={styles.container}>
      <Header title="Nous avons besoin de te connaître !" />
      <Text style={styles.subtitle}>Selectionne tes centres d&apos;intérêts</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.interestsContainer}>
        {MOCK_INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[styles.interestButton, selected.includes(interest.id) && styles.interestButtonSelected]}
            onPress={() => toggleInterest(interest.id)}
          >
            <Text style={[styles.interestText, selected.includes(interest.id) && styles.interestTextSelected]}>
              {interest.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleValidate}>
        <Text style={styles.buttonText}>Terminer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  subtitle: {
    fontFamily: 'MontserratBold',
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff0000',
    fontFamily: 'Montserrat',
    fontSize: 14,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  interestButton: {
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 4,
    backgroundColor: '#fff',
  },
  interestButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  interestText: {
    color: '#222',
    fontFamily: 'Montserrat',
    fontSize: 16,
  },
  interestTextSelected: {
    color: '#fff',
    fontFamily: 'MontserratBold',
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'MontserratBold',
    fontWeight: 'bold',
  },
}); 