import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Header';
import { useRegistration } from '../../../contexts/RegistrationContext';

const INTERESTS = [
  'Concerts',
  'Théâtres',
  'Sports',
  'Ateliers',
  'Dance',
  'Cinema',
];

export default function Step3Interests() {
  const { data, setData } = useRegistration();
  const [selected, setSelected] = useState<string[]>(data.interests);
  const [error, setError] = useState('');

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
    setError('');
  };

  const handleValidate = () => {
    if (selected.length === 0) {
      setError('Veuillez sélectionner au moins un centre d\'intérêt');
      return;
    }

    const finalData = {
      ...data,
      interests: selected
    };
    
    setData(finalData);
    console.log('Données d\'inscription complètes:', finalData);
    // TODO: Envoyer les données au backend ou passer à la suite
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Header title="Nous avons besoin de te connaître !" />
      <Text style={styles.subtitle}>Selectionne tes centres d&apos;intérêts</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.interestsContainer}>
        {INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[styles.interestButton, selected.includes(interest) && styles.interestButtonSelected]}
            onPress={() => toggleInterest(interest)}
          >
            <Text style={[styles.interestText, selected.includes(interest) && styles.interestTextSelected]}>
              {interest}
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