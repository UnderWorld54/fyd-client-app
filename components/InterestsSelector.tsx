import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsEvents } from "@/services/analytics.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Interest = {
  id: string;
  name: string;
};

type InterestsSelectorProps = {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
};

const AVAILABLE_INTERESTS: Interest[] = [
  { id: "sport", name: "Sport" },
  { id: "musique", name: "Musique" },
  { id: "cinema", name: "Cinéma" },
  { id: "lecture", name: "Lecture" },
  { id: "voyage", name: "Voyage" },
  { id: "cuisine", name: "Cuisine" },
  { id: "art", name: "Art" },
  { id: "technologie", name: "Technologie" },
  { id: "nature", name: "Nature" },
  { id: "photographie", name: "Photographie" },
];

export default function InterestsSelector({
  selectedInterests = [],
  onInterestsChange,
}: InterestsSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { trackEvent } = useAnalytics();

  const toggleInterest = (interestId: string) => {
    const interest = AVAILABLE_INTERESTS.find(i => i.id === interestId);
    const isSelected = selectedInterests.includes(interestId);
    
    if (isSelected) {
      // Désélectionner l'intérêt
      onInterestsChange(selectedInterests.filter((id) => id !== interestId));
      
      // Tracker la désélection
      trackEvent({
        name: AnalyticsEvents.INTEREST_SELECTED,
        properties: {
          interest_id: interestId,
          interest_name: interest?.name,
          action: 'deselected',
          total_selected: selectedInterests.length - 1,
        },
      });
    } else {
      // Sélectionner l'intérêt
      onInterestsChange([...selectedInterests, interestId]);
      
      // Tracker la sélection
      trackEvent({
        name: AnalyticsEvents.INTEREST_SELECTED,
        properties: {
          interest_id: interestId,
          interest_name: interest?.name,
          action: 'selected',
          total_selected: selectedInterests.length + 1,
        },
      });
    }
  };

  const handleEditToggle = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    
    // Tracker le changement de mode édition
    trackEvent({
      name: 'Interest Edit Mode Toggled',
      properties: {
        editing_mode: newEditingState,
        selected_interests_count: selectedInterests.length,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Centres d&apos;intérêts</Text>
        <TouchableOpacity
          onPress={handleEditToggle}
          style={styles.editButton}
        >
          <Ionicons
            name={isEditing ? "checkmark" : "pencil"}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.interestsContainer}>
        {AVAILABLE_INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestChip,
              selectedInterests.includes(interest.id) && styles.selectedChip,
              !isEditing && styles.disabledChip,
            ]}
            onPress={() => isEditing && toggleInterest(interest.id)}
            disabled={!isEditing}
          >
            <Text
              style={[
                styles.interestText,
                selectedInterests.includes(interest.id) && styles.selectedText,
              ]}
            >
              {interest.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "MontserratBold",
    color: "#333",
  },
  editButton: {
    padding: 8,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedChip: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  disabledChip: {
    opacity: 0.7,
  },
  interestText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Montserrat",
  },
  selectedText: {
    color: "#fff",
  },
});
