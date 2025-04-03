import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Hobbies = () => {
  const navigation = useNavigation();
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadHobbies();
  }, []);

  const loadHobbies = async () => {
    const storedHobbies = await AsyncStorage.getItem("hobbies");
    if (storedHobbies) setHobbies(JSON.parse(storedHobbies));
  };

  const addHobby = async () => {
    if (input.trim() !== "") {
      const updatedHobbies = [...hobbies, input.trim()];
      setHobbies(updatedHobbies);
      await AsyncStorage.setItem("hobbies", JSON.stringify(updatedHobbies));
      setInput("");
    }
  };

  const removeHobby = async (hobby: string) => {
    const updatedHobbies = hobbies.filter((h) => h !== hobby);
    setHobbies(updatedHobbies);
    await AsyncStorage.setItem("hobbies", JSON.stringify(updatedHobbies));
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
        <Text style={styles.title}>My Hobbies 🎨</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add a hobby..."
          placeholderTextColor="#4A5568"
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={addHobby} style={styles.addButton}>
          <MaterialCommunityIcons 
            name="plus" 
            size={24} 
            color="#E2E8F0" 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={hobbies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.hobbyItem}>
            <Text style={styles.hobbyText}>{item}</Text>
            <TouchableOpacity
              onPress={() => removeHobby(item)}
              style={styles.removeButton}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#1A202C",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2D3748",
    padding: 15,
    color: "#E2E8F0",
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "#7F5AF0",
    borderRadius: 12,
    justifyContent: "center",
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
  hobbyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#1A202C",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  hobbyText: {
    fontSize: 16,
    color: "#E2E8F0",
  },
  removeButton: {
    width: 40,
    height: 40,
    backgroundColor: "#EF4444",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
});

export default Hobbies;
