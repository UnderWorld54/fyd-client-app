import Header from '@/components/Header';
import { authService } from '@/services/auth.service';
import { AuthResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { eventsService } from '../../services/events.service';

const PLACEHOLDER_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

async function addToCalendar(event: any) {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission refusée pour accéder au calendrier.');
      return;
    }
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];
    if (!defaultCalendar) {
      alert('Aucun calendrier modifiable trouvé.');
      return;
    }
    await Calendar.createEventAsync(defaultCalendar.id, {
      title: event.name,
      startDate: new Date(event.date),
      endDate: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000), // 2h par défaut
      location: event.location,
      notes: event.ticket_url,
      timeZone: 'Europe/Paris',
    });
    alert('Événement ajouté au calendrier !');
  } catch (e) {
    alert('Erreur lors de l\'ajout au calendrier.');
  }
}

export default function Home() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (isMounted) {
          setUser(userData);
          setCity(userData?.data?.user?.city || '');
          setInterests(userData?.data?.user?.interests || []);
        }
        if (userData?.data?.user?.city && userData?.data?.user?.interests) {
          const res = await eventsService.fetchEvents(userData.data.user.city, userData.data.user.interests);
          if (res.success) setEvents(res.data);
          else setEvents([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSettingsPress = () => {
    router.push('/(settings)');
  };

  // Grouper les événements par mois
  const eventsByMonth = events.reduce((acc, event) => {
    const date = new Date(event.date);
    const month = date.toLocaleString('fr-FR', { month: 'short' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <View style={styles.container}>
      <Header 
        title="Accueil" 
        rightComponent={
          <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView>
            <Text style={styles.welcomeText}>
              Bienvenue {user?.data?.user?.name || 'Utilisateur'}
            </Text>
            <Text style={{ color: '#FFB86B', fontWeight: 'bold', fontSize: 32, textAlign: 'center', marginVertical: 16 }}>
              {city}
            </Text>
            {events.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
                Aucun évènement trouvé pour votre ville et vos intérêts.
              </Text>
            ) : (
              Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                <View key={month}>
                  <Text style={{ fontWeight: 'bold', fontSize: 28, marginTop: 24, marginLeft: 16 }}>{month.charAt(0).toUpperCase() + month.slice(1)}</Text>
                  {(monthEvents as any[]).map((event: any) => (
                    <View key={event.ticketmaster_id} style={{
                      backgroundColor: '#F7F8FA',
                      borderRadius: 16,
                      marginVertical: 12,
                      marginHorizontal: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 8,
                      shadowColor: '#000',
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                    }}>
                      <Image source={{ uri: event.image_url || PLACEHOLDER_IMAGE }} style={{ width: 80, height: 80, borderRadius: 12, marginRight: 12 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{event.name}</Text>
                        <Text style={{ color: '#888', fontSize: 14 }}>
                          {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Text>
                        <Text style={{ color: '#888', fontSize: 13 }}>{event.location}</Text>
                        <Text style={{ color: '#aaa', fontSize: 13 }}>
                          {event.price_min ? `à partir de ${event.price_min}€` : 'Prix non communiqué'}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => addToCalendar(event)} style={{ marginLeft: 8 }}>
                        <Ionicons name="add-circle-outline" size={32} color="#FFB86B" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#333',
    fontFamily: 'MontserratBold',
  },
  settingsButton: {
    padding: 8,
  },
}); 