import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Header from '../../components/Header';

// Liste des villes
const cities = [
  'Paris',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Lille',
];

// Liste des centres d'intérêt
const interests = [
  'Sport',
  'Danse',
  'Musique',
  'Cinéma',
  'Lecture',
  'Cuisine',
  'Voyage',
  'Art',
];

export const options = {
  headerShown: false,
};

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: new Date(),
    city: '',
    selectedInterests: [] as string[],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSignUp = async () => {
    try {
      // TODO: Implémenter l'appel API vers le backend
      console.log('Données du formulaire:', formData);
      
      // Redirection vers la page des termes d'utilisation
      router.push('/auth/terms');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Inscription" />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={formData.firstName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={formData.lastName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>Date de naissance: {formData.birthDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.birthDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFormData(prev => ({ ...prev, birthDate: selectedDate }));
              }
            }}
          />
        )}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.city}
            onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
          >
            <Picker.Item label="Sélectionnez une ville" value="" />
            {cities.map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Centres d&apos;intérêt</Text>
        <View style={styles.interestsContainer}>
          {interests.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestButton,
                formData.selectedInterests.includes(interest) && styles.interestButtonSelected,
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[
                styles.interestText,
                formData.selectedInterests.includes(interest) && styles.interestTextSelected,
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'MontserratBold',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  interestButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
  },
  interestButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  interestText: {
    color: '#333',
    fontFamily: 'Montserrat',
  },
  interestTextSelected: {
    color: '#fff',
    fontFamily: 'MontserratBold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 15,
    fontFamily: 'Montserrat',
  },
}); 