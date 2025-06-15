import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Header from '../../components/Header';

export const options = {
  headerShown: false,
};

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    try {
      // TODO: Implémenter l'appel API vers le backend
      console.log('Données de connexion:', { email, password });
      
      // Redirection vers la page d'accueil après connexion réussie
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Content de te revoir !" />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Mot de passe"
            placeholderTextColor="#BDBDBD"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#BDBDBD" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>
          Tu n&apos;as pas encore de compte ?{' '}
          <Text style={styles.bottomLink} onPress={() => router.push('/auth/register/step1-user-info')}>
            Inscris-toi maintenant !
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'MontserratBold',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    marginTop: 8,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Montserrat',
    marginBottom: 16,
    borderWidth: 0,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  forgotContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#757575',
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'MontserratBold',
    fontWeight: 'bold',
  },
  bottomContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  bottomText: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#222',
  },
  bottomLink: {
    color: '#FF9900',
    fontFamily: 'MontserratBold',
  },
}); 