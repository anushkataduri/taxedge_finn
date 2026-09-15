import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./ImportantNotesCard.styles";

export const ImportantNotesCard: React.FC = () => {
  const notes = [
    "Review your income and deductions carefully.",
    "Verify all uploaded documents.",
    "Once approved, the return will be filed with the Income Tax Department.",
    "Changes cannot be made after filing without submitting a Revised ITR.",
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="alert" size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Important</Text>
      </View>

      {/* Bullets */}
      <View style={styles.bulletsList}>
        {notes.map((note, index) => (
          <View key={index} style={styles.bulletRow}>
            <View style={styles.orangeDot} />
            <Text style={styles.bulletText}>{note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
