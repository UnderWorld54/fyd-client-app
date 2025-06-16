import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import env from '../config/env';

const API_URL = env.API_URL + '/users';
const USER_KEY = 'user_data';

class UserService {
  async updateUser(id: string, data: { [key: string]: any }) {
    try {
      console.log('[updateUser] id:', id);
      console.log('[updateUser] data envoyée:', data);
      const response = await axios.put(`${API_URL}/${id}`, data);
      console.log('[updateUser] réponse serveur:', response.data);
      if (response.data.success) {
        // Mettre à jour les données utilisateur stockées si c'est l'utilisateur courant
        const currentUserStr = await SecureStore.getItemAsync(USER_KEY);
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.data.user.id === id) {
            currentUser.data.user = { ...currentUser.data.user, ...data };
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(currentUser));
          }
        }
      }
      return response.data;
    } catch (error) {
      console.error('[updateUser] erreur:', error);
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    const response = await axios.delete(`${API_URL}/me`);
    if (response.data.success) {
      await SecureStore.deleteItemAsync(USER_KEY);
      delete axios.defaults.headers.common['Authorization'];
    } else {
      throw new Error(response.data.message || 'Erreur lors de la suppression du compte');
    }
  }
}

export const userService = new UserService(); 