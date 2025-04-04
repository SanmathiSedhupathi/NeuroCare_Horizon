import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    ActivityIndicator,
    Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface HabitItem {
    id: string;
    title: string;
    icon: string;
    completed: boolean;
}
interface UserData {
    profession: string;
    hobbies: string;
    sleepCycle: string;
    foodHabits: string;
    personalInterests: string;
    personalityType: string;
    workHours: string;
}

interface WeeklyProgress {
    date: string;
    progress: number;
    completed: number;
    total: number;
}

const Habit: React.FC = () => {
    const [habits, setHabits] = useState<HabitItem[]>([]);
    const [userData, setUserData] = useState<UserData>({
        profession: '',
        hobbies: '',
        sleepCycle: '',
        foodHabits: '',
        personalInterests: '',
        personalityType: '',
        workHours: ''
    });
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [showProgress, setShowProgress] = useState<boolean>(false);
    const [submittedDate, setSubmittedDate] = useState<string>('');
    const [weeklyHistory, setWeeklyHistory] = useState<WeeklyProgress[]>([]);
    const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);

    const generatePersonalizedHabits = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://api.cohere.ai/v1/generate',
                {
                    model: 'command',
                    prompt: `Based on the following user details, generate a JSON array with 8 personalized habits.
                    Each habit should have:
                    - "id" (string)
                    - "title" (e.g., "Morning Meditation")
                    - "icon" (one of: meditation, run, book-open-variant, water, food-apple, notebook, walk, moon-waning-crescent)
                    - "completed" (boolean)
                    
                    User Details: ${JSON.stringify(userData)}
                    
                    Work hours should NOT be included in the habit timing.
                    Return ONLY the JSON array. No extra text.`,
                    max_tokens: 300,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer aFnAMxjTpGEhu0LAmbGz5mQiGxaCLNZpvdtcjltf`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const jsonMatch = response.data.generations[0].text.match(/\[.*\]/s);
            if (jsonMatch) {
                const newHabits = JSON.parse(jsonMatch[0]);
                setHabits(newHabits);
                setModalVisible(false);
            }
        } catch (error) {
            console.error('Error generating habits:', error);
        }
        setLoading(false);
    };

    const loadWeeklyProgress = async () => {
        try {
            const history = await AsyncStorage.getItem('weeklyHabitProgress');
            if (history) {
                setWeeklyHistory(JSON.parse(history));
            }
        } catch (error) {
            console.error('Error loading weekly progress:', error);
        }
    };

    const saveWeeklyProgress = async (todayProgress: WeeklyProgress) => {
        try {
            let history = [...weeklyHistory];
            // Keep only last 7 days
            if (history.length >= 7) {
                history = history.slice(-6);
            }
            history.push(todayProgress);
            await AsyncStorage.setItem('weeklyHabitProgress', JSON.stringify(history));
            setWeeklyHistory(history);
        } catch (error) {
            console.error('Error saving weekly progress:', error);
        }
    };

    const handleSubmit = async () => {
        const completed = getCompletedCount();
        const total = habits.length;
        const progressPercentage = (completed / total) * 100;
        const today = new Date().toLocaleDateString();

        const todayProgress = {
            date: today,
            progress: progressPercentage,
            completed,
            total
        };

        setSubmittedDate(today);
        setProgress(progressPercentage);
        setShowProgress(true);

        // Save daily and weekly progress
        await AsyncStorage.setItem('habitProgress', JSON.stringify(todayProgress));
        await saveWeeklyProgress(todayProgress);
    };

    const renderUserDataInput = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity 
                        onPress={() => setModalVisible(false)}
                        style={styles.backButton}
                    >
                        <MaterialCommunityIcons 
                            name="arrow-left" 
                            size={24} 
                            color="#7F5AF0" 
                        />
                        <Text style={styles.backButtonText}></Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Personalize Your Habits</Text>
                </View>
                <ScrollView>
                    {Object.keys(userData).map((key) => (
                        <View key={key} style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={userData[key as keyof UserData]}
                                onChangeText={(text) => 
                                    setUserData(prev => ({ ...prev, [key]: text }))
                                }
                                placeholder={`Enter your ${key}`}
                                placeholderTextColor="#A0AEC0"
                            />
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={generatePersonalizedHabits}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={['#7F5AF0', '#6B46C1']}
                            style={styles.generateButtonGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.generateButtonText}>
                                    Generate Habits
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );

    const renderProgressModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showProgress}
            onRequestClose={() => setShowProgress(false)}
        >
            <View style={styles.progressModalView}>
                <LinearGradient
                    colors={['#2D3748', '#1A202C']}
                    style={styles.progressModalContent}
                >
                    <MaterialCommunityIcons 
                        name={progress === 100 ? "trophy" : "chart-line"} 
                        size={50} 
                        color="#7F5AF0" 
                    />
                    <Text style={styles.progressTitle}>
                        {progress === 100 ? 'Congratulations! 🎉' : 'Daily Progress'}
                    </Text>
                    <Text style={styles.progressDate}>{submittedDate}</Text>
                    <View style={styles.progressCircle}>
                        <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
                    </View>
                    <Text style={styles.progressDetails}>
                        {getCompletedCount()} out of {habits.length} habits completed
                    </Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowProgress(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>
    );

    const renderWeeklyProgressModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showWeeklyProgress}
            onRequestClose={() => setShowWeeklyProgress(false)}
        >
            <View style={styles.progressModalView}>
                <LinearGradient
                    colors={['#2D3748', '#1A202C']}
                    style={styles.progressModalContent}
                >
                    <Text style={styles.progressTitle}>Weekly Progress</Text>
                    <ScrollView style={styles.weeklyProgressList}>
                        {weeklyHistory.map((day, index) => (
                            <View key={index} style={styles.weeklyProgressItem}>
                                <Text style={styles.weeklyProgressDate}>{day.date}</Text>
                                <View style={styles.weeklyProgressBar}>
                                    <LinearGradient
                                        colors={['#7F5AF0', '#6B46C1']}
                                        style={[styles.weeklyProgressFill, { width: `${day.progress}%` }]}
                                    />
                                </View>
                                <Text style={styles.weeklyProgressText}>
                                    {day.completed}/{day.total} ({day.progress.toFixed(0)}%)
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowWeeklyProgress(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>
    );

    const getCompletedCount = () => habits.filter(habit => habit.completed).length;

    const toggleHabit = (id: string) => {
        setHabits(habits.map(habit => 
            habit.id === id 
                ? { ...habit, completed: !habit.completed }
                : habit
        ));
    };

    useEffect(() => {
        loadWeeklyProgress();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <LinearGradient 
                colors={['#171923', '#0D1117']}
                style={styles.container}
            >
                <ScrollView style={styles.content}>
                    
                    <TouchableOpacity 
                        onPress={() => setModalVisible(true)}
                        style={styles.personalizeButton}
                    >
                        <Text style={styles.personalizeButtonText}>
                            Personalize Habits
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setShowWeeklyProgress(true)}
                        style={styles.weeklyButton}
                    >
                        <Text style={styles.weeklyButtonText}>
                            View Weekly Progress
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.subtitle}>
                        {getCompletedCount()}/{habits.length} completed
                    </Text>

                    <View style={styles.progressBar}>
                        <LinearGradient
                            colors={['#7F5AF0', '#6B46C1']}
                            style={[styles.progress, { width: `${(getCompletedCount() / habits.length) * 100}%` }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    </View>

                    <View style={styles.habitList}>
                        {habits.length > 0 && (
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                                disabled={getCompletedCount() === 0}
                            >
                                <LinearGradient
                                    colors={['#7F5AF0', '#6B46C1']}
                                    style={styles.submitButtonGradient}
                                >
                                    <Text style={styles.submitButtonText}>Submit Progress</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                        {habits.map((habit) => (
                            <TouchableOpacity
                                key={habit.id}
                                onPress={() => toggleHabit(habit.id)}
                                style={styles.habitItem}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={['#2D3748', '#1A202C']}
                                    style={styles.habitItemGradient}
                                >
                                    <MaterialCommunityIcons 
                                        name={habit.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                        size={24} 
                                        color={habit.completed ? '#7F5AF0' : '#4A5568'} 
                                    />
                                    <Text style={[
                                        styles.habitItemText,
                                        habit.completed && styles.completedText
                                    ]}>
                                        {habit.title}
                                    </Text>
                                    <MaterialCommunityIcons 
                                        name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap} 
                                        size={24} 
                                        color="#7F5AF0" 
                                        style={styles.habitIcon}
                                    />

                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </LinearGradient>
            {renderUserDataInput()}
            {renderProgressModal()}
            {renderWeeklyProgressModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 50,
        paddingBottom: 20,
    },
    content: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0AEC0',
        textAlign: 'center',
        marginBottom: 20,
    },
    progressBar: {
        height: 10,
        width: width * 0.8,
        backgroundColor: '#2D3748',
        borderRadius: 10,
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 20,
    },
    progress: {
        height: '100%',
        borderRadius: 10,
    },
    habitList: {
        marginTop: 10,
    },
    habitItem: {
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    habitItemGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    habitItemText: {
        flex: 1,
        fontSize: 16,
        color: '#E2E8F0',
        marginLeft: 10,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#A0AEC0',
    },
    habitIcon: {
        marginLeft: 10,
    },
    modalView: {
        flex: 1,
        backgroundColor: '#171923',
        padding: 20,
        marginTop: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        zIndex: 1,
    },
    backButtonText: {
        color: '#7F5AF0',
        fontSize: 16,
        marginLeft: 5,
    },
    modalTitle: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        color: '#E2E8F0',
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#2D3748',
        borderRadius: 10,
        padding: 15,
        color: '#E2E8F0',
        fontSize: 16,
    },
    generateButton: {
        marginTop: 20,
        marginBottom: 40,
    },
    generateButtonGradient: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    generateButtonText: {
        color: '#E2E8F0',
        fontSize: 18,
        fontWeight: 'bold',
    },
    personalizeButton: {
        backgroundColor: '#2D3748',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    personalizeButtonText: {
        color: '#7F5AF0',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    weeklyButton: {
        backgroundColor: '#2D3748',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    weeklyButtonText: {
        color: '#7F5AF0',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressModalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    progressModalContent: {
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        width: width * 0.8,
    },
    progressTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginTop: 15,
        textAlign: 'center',
    },
    progressDate: {
        fontSize: 16,
        color: '#A0AEC0',
        marginTop: 5,
    },
    progressCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#2D3748',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        borderWidth: 3,
        borderColor: '#7F5AF0',
    },
    progressText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#7F5AF0',
    },
    progressDetails: {
        fontSize: 16,
        color: '#E2E8F0',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#2D3748',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#7F5AF0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        marginVertical: 20,
    },
    submitButtonGradient: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#E2E8F0',
        fontSize: 18,
        fontWeight: 'bold',
    },
    weeklyProgressList: {
        width: '100%',
        maxHeight: 300,
        marginVertical: 20,
    },
    weeklyProgressItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#1A202C',
        borderRadius: 8,
    },
    weeklyProgressDate: {
        color: '#E2E8F0',
        fontSize: 14,
        marginBottom: 5,
    },
    weeklyProgressBar: {
        height: 8,
        backgroundColor: '#2D3748',
        borderRadius: 4,
        overflow: 'hidden',
        marginVertical: 5,
    },
    weeklyProgressFill: {
        height: '100%',
        borderRadius: 4,
    },
    weeklyProgressText: {
        color: '#A0AEC0',
        fontSize: 12,
        textAlign: 'right',
    },
});

export default Habit;
