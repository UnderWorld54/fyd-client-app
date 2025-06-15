import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';

export const options = {
  headerShown: false,
};

export default function TermsScreen() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      // TODO: Envoyer l'acceptation au backend
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Termes d'utilisation" />
      
      <ScrollView style={styles.termsContainer}>
        <Text style={styles.termsText}>
          En utilisant cette application, vous acceptez les conditions suivantes :

          1. Confidentialité des données
          Vos données personnelles seront traitées conformément à notre politique de confidentialité.

          2. Utilisation du service
          Vous vous engagez à utiliser l&apos;application de manière responsable et à respecter les autres utilisateurs.

          3. Propriété intellectuelle
          Tout le contenu de l&apos;application est protégé par des droits d&apos;auteur.

          4. Modifications des conditions
          Nous nous réservons le droit de modifier ces conditions à tout moment.

          5. Limitation de responsabilité
          Nous ne pouvons être tenus responsables des dommages indirects résultant de l&apos;utilisation de l&apos;application.

          Pour plus d&apos;informations, veuillez consulter notre politique de confidentialité complète.
        </Text>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.checkbox, accepted && styles.checkboxSelected]}
          onPress={() => setAccepted(!accepted)}
        >
          <Text style={styles.checkboxText}>
            J&apos;accepte les termes d&apos;utilisation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !accepted && styles.buttonDisabled]}
          onPress={handleAccept}
          disabled={!accepted}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  termsContainer: {
    flex: 1,
    padding: 20,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  checkboxSelected: {
    backgroundColor: '#f0f0f0',
    borderColor: '#007AFF',
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
}); 