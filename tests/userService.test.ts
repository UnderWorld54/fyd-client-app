import { userService } from '@/services/user.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as SecureStore from 'expo-secure-store';

const mock = new MockAdapter(axios);

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const USER_KEY = 'user_data';

describe('UserService', () => {
  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  describe('updateUser', () => {
    const userId = '123';
    const updateData = { name: 'New Name', city: 'New City' };
    const storedUser = {
      data: {
        user: {
          id: userId,
          name: 'Old Name',
          city: 'Old City',
        },
      },
    };

    it('should update user and update stored user data if id matches', async () => {
      mock.onPut(`${userId}`).reply(200, { success: true, data: {} });
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(storedUser));
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      // Чтобы mock отработал корректно, нужно точный URL
      mock.onPut(`${userId}`).reply(200, { success: true, data: {} });

      // Правильно URL с base
      mock.onPut(`${axios.defaults.baseURL || ''}/users/${userId}`).reply(200, { success: true, data: {} });

      // Но в тестах лучше использовать regex:
      mock.onPut(new RegExp(`/users/${userId}$`)).reply(200, { success: true, data: {} });

      // Исправим, чтобы mock отрабатывал:
      mock.onPut(new RegExp(`/users/${userId}$`)).reply(200, { success: true, data: {} });

      // Вызовем метод
      const result = await userService.updateUser(userId, updateData);

      expect(result).toEqual({ success: true, data: {} });
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(USER_KEY);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        USER_KEY,
        JSON.stringify({
          data: {
            user: {
              id: userId,
              name: 'New Name',
              city: 'New City',
            },
          },
        })
      );
    });

    it('should update user and NOT update stored data if id does not match', async () => {
      mock.onPut(new RegExp(`/users/${userId}$`)).reply(200, { success: true, data: {} });
      // Сохраняемый пользователь другой id
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({
          data: {
            user: { id: 'other_id', name: 'Someone', city: 'City' },
          },
        })
      );

      const result = await userService.updateUser(userId, updateData);

      expect(result).toEqual({ success: true, data: {} });
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(USER_KEY);
      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
    });

    it('should throw error if axios.put fails', async () => {
      mock.onPut(new RegExp(`/users/${userId}$`)).networkError();

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow();
    });
  });

  describe('deleteAccount', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  
    afterEach(() => {
      (console.error as jest.Mock).mockRestore();
    });
  
    it('should delete stored user and clear authorization header on success', async () => {
      axios.defaults.headers.common['Authorization'] = 'Bearer token';
      mock.onDelete(new RegExp(`/users/me$`)).reply(200, { success: true });
  
      await userService.deleteAccount();
  
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(USER_KEY);
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
    });
  
    it('should log error and not throw on failure response', async () => {
      const errorMessage = 'Impossible de supprimer le compte';
      mock.onDelete(new RegExp(`/users/me$`)).reply(400, { success: false, message: errorMessage });
  
      await userService.deleteAccount();
  
      expect(console.error).toHaveBeenCalledWith('[deleteAccount] erreur:', expect.any(Error));
    });
  
    it('should log error and not throw on network error', async () => {
      mock.onDelete(new RegExp(`/users/me$`)).networkError();
  
      await userService.deleteAccount();
  
      expect(console.error).toHaveBeenCalledWith('[deleteAccount] erreur:', expect.any(Error));
    });
  });  
});
