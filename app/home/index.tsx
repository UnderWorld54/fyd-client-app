import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { authService } from "../../services/auth.service";
import { eventsService } from "../../services/events.service";

const PLACEHOLDER_IMAGE = "https://m.media-amazon.com/images/I/41g6jROgo0L.png";

async function addToCalendar(event: any) {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      alert("Permission refusée pour accéder au calendrier.");
      return;
    }
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendar =
      calendars.find((cal) => cal.allowsModifications) || calendars[0];
    if (!defaultCalendar) {
      alert("Aucun calendrier modifiable trouvé.");
      return;
    }
    await Calendar.createEventAsync(defaultCalendar.id, {
      title: event.name,
      startDate: new Date(event.date),
      endDate: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000), // 2h par défaut
      location: event.location,
      notes: event.ticket_url,
      timeZone: "Europe/Paris",
    });
    alert("Événement ajouté au calendrier !");
  } catch (e) {
    alert("Erreur lors de l'ajout au calendrier.");
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [city, setCity] = useState("");
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setCity(userData?.data?.user?.city || "");
      if (userData?.data?.user?.city && userData?.data?.user?.interests) {
        console.log("request");

        const res = await eventsService.fetchEvents(
          userData.data.user.city,
          userData.data.user.interests
        );
        console.log("res", res);

        if (res.success) setEvents(res.data);
        else setEvents([]);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    load();
    return () => {
      isMounted = false;
    };
  }, [load]);

  // Grouper les événements par mois
  const eventsByMonth = events.reduce((acc, event) => {
    const date = new Date(event.date);
    const month = date.toLocaleString("fr-FR", { month: "short" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <Header
        title="Accueil"
        rightComponent={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => router.push("/(settings)")}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        }
      />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FFB86B"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.subtitle}>Voici les évènements à venir !</Text>
            <Text style={styles.city}>{city}</Text>
          </View>
          {Object.entries(eventsByMonth).length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                marginTop: 40,
                color: "#888",
                fontFamily: "Montserrat",
              }}
            >
              Aucun évènement trouvé pour votre ville et vos intérêts.
            </Text>
          ) : (
            Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <View key={month} style={styles.monthSection}>
                <View style={styles.monthBadge}>
                  <Text style={styles.monthText}>{month.toUpperCase()}</Text>
                </View>
                {(monthEvents as any[]).map((event: any) => (
                  <View key={event.ticketmaster_id} style={styles.eventCard}>
                    <Image
                      source={{
                        uri:
                          event.image_url &&
                          event.image_url.trim() !== "" &&
                          event.image_url.startsWith("http")
                            ? event.image_url
                            : PLACEHOLDER_IMAGE,
                      }}
                      style={styles.eventImage}
                      resizeMode="cover"
                    />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle}>{event.name}</Text>
                      <Text style={styles.eventDate}>
                        {new Date(event.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                      <Text style={styles.eventLocation}>{event.location}</Text>
                      <Text style={styles.eventPrice}>
                        {event.price_min
                          ? `à partir de ${event.price_min}€`
                          : "Prix non communiqué"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => addToCalendar(event)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={["#FFB86B", "#FF8C42"]}
                        style={styles.addButtonGradient}
                        start={[0, 0]}
                        end={[1, 1]}
                      >
                        <Ionicons name="add" size={24} color="#fff" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))
          )}
          <View style={styles.refreshContainer}>
            <TouchableOpacity
              onPress={load}
              style={[
                styles.refreshFab,
                (isLoading || refreshing) && { backgroundColor: "#eee" },
              ]}
              disabled={isLoading || refreshing}
              activeOpacity={0.7}
            >
              <Ionicons
                name="refresh"
                size={28}
                color={isLoading || refreshing ? "#ccc" : "#FFB86B"}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  settingsButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#222",
    fontFamily: "Montserrat",
  },
  city: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFB86B",
    fontFamily: "MontserratBold",
    marginTop: 4,
  },
  monthSection: {
    marginBottom: 32,
  },
  monthBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE5C2",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginLeft: 16,
    marginBottom: 8,
  },
  monthText: {
    color: "#FFB86B",
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "MontserratBold",
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: "#FFB86B",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
    position: "relative",
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#F7F8FA",
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    fontFamily: "MontserratBold",
  },
  eventDate: {
    color: "#888",
    fontSize: 14,
    marginTop: 2,
    fontFamily: "Montserrat",
  },
  eventLocation: {
    color: "#FFB86B",
    fontSize: 13,
    marginTop: 2,
    fontFamily: "Montserrat",
  },
  eventPrice: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
    fontFamily: "Montserrat",
  },
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 2,
  },
  addButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFB86B",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  refreshFab: {
    backgroundColor: "#fff",
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFB86B",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
});
