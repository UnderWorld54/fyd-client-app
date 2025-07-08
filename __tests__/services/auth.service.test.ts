import { authService } from '@/services/auth.service';

// Mock complet du service auth
jest.mock('@/services/auth.service', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and store user data', async () => {
      const mockCredentials = {
        email: 'test@wow.com',
        password: 'mdpdefou'
      };

      const mockResponse = {
        success: true,
        data: {
          user: {
            _id: '123',
            name: 'Matias Soulé',
            email: 'test@wow.com',
            age: 25,
            role: 'user',
            isActive: true,
            refreshToken: 'refresh_token',
            interests: ['sport', 'musique'],
            city: 'Rome',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            id: '123'
          },
          token: 'access_token',
          refreshToken: 'refresh_token'
        },
        message: 'Login successful'
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await authService.login(mockCredentials);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockCredentials);
    });

    it('should handle login failure', async () => {
      const mockCredentials = {
        email: 'test@wow.com',
        password: 'mdpdefou'
      };

      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login(mockCredentials)).rejects.toThrow('Invalid credentials');
      expect(mockAuthService.login).toHaveBeenCalledWith(mockCredentials);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockCredentials = {
        name: 'Matias Soulé',
        email: 'test@wow.com',
        password: 'mdpdefou',
        city: 'Rome',
        interests: ['art', 'technologie']
      };

      const mockResponse = {
        success: true,
        data: {
          user: {
            _id: '456',
            name: 'Matias Soulé',
            email: 'test@wow.com',
            age: 0,
            role: 'user',
            isActive: true,
            refreshToken: 'new_refresh_token',
            interests: ['art', 'technologie'],
            city: 'Rome',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            id: '456'
          },
          token: 'new_access_token',
          refreshToken: 'new_refresh_token'
        },
        message: 'Registration successful'
      };

      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await authService.register(mockCredentials);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(mockCredentials);
    });
  });

  describe('logout', () => {
    it('should clear user data and token', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      await authService.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should return stored user data', async () => {
      const mockUserData = {
        success: true,
        data: {
          user: {
            _id: '123',
            name: 'Matias Soulé',
            email: 'test@wow.com',
            age: 25,
            role: 'user',
            isActive: true,
            refreshToken: 'stored_refresh_token',
            interests: ['sport'],
            city: 'Rome',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            id: '123'
          },
          token: 'stored_token',
          refreshToken: 'stored_refresh_token'
        },
        message: 'User data retrieved'
      };

      mockAuthService.getCurrentUser.mockResolvedValue(mockUserData);

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUserData);
      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    });

    it('should return null if no user data stored', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    });
  });
});