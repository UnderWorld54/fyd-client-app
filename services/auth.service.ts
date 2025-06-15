import axios from 'axios';
import env from '../config/env';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

const API_URL = env.API_URL + '/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Tentative de connexion à:', `${API_URL}/login`);
      console.log('Données envoyées:', credentials);
      
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('Réponse du serveur:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
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
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
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

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
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