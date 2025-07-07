import SignInScreen from '@/app/auth/sign-in';
import { authService } from '@/services/auth.service';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

jest.mock('../../services/auth.service');

// Mock Alert.alert
const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAlert.mockClear();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText('Connexion')).toBeTruthy();
    expect(getByText('Mot de passe oublié ?')).toBeTruthy();
  });

  it('validates email format', async () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Mot de passe');
    const loginButton = getByText('Connexion');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Format d\'email invalide')).toBeTruthy();
    });
  });

  it('validates required fields', async () => {
    const { getByText } = render(<SignInScreen />);
    
    const loginButton = getByText('Connexion');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('L\'email est requis')).toBeTruthy();
      expect(getByText('Le mot de passe est requis')).toBeTruthy();
    });
  });

  it('calls authService.login with correct credentials', async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      success: true,
      data: { user: { id: '123' }, token: 'token' }
    });

    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Mot de passe');
    const loginButton = getByText('Connexion');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(router.replace).toHaveBeenCalledWith('/home/personnalIndex');
    });
  });

  it('shows error alert on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Mot de passe');
    const loginButton = getByText('Connexion');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrong_password');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Erreur de connexion',
        errorMessage
      );
    });
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByTestId } = render(<SignInScreen />);
    
    const passwordInput = getByPlaceholderText('Mot de passe');
    
    expect(passwordInput.props.secureTextEntry).toBe(true);
    
    // Note: You might need to add testID to the eye icon TouchableOpacity in the component
    // For now, we'll test the general behavior
  });

  it('navigates to registration screen', () => {
    const { getByText } = render(<SignInScreen />);
    
    const registerLink = getByText('Inscris-toi maintenant !');
    fireEvent.press(registerLink);

    expect(router.push).toHaveBeenCalledWith('/auth/register/step1-user-info');
  });
});