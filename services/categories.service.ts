import axios from 'axios';
import env from '../config/env';
import { Interest } from '../types';

const API_URL = env.API_URL + '/api/categories';

class CategoriesService {
  async getInterests(): Promise<Interest[]> {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data.message || 'Une erreur est survenue');
    } else if (error.request) {
      return new Error('Aucune réponse du serveur');
    } else {
      return new Error('Erreur de configuration de la requête');
    }
  }
}

export const categoriesService = new CategoriesService(); 