import { userService } from '@/services/user.service';
import { mockAuthResponse } from '../test-utils';

// Mock complet du service utilisateur
jest.mock('@/services/user.service', () => ({
  userService: {
    updateUser: jest.fn(),
    deleteAccount: jest.fn(),
  },
}));

const mockUserService = userService as jest.Mocked<typeof userService>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '123';
      const updateData = { interests: ['sport', 'art'], city: 'Lyon' };
      
      const mockResponse = {
        success: true,
        data: { ...mockAuthResponse.data.user, ...updateData },
        message: 'User updated successfully'
      };

      mockUserService.updateUser.mockResolvedValue(mockResponse);

      const result = await userService.updateUser(userId, updateData);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, updateData);
    });

    it('should not update SecureStore if updating different user', async () => {
      const differentUserId = '456';
      const updateData = { interests: ['cuisine'] };
      
      const mockResponse = {
        success: true,
        data: { id: differentUserId, ...updateData },
        message: 'User updated successfully'
      };

      mockUserService.updateUser.mockResolvedValue(mockResponse);

      const result = await userService.updateUser(differentUserId, updateData);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(differentUserId, updateData);
    });

    it('should handle update failure', async () => {
      const userId = '123';
      const updateData = { city: 'Invalid City' };

      mockUserService.updateUser.mockRejectedValue(new Error('Invalid city'));

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow('Invalid city');
      expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, updateData);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      mockUserService.deleteAccount.mockResolvedValue(undefined);

      await userService.deleteAccount();

      expect(mockUserService.deleteAccount).toHaveBeenCalled();
    });

    it('should throw error if deletion fails', async () => {
      mockUserService.deleteAccount.mockRejectedValue(new Error('Cannot delete account'));

      await expect(userService.deleteAccount()).rejects.toThrow('Cannot delete account');
      expect(mockUserService.deleteAccount).toHaveBeenCalled();
    });

    it('should handle server error', async () => {
      mockUserService.deleteAccount.mockRejectedValue(new Error('Server error'));

      await expect(userService.deleteAccount()).rejects.toThrow('Server error');
      expect(mockUserService.deleteAccount).toHaveBeenCalled();
    });
  });
});