import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Header';
import { useRegistration } from '../../../contexts/RegistrationContext';

const FRENCH_CITIES = [
  'Paris',
  'Marseille',
  'Lyon',
  'Toulouse',
  'Nice',
  'Nantes',
  'Strasbourg',
  'Montpellier',
  'Bordeaux',
  'Lille',
  'Rennes',
  'Reims',
  'Le Havre',
  'Saint-Étienne',
  'Toulon',
  'Grenoble',
  'Dijon',
  'Angers',
  'Nîmes',
  'Villeurbanne'
];

export default function Step1UserInfo() {
  const { data, setData } = useRegistration();
  const [local, setLocal] = useState({
    username: data.username,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    birthDate: data.birthDate ? new Date(data.birthDate) : new Date(),
    city: data.city || 'Paris', // Ville par défaut
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
  });

  const filteredCities = FRENCH_CITIES.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFields = () => {
    const errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      city: '',
    };
    let hasErrors = false;

    if (!local.username.trim()) {
      errors.username = 'Le nom d\'utilisateur est requis';
      hasErrors = true;
    }

    if (!local.email.trim()) {
      errors.email = 'L\'email est requis';
      hasErrors = true;
    } else if (!validateEmail(local.email)) {
      errors.email = 'Format d\'email invalide';
      hasErrors = true;
    }

    if (!local.password) {
      errors.password = 'Le mot de passe est requis';
      hasErrors = true;
    } else if (local.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      hasErrors = true;
    }

    if (!local.confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise';
      hasErrors = true;
    } else if (local.password !== local.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      hasErrors = true;
    }

    if (!local.city) {
      errors.city = 'La ville est requise';
      hasErrors = true;
    }

    setFieldErrors(errors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (!validateFields()) {
      return;
    }
    setData({
      ...local,
      birthDate: local.birthDate.toISOString(),
    });
    router.push('./step2-terms');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setLocal({ ...local, birthDate: selectedDate });
      setFieldErrors({ ...fieldErrors, birthDate: '' });
    }
  };

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => {
        setLocal({ ...local, city: item });
        setShowCityPicker(false);
        setSearchQuery('');
      }}
    >
      <Text style={styles.cityItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="C'est ici que tout commence !" />
      <TextInput
        style={[styles.input, fieldErrors.username ? styles.inputError : null]}
        placeholder="Nom d'utilisateur"
        value={local.username}
        onChangeText={username => {
          setLocal({ ...local, username });
          setFieldErrors({ ...fieldErrors, username: '' });
        }}
      />
      {fieldErrors.username ? <Text style={styles.errorText}>{fieldErrors.username}</Text> : null}

      <TextInput
        style={[styles.input, fieldErrors.email ? styles.inputError : null]}
        placeholder="E-mail"
        value={local.email}
        onChangeText={email => {
          setLocal({ ...local, email });
          setFieldErrors({ ...fieldErrors, email: '' });
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {fieldErrors.email ? <Text style={styles.errorText}>{fieldErrors.email}</Text> : null}

      <TextInput
        style={[styles.input, fieldErrors.password ? styles.inputError : null]}
        placeholder="Mot de passe"
        value={local.password}
        onChangeText={password => {
          setLocal({ ...local, password });
          setFieldErrors({ ...fieldErrors, password: '' });
        }}
        secureTextEntry
      />
      {fieldErrors.password ? <Text style={styles.errorText}>{fieldErrors.password}</Text> : null}

      <TextInput
        style={[styles.input, fieldErrors.confirmPassword ? styles.inputError : null]}
        placeholder="Confirmation mot de passe"
        value={local.confirmPassword}
        onChangeText={confirmPassword => {
          setLocal({ ...local, confirmPassword });
          setFieldErrors({ ...fieldErrors, confirmPassword: '' });
        }}
        secureTextEntry
      />
      {fieldErrors.confirmPassword ? <Text style={styles.errorText}>{fieldErrors.confirmPassword}</Text> : null}
      
      <TouchableOpacity 
        style={[styles.input, fieldErrors.birthDate ? styles.inputError : null]} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {local.birthDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {fieldErrors.birthDate ? <Text style={styles.errorText}>{fieldErrors.birthDate}</Text> : null}

      <TouchableOpacity 
        style={[styles.input, fieldErrors.city ? styles.inputError : null]} 
        onPress={() => setShowCityPicker(true)}
      >
        <Text style={styles.dateText}>{local.city}</Text>
        <Ionicons name="chevron-down" size={24} color="#666" style={styles.cityIcon} />
      </TouchableOpacity>
      {fieldErrors.city ? <Text style={styles.errorText}>{fieldErrors.city}</Text> : null}

      {showDatePicker && (
        <DateTimePicker
          value={local.birthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <Modal
        visible={showCityPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une ville</Text>
              <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une ville..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredCities}
              renderItem={renderCityItem}
              keyExtractor={item => item}
              style={styles.cityList}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Suivant</Text>
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
  input: {
    width: '100%',
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Montserrat',
    marginBottom: 8,
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    marginBottom: 8,
    fontFamily: 'Montserrat',
    fontSize: 12,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  cityIcon: {
    marginLeft: 8,
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'MontserratBold',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  searchInput: {
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  cityList: {
    maxHeight: 400,
  },
  cityItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cityItemText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#333',
  },
}); 