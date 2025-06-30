import { eventsService } from '@/services/events.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('EventsService', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('fetchEvents', () => {
    it('should post city and interests and return events data', async () => {
      const city = 'Paris';
      const interests = ['coding', 'music'];
      const dummyEvents = [
        { id: '1', title: 'Concert' },
        { id: '2', title: 'Coding Meetup' },
      ];

      mock.onPost(/\/events\/fetch/).reply(config => {
        const data = JSON.parse(config.data);
        expect(data).toEqual({
          ville: city,
          interet: interests,
        });

        return [200, dummyEvents];
      });

      const result = await eventsService.fetchEvents(city, interests);

      expect(result).toEqual(dummyEvents);
    });

    it('should throw error if axios request fails', async () => {
      mock.onPost(/\/events\/fetch/).networkError();

      await expect(eventsService.fetchEvents('Paris', ['coding'])).rejects.toThrow();
    });
  });
});
