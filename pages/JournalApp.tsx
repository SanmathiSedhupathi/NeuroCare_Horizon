import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface JournalEntry {
  id: string;
  text: string;
  timestamp: string;
}

const Journal = () => {
  const navigation = useNavigation();
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const getCurrentDateTime = (): string => {
    return new Date().toLocaleString(); // Formats date & time
  };

  const saveEntry = async () => {
    if (!entry.trim()) {
      Alert.alert("Empty Entry", "Please write something before saving.");
      return;
    }

    const newEntry: JournalEntry = { id: Date.now().toString(), text: entry, timestamp: getCurrentDateTime() };
    const newEntries = [newEntry, ...entries]; // Adds new entry at the top

    try {
      await AsyncStorage.setItem("journalEntries", JSON.stringify(newEntries));
      setEntries(newEntries);
      setEntry(""); // Clear input after saving
      Alert.alert("Saved", "Your journal entry has been saved!");
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem("journalEntries");
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error("Error loading journal entries:", error);
    }
  };

  const deleteEntry = async (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    try {
      await AsyncStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#171923', '#0D1117']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#E2E8F0" 
          />
        </TouchableOpacity>
        <Text style={styles.title}>Journal</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        placeholderTextColor="#4A5568"
        value={entry}
        onChangeText={setEntry}
        multiline
      />
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={saveEntry}
      >
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>
      
      <Text style={styles.subtitle}>Previous Entries</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <View style={styles.entryContent}>
              <Text style={styles.entryText}>{item.text}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => deleteEntry(item.id)} 
              style={styles.deleteButton}
            >
              <MaterialCommunityIcons 
                name="delete-outline" 
                size={20} 
                color="#E2E8F0" 
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#1A202C',
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E2E8F0",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E2E8F0",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 120,
    borderColor: "#2D3748",
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#1A202C",
    borderRadius: 12,
    color: "#E2E8F0",
    fontSize: 16,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: "#7F5AF0",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#7F5AF0",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "600",
  },
  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A202C",
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  entryContent: {
    flex: 1,
    marginRight: 10,
  },
  entryText: {
    fontSize: 16,
    color: "#E2E8F0",
    lineHeight: 24,
  },
  timestamp: {
    fontSize: 12,
    color: "#4A5568",
    marginTop: 5,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
});

export default Journal;
