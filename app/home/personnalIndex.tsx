import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Header';

const PLACEHOLDER_IMAGE = 'https://m.media-amazon.com/images/I/41g6jROgo0L.png';

// Événements simulés
const initialEvents = [
  {
    ticketmaster_id: 'abc123',
    name: 'HEXAGONE MMA TOULOUSE',
    date: '2025-09-26T00:00:00.000Z',
    location: '11 AVENUE RAYMOND BADIOU, 31300 Toulouse, France',
    ticket_url: 'https://www.ticketmaster.fr/fr/manifestation/hexagone-mma-toulouse-billet/idmanif/607016/idtier/18864121',
    remaining_places: 112,
    image_url: 'https://static.ticketmaster.fr/static/images/photos-salles/s_527_4.jpg',
  },
  {
    ticketmaster_id: 'xyz456',
    name: 'Concert Rock à Toulouse',
    date: '2025-07-15T20:00:00.000Z',
    location: 'Zénith Toulouse Métropole',
    ticket_url: 'https://example.com/concert-rock',
    remaining_places: 48,
    image_url: '',
  },
];

export default function PersonnelScreen() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!selectedEventId) return;

    const confirm = await new Promise<boolean>((resolve) =>
      Alert.alert('Confirmation', 'Supprimer cet événement ?', [
        { text: 'Annuler', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Supprimer', style: 'destructive', onPress: () => resolve(true) },
      ])
    );

    if (confirm) {
      setEvents(events.filter(e => e.ticketmaster_id !== selectedEventId));
      setSelectedEventId(null);
      Alert.alert('Succès', 'Événement supprimé.');
    }
  };

  const eventsByMonth = events.reduce((acc: Record<string, any[]>, event) => {
    const date = new Date(event.date);
    const month = date.toLocaleString('fr-FR', { month: 'short' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <Header
        title="Mes évènements"
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/(settings)')} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#FFB86B" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.subtitle}>Voici mes évènements</Text>
          </View>

          {Object.entries(eventsByMonth).length === 0 ? (
            <Text style={styles.emptyText}>Aucun événement enregistré.</Text>
          ) : (
            Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <View key={month} style={styles.monthSection}>
                <View style={styles.monthBadge}>
                  <Text style={styles.monthText}>{month.toUpperCase()}</Text>
                </View>
                {monthEvents.map((event) => (
                  <TouchableOpacity
                    key={event.ticketmaster_id}
                    onPress={() =>
                      setSelectedEventId(
                        selectedEventId === event.ticketmaster_id ? null : event.ticketmaster_id
                      )
                    }
                    style={[
                      styles.eventCard,
                      selectedEventId === event.ticketmaster_id && {
                        borderColor: '#FFB86B',
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Image
                      source={{
                        uri: event.image_url && event.image_url.trim() !== '' && event.image_url.startsWith('http')
                          ? event.image_url
                          : PLACEHOLDER_IMAGE,
                      }}
                      style={styles.eventImage}
                    />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle}>{event.name}</Text>
                      <Text style={styles.eventDate}>
                        {new Date(event.date).toLocaleDateString('fr-FR')}
                      </Text>
                      <Text style={styles.eventLocation}>{event.location}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/index')}
              activeOpacity={0.7}
            >
              <LinearGradient colors={['#FFB86B', '#FF8C42']} style={styles.gradientButton}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.buttonText}>Ajouter</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={!selectedEventId}
              activeOpacity={selectedEventId ? 0.7 : 1}
              style={[
                styles.deleteButton,
                !selectedEventId && styles.deleteButtonDisabled,
              ]}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Montserrat',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontFamily: 'Montserrat',
  },
  monthSection: {
    marginBottom: 32,
  },
  monthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE5C2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginLeft: 16,
    marginBottom: 8,
  },
  monthText: {
    color: '#FFB86B',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'MontserratBold',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    elevation: 2,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'MontserratBold',
  },
  eventDate: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  eventLocation: {
    color: '#FFB86B',
    fontSize: 13,
    fontFamily: 'Montserrat',
  },
  buttonRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 12 ,
    marginTop: 24,
    paddingHorizontal: 10,
    width: 'auto',
  },
  addButton: {
    flex: 1,
    marginRight: 8,
  },
  gradientButton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#ccc',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  settingsButton: {
    padding: 8,
  },
});
