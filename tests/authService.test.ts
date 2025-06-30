import { authService } from '@/services/auth.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse, RegisterCredentials } from '../types';

const mock = new MockAdapter(axios);

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const dummyUser: AuthResponse = {
  success: true,
  message: 'Connexion réussie',
  data: {
    token: 'test-token',
    refreshToken: 'refresh-token',
    user: {
      _id: '1',
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      age: 25,
      role: 'user',
      isActive: true,
      refreshToken: 'refresh-token',
      interests: ['coding', 'reading'],
      city: 'Paris',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};

describe('AuthService', () => {

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login and store data', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      mock.onPost(/\/login/).reply(200, dummyUser);

      const result = await authService.login(credentials);
      
      expect(result).toEqual(dummyUser);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'user_data',
        JSON.stringify(dummyUser)
      );
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    });
  });

  describe('register', () => {
    it('should register and store data', async () => {
      const credentials: RegisterCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        city: 'Paris',
        interests: ['coding', 'reading']
      };
      
      mock.onPost(/\/register/).reply(200, dummyUser);

      const result = await authService.register(credentials);

      expect(result).toEqual(dummyUser);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'user_data',
        JSON.stringify(dummyUser)
      );
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    });
  });

  describe('logout', () => {
    it('should clear SecureStore and remove token', async () => {
      axios.defaults.headers.common['Authorization'] = 'Bearer test-token';
      
      await authService.logout();
      
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_data');
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from SecureStore', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(dummyUser)
      );

      const result = await authService.getCurrentUser();

      expect(result).toEqual(dummyUser);
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    });

    it('should return null if no user found', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });
});
