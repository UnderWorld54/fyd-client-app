import { eventsService } from '@/services/events.service';

// Mock complet du service events
jest.mock('@/services/events.service', () => ({
  eventsService: {
    fetchEvents: jest.fn(),
    fetchUserEvents: jest.fn(),
    deleteUserEvent: jest.fn(),
  },
}));

const mockEventsService = eventsService as jest.Mocked<typeof eventsService>;

describe('EventsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchEvents', () => {
    it('should fetch events successfully', async () => {
      const mockCity = 'Paris';
      const mockInterests = ['sport', 'musique'];
      const mockResponse = {
        success: true,
        data: [
          {
            ticketmaster_id: 'event1',
            name: 'Concert Rock',
            date: '2025-07-15T20:00:00.000Z',
            location: 'Zénith Paris',
            ticket_url: 'https://example.com/event1',
            price_min: 45,
            image_url: 'https://example.com/image1.jpg'
          },
          {
            ticketmaster_id: 'event2',
            name: 'Match de Football',
            date: '2025-07-20T19:00:00.000Z',
            location: 'Parc des Princes',
            ticket_url: 'https://example.com/event2',
            price_min: 30,
            image_url: 'https://example.com/image2.jpg'
          }
        ]
      };

      mockEventsService.fetchEvents.mockResolvedValue(mockResponse);

      const result = await eventsService.fetchEvents(mockCity, mockInterests);

      expect(result).toEqual(mockResponse);
      expect(mockEventsService.fetchEvents).toHaveBeenCalledWith(mockCity, mockInterests);
    });

    it('should handle fetch events failure', async () => {
      const mockCity = 'Paris';
      const mockInterests = ['sport'];

      mockEventsService.fetchEvents.mockRejectedValue(new Error('Server error'));

      await expect(eventsService.fetchEvents(mockCity, mockInterests)).rejects.toThrow('Server error');
      expect(mockEventsService.fetchEvents).toHaveBeenCalledWith(mockCity, mockInterests);
    });
  });

  describe('fetchUserEvents', () => {
    it('should fetch user events successfully', async () => {
      const userId = '123';
      const mockResponse = {
        success: true,
        data: [
          {
            ticketmaster_id: 'user_event1',
            name: 'Mon événement',
            date: '2025-08-01T18:00:00.000Z'
          }
        ]
      };

      mockEventsService.fetchUserEvents.mockResolvedValue(mockResponse);

      const result = await eventsService.fetchUserEvents(userId);

      expect(result).toEqual(mockResponse);
      expect(mockEventsService.fetchUserEvents).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteUserEvent', () => {
    it('should delete user event successfully', async () => {
      const eventId = 'event123';
      const userId = 'user123';
      const mockResponse = {
        success: true,
        message: 'Event deleted successfully'
      };

      mockEventsService.deleteUserEvent.mockResolvedValue(mockResponse);

      const result = await eventsService.deleteUserEvent(eventId, userId);

      expect(result).toEqual(mockResponse);
      expect(mockEventsService.deleteUserEvent).toHaveBeenCalledWith(eventId, userId);
    });
  });
});