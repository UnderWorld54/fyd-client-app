import axios from 'axios';
import env from '../config/env';

const API_URL = env.API_URL + '/events';

class EventsService {
  async fetchEvents(city: string, interests: string[]) {
    const response = await axios.post(`${API_URL}/fetch`, {
      ville: city,
      interet: interests,
    });
    return response.data;
  }

  async fetchUserEvents(userId: string) {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  }

  async deleteUserEvent(eventId: string, userId: string) {
    const response = await axios.delete(`${API_URL}/user/${userId}/event/${eventId}`);
    return response.data;
  }
}

export const eventsService = new EventsService();
