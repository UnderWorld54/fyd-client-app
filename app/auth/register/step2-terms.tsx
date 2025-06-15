import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/Header';
import { useRegistration } from '../../../contexts/RegistrationContext';

export default function Step2Terms() {
  const { data, setData } = useRegistration();
  const [accepted, setAccepted] = useState(data.acceptedTerms);

  const handleNext = () => {
    setData({ acceptedTerms: accepted });
    router.push('./step3-interests');
  };

  return (
    <View style={styles.container}>
      <Header title="Bienvenue !" />
      <Text style={styles.subtitle}>
        Avant tout choses, tu retrouvera ici toute les réglementation
      </Text>
      <Text style={styles.text}>Il vas falloir que tu acceptes !{"\n"}
Grâce au information récolter tu vas pouvoir avoir ton calendrier personnalisé !{"\n"}
      </Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, accepted && styles.checkboxChecked]}
          onPress={() => setAccepted(!accepted)}
        >
          {accepted && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>J&apos;accepte les conditions d&apos;utilisation</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, !accepted && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!accepted}
      >
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
  subtitle: {
    fontFamily: 'MontserratBold',
    fontSize: 22,
    marginBottom: 12,
  },
  text: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#222',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontFamily: 'Montserrat',
    fontSize: 14,
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'MontserratBold',
    fontWeight: 'bold',
  },
}); 