import { categoriesService } from '@/services/categories.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Interest } from '../types';

const mock = new MockAdapter(axios);

describe('CategoriesService', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('getInterests', () => {
    it('should return interests on successful request', async () => {
      const dummyInterests: Interest[] = [
        { id: '1', name: 'coding' },
        { id: '2', name: 'reading' },
      ];

      mock.onGet(/\/categories\//).reply(200, dummyInterests);

      const result = await categoriesService.getInterests();

      expect(result).toEqual(dummyInterests);
    });

    it('should throw error with server message if response error', async () => {
      const errorMessage = 'Erreur serveur';

      mock.onGet(/\/categories\//).reply(400, { message: errorMessage });

      await expect(categoriesService.getInterests()).rejects.toThrow(errorMessage);
    });

    it('should throw error "Aucune réponse du serveur" if no response received', async () => {
      mock.onGet(/\/categories\//).reply(() => {
        const error = new Error('Network Error') as any;
        error.request = {}; // важно!
        throw error;
      });
    
      await expect(categoriesService.getInterests()).rejects.toThrow('Aucune réponse du serveur');
    });
    

    it('should throw error "Erreur de configuration de la requête" on other errors', async () => {
      const error = new Error('Some config error');
      mock.onGet(/\/categories\//).reply(() => {
        throw error;
      });

      await expect(categoriesService.getInterests()).rejects.toThrow('Erreur de configuration de la requête');
    });
  });
});
