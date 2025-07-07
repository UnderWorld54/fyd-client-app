import Home from '@/app/home';
import { authService } from '@/services/auth.service';
import { eventsService } from '@/services/events.service';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Calendar from 'expo-calendar';
import { router } from 'expo-router';
import React from 'react';
import { mockAuthResponse } from '../test-utils';

jest.mock('../../services/auth.service');
jest.mock('../../services/events.service');

const mockEvents = [
  {
    ticketmaster_id: 'event1',
    name: 'Concert Test',
    date: '2025-07-15T20:00:00.000Z',
    location: 'Zénith Paris',
    ticket_url: 'https://example.com/event1',
    price_min: 45,
    image_url: 'https://example.com/image1.jpg'
  },
  {
    ticketmaster_id: 'event2',
    name: 'Festival Music',
    date: '2025-08-20T18:00:00.000Z',
    location: 'Parc de la Villette',
    ticket_url: 'https://example.com/event2',
    price_min: 60,
    image_url: ''
  }
];

describe('Home Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockAuthResponse);
    (eventsService.fetchEvents as jest.Mock).mockResolvedValue({
      success: true,
      data: mockEvents
    });
  });

  it('renders loading state initially', () => {
    const { getByTestId } = render(<Home />);
    
    // ActivityIndicator doesn't have testID by default, 
    // but we can check if it exists by looking for its parent
    expect(() => getByTestId('loading-indicator')).toBeTruthy();
  });

  it('loads and displays user city', async () => {
    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Paris')).toBeTruthy();
    });
  });

  it('fetches and displays events', async () => {
    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(eventsService.fetchEvents).toHaveBeenCalledWith('Paris', ['sport', 'musique']);
      expect(getByText('Concert Test')).toBeTruthy();
      expect(getByText('Festival Music')).toBeTruthy();
    });
  });

  it('groups events by month', async () => {
    const { getByText } = render(<Home />);

    await waitFor(() => {
      // Les événements sont en juillet et août
      expect(getByText('JUIL.')).toBeTruthy();
      expect(getByText('AOÛT')).toBeTruthy();
    });
  });

  it('displays event details correctly', async () => {
    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Concert Test')).toBeTruthy();
      expect(getByText('Zénith Paris')).toBeTruthy();
      expect(getByText('à partir de 45€')).toBeTruthy();
    });
  });

  it('shows placeholder for events without price', async () => {
    (eventsService.fetchEvents as jest.Mock).mockResolvedValue({
      success: true,
      data: [{
        ...mockEvents[0],
        price_min: null
      }]
    });

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Prix non communiqué')).toBeTruthy();
    });
  });

  it('adds event to calendar when add button is pressed', async () => {
    (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([
      { id: 'cal1', allowsModifications: true }
    ]);
    (Calendar.createEventAsync as jest.Mock).mockResolvedValue('event123');
    
    global.alert = jest.fn();

    const { getAllByTestId } = render(<Home />);

    await waitFor(() => {
      const addButtons = getAllByTestId('add-event-button');
      fireEvent.press(addButtons[0]);
    });

    await waitFor(() => {
      expect(Calendar.createEventAsync).toHaveBeenCalledWith('cal1', {
        title: 'Concert Test',
        startDate: new Date('2025-07-15T20:00:00.000Z'),
        endDate: expect.any(Date),
        location: 'Zénith Paris',
        notes: 'https://example.com/event1',
        timeZone: 'Europe/Paris'
      });
      expect(global.alert).toHaveBeenCalledWith('Événement ajouté au calendrier !');
    });
  });

  it('handles calendar permission denied', async () => {
    (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    global.alert = jest.fn();

    const { getAllByTestId } = render(<Home />);

    await waitFor(() => {
      const addButtons = getAllByTestId('add-event-button');
      fireEvent.press(addButtons[0]);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Permission refusée pour accéder au calendrier.');
    });
  });

  it('navigates to settings when settings button is pressed', async () => {
    const { getByTestId } = render(<Home />);

    await waitFor(() => {
      const settingsButton = getByTestId('settings-button');
      fireEvent.press(settingsButton);
      expect(router.push).toHaveBeenCalledWith('/(settings)');
    });
  });

  it('shows empty state when no events are found', async () => {
    (eventsService.fetchEvents as jest.Mock).mockResolvedValue({
      success: true,
      data: []
    });

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Aucun évènement trouvé pour votre ville et vos intérêts.')).toBeTruthy();
    });
  });

  it('refreshes events when refresh button is pressed', async () => {
    const { getByTestId } = render(<Home />);

    await waitFor(() => {
      expect(eventsService.fetchEvents).toHaveBeenCalledTimes(1);
    });

    const refreshButton = getByTestId('refresh-button');
    fireEvent.press(refreshButton);

    await waitFor(() => {
      expect(eventsService.fetchEvents).toHaveBeenCalledTimes(2);
    });
  });

  it('handles error when loading events', async () => {
    (eventsService.fetchEvents as jest.Mock).mockRejectedValue(new Error('Network error'));
    console.log = jest.fn(); // Mock console.log to avoid error output in tests

    render(<Home />);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('error', expect.any(Error));
    });
  });
});