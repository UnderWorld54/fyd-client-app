import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import env from '../config/env';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

const API_URL = env.API_URL + '/auth';
const USER_KEY = 'user_data';

// Configuration d'Axios
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et que nous n'avons pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userStr = await SecureStore.getItemAsync(USER_KEY);
        if (!userStr) {
          throw new Error('Pas de données utilisateur');
        }

        const userData = JSON.parse(userStr);
        const response = await axios.post(`${API_URL}/refresh`, {
          refreshToken: userData.data.user.refreshToken
        });

        if (response.data.success) {
          // Mettre à jour le token dans le stockage
          const updatedUserData = {
            ...userData,
            data: {
              ...userData.data,
              token: response.data.token,
              user: {
                ...userData.data.user,
                refreshToken: response.data.refreshToken
              }
            }
          };
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUserData));

          // Mettre à jour le token dans la requête originale
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token:', refreshError);
        // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
        await authService.logout();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Tentative de connexion à:', `${API_URL}/login`);
      console.log('Données envoyées:', credentials);
      
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('Réponse du serveur:', response.data);
      
      if (response.data.success) {
        try {
          // Stocker la réponse complète
          const dataToStore = JSON.stringify(response.data);
          console.log('Données à stocker:', dataToStore);
          await SecureStore.setItemAsync(USER_KEY, dataToStore);
          
          // Vérifier que les données ont été stockées
          const storedData = await SecureStore.getItemAsync(USER_KEY);
          console.log('Données stockées dans SecureStore:', storedData);
          
          // Configurer le token par défaut pour les futures requêtes
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        } catch (storageError) {
          console.error('Erreur lors du stockage des données:', storageError);
        }
      }
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (axios.isAxiosError(error)) {
        console.error('URL appelée:', error.config?.url);
        console.error('Méthode:', error.config?.method);
        console.error('Headers:', error.config?.headers);
        console.error('Données envoyées:', error.config?.data);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Données de réponse:', error.response.data);
        }
      }
      throw this.handleError(error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log('Tentative d\'inscription à:', `${API_URL}/register`);
      console.log('Données envoyées:', credentials);
      
      const response = await axios.post(`${API_URL}/register`, credentials);
      console.log('Réponse du serveur:', response.data);
      
      if (response.data.success) {
        try {
          // Stocker la réponse complète
          const dataToStore = JSON.stringify(response.data);
          console.log('Données à stocker:', dataToStore);
          await SecureStore.setItemAsync(USER_KEY, dataToStore);
          
          // Vérifier que les données ont été stockées
          const storedData = await SecureStore.getItemAsync(USER_KEY);
          console.log('Données stockées dans SecureStore:', storedData);
          
          // Configurer le token par défaut pour les futures requêtes
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        } catch (storageError) {
          console.error('Erreur lors du stockage des données:', storageError);
        }
      }
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (axios.isAxiosError(error)) {
        console.error('URL appelée:', error.config?.url);
        console.error('Méthode:', error.config?.method);
        console.error('Headers:', error.config?.headers);
        console.error('Données envoyées:', error.config?.data);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Données de réponse:', error.response.data);
        }
      }
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
      // Supprimer le token des headers Axios
      delete axios.defaults.headers.common['Authorization'];
      console.log('Déconnexion réussie, données supprimées de SecureStore');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    try {
      const userStr = await SecureStore.getItemAsync(USER_KEY);
      console.log('Données récupérées de SecureStore:', userStr);
      
      if (userStr) {
        const userData = JSON.parse(userStr);
        console.log('Données utilisateur parsées:', userData);
        
        // Configurer le token pour les futures requêtes
        if (userData.data?.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${userData.data.token}`;
        }
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  async updateInterests(interests: string[]): Promise<void> {
    try {
      console.log('Mise à jour des centres d\'intérêts:', interests);
      const response = await axios.put(`${API_URL}/users/interests`, { interests });
      console.log('Réponse de mise à jour des centres d\'intérêts:', response.data);

      if (response.data.success) {
        // Mettre à jour les données utilisateur stockées
        const currentUser = await this.getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            data: {
              ...currentUser.data,
              user: {
                ...currentUser.data.user,
                interests
              }
            }
          };
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
        }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour des centres d\'intérêts');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des centres d\'intérêts:', error);
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      console.log('Suppression du compte utilisateur');
      const response = await axios.delete(`${API_URL}/users/me`);
      console.log('Réponse de suppression du compte:', response.data);

      if (response.data.success) {
        // Supprimer les données utilisateur stockées
        await SecureStore.deleteItemAsync(USER_KEY);
        // Supprimer le token d'authentification
        delete axios.defaults.headers.common['Authorization'];
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression du compte');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw error;
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui est hors de la plage 2xx
      return new Error(error.response.data.message || 'Une erreur est survenue');
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Détails de la requête:', error.request);
      return new Error('Aucune réponse du serveur');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
      return new Error('Erreur de configuration de la requête');
    }
  }
}

export const authService = new AuthService(); 