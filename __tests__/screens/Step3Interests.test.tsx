import Step3Interests from '@/app/auth/register/step3-interests';
import { useRegistration } from '@/contexts/RegistrationContext';
import { authService } from '@/services/auth.service';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

jest.mock('../../services/auth.service');
jest.mock('../../contexts/RegistrationContext');

// Mock Alert.alert
const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const mockRegistrationData = {
  username: 'TestUser',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  birthDate: '2000-01-01',
  acceptedTerms: true,
  interests: [],
  city: 'Paris'
};

describe('Step3Interests Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAlert.mockClear();
    (useRegistration as jest.Mock).mockReturnValue({
      data: mockRegistrationData,
      setData: jest.fn()
    });
  });

  it('renders all interest options', () => {
    const { getByText } = render(<Step3Interests />);
    
    expect(getByText('Sport')).toBeTruthy();
    expect(getByText('Musique')).toBeTruthy();
    expect(getByText('Cinéma')).toBeTruthy();
    expect(getByText('Lecture')).toBeTruthy();
    expect(getByText('Cuisine')).toBeTruthy();
    expect(getByText('Danse')).toBeTruthy();
    expect(getByText('Art')).toBeTruthy();
    expect(getByText('Technologie')).toBeTruthy();
    expect(getByText('Nature')).toBeTruthy();
    expect(getByText('Photographie')).toBeTruthy();
  });

  it('shows error when no interests are selected', async () => {
    const { getByText } = render(<Step3Interests />);
    
    const finishButton = getByText('Terminer');
    fireEvent.press(finishButton);

    await waitFor(() => {
      expect(getByText('Veuillez sélectionner au moins un centre d\'intérêt')).toBeTruthy();
    });
  });

  it('toggles interest selection', () => {
    const { getByText } = render(<Step3Interests />);
    
    const sportButton = getByText('Sport');
    const musicButton = getByText('Musique');

    // Initially, buttons should have default background
    expect(sportButton.parent).toHaveStyle({ backgroundColor: '#fff' });
    expect(musicButton.parent).toHaveStyle({ backgroundColor: '#fff' });

    // Select Sport
    fireEvent.press(sportButton);
    expect(sportButton.parent).toHaveStyle({ backgroundColor: '#000' });

    // Select Music
    fireEvent.press(musicButton);
    expect(musicButton.parent).toHaveStyle({ backgroundColor: '#000' });

    // Deselect Sport
    fireEvent.press(sportButton);
    expect(sportButton.parent).toHaveStyle({ backgroundColor: '#fff' });
  });

  it('calls authService.register with correct data', async () => {
    const mockSetData = jest.fn();
    (useRegistration as jest.Mock).mockReturnValue({
      data: mockRegistrationData,
      setData: mockSetData
    });

    (authService.register as jest.Mock).mockResolvedValue({
      success: true,
      data: { user: { id: '123' }, token: 'token' }
    });

    const { getByText } = render(<Step3Interests />);
    
    // Select interests
    fireEvent.press(getByText('Sport'));
    fireEvent.press(getByText('Musique'));
    
    // Click finish
    const finishButton = getByText('Terminer');
    fireEvent.press(finishButton);

    await waitFor(() => {
      expect(mockSetData).toHaveBeenCalledWith({
        ...mockRegistrationData,
        interests: ['Sport', 'Musique']
      });

      expect(authService.register).toHaveBeenCalledWith({
        name: 'TestUser',
        email: 'test@example.com',
        password: 'password123',
        interests: ['Sport', 'Musique'],
        city: 'Paris'
      });

      expect(router.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error alert on registration failure', async () => {
    (authService.register as jest.Mock).mockRejectedValue(new Error('Registration failed'));

    const { getByText } = render(<Step3Interests />);
    
    // Select an interest
    fireEvent.press(getByText('Sport'));
    
    // Click finish
    const finishButton = getByText('Terminer');
    fireEvent.press(finishButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Erreur de connexion',
        'Registration failed'
      );
    });
  });

  it('clears error message when selecting an interest after error', async () => {
    const { getByText, queryByText } = render(<Step3Interests />);
    
    // Try to finish without selecting interests
    const finishButton = getByText('Terminer');
    fireEvent.press(finishButton);

    await waitFor(() => {
      expect(getByText('Veuillez sélectionner au moins un centre d\'intérêt')).toBeTruthy();
    });

    // Select an interest
    fireEvent.press(getByText('Sport'));

    // Error should be cleared
    expect(queryByText('Veuillez sélectionner au moins un centre d\'intérêt')).toBeFalsy();
  });

  it('maintains selected interests from registration context', () => {
    (useRegistration as jest.Mock).mockReturnValue({
      data: { ...mockRegistrationData, interests: ['1', '3'] },
      setData: jest.fn()
    });

    const { getByText } = render(<Step3Interests />);
    
    const sportButton = getByText('Sport');
    const cinemaButton = getByText('Cinéma');

    // These should be selected based on the IDs (1 = Sport, 3 = Cinéma)
    expect(sportButton.parent).toHaveStyle({ backgroundColor: '#000' });
    expect(cinemaButton.parent).toHaveStyle({ backgroundColor: '#000' });
  });
});