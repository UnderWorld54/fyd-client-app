import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Header from '../../components/Header';
import { authService } from '../../services/auth.service';

export const options = {
  headerShown: false,
};

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFields = () => {
    const errors = {
      email: '',
      password: '',
    };
    let hasErrors = false;

    if (!email.trim()) {
      errors.email = 'L\'email est requis';
      hasErrors = true;
    } else if (!validateEmail(email)) {
      errors.email = 'Format d\'email invalide';
      hasErrors = true;
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis';
      hasErrors = true;
    }

    setFieldErrors(errors);
    return !hasErrors;
  };

  const handleSignIn = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const response = await authService.login({ email, password });
      console.log('Connexion réussie:', response);
      router.replace('/home');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert(
        'Erreur de connexion',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Content de te revoir !" />
      <View style={styles.form}>
        <TextInput
          style={[styles.input, fieldErrors.email ? styles.inputError : null]}
          placeholder="E-mail"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setFieldErrors({ ...fieldErrors, email: '' });
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {fieldErrors.email ? <Text style={styles.errorText}>{fieldErrors.email}</Text> : null}
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }, fieldErrors.password ? styles.inputError : null]}
            placeholder="Mot de passe"
            placeholderTextColor="#BDBDBD"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setFieldErrors({ ...fieldErrors, password: '' });
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#BDBDBD" />
          </TouchableOpacity>
        </View>
        {fieldErrors.password ? <Text style={styles.errorText}>{fieldErrors.password}</Text> : null}
        
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, (!email || !password) && styles.buttonDisabled]} 
          onPress={handleSignIn}
          disabled={!email || !password}
        >
          <Text style={[styles.buttonText, (!email || !password) && styles.buttonTextDisabled]}>Connexion</Text>
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
  inputError: {
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    marginBottom: 8,
    fontFamily: 'Montserrat',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonTextDisabled: {
    color: '#666666',
  },
}); 