import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions,
    Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type RootStackParamList = {
    Home: undefined;
    ChatBot: undefined;
    Support: undefined;
    Habit: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Support: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const renderRoundCard = (title: string, icon: string, description: string) => (
        <View style={styles.roundCard}>
            <LinearGradient
                colors={['#2D3748', '#1A202C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.roundGradient}
            >
                <MaterialCommunityIcons 
                    name={icon} 
                    size={32} 
                    color="#7F5AF0" 
                />
                <Text style={styles.roundCardTitle}>{title}</Text>
                <Text style={styles.roundCardDescription}>{description}</Text>
            </LinearGradient>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <LinearGradient 
                colors={['#171923', '#0D1117']}
                style={styles.container}
            >
               <ScrollView style={styles.content}>
               <Text style={[styles.description, styles.glowingText]}>
    Success is the sum of small efforts, repeated day in and day out
</Text>
                    
                    <View style={styles.habitCard}>
                        <LinearGradient
                            colors={['#2D3748', '#1A202C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.habitGradient}
                        >
                            <MaterialCommunityIcons 
                                name="check-circle-outline" 
                                size={40} 
                                color="#7F5AF0" 
                            />
                            <Text style={styles.habitTitle}>Habit Check</Text>
                            <Text style={styles.habitDescription}>
                                Track your daily wellness activities and maintain healthy habits
                            </Text>
                            <TouchableOpacity 
                                style={styles.habitButton}
                                onPress={() => navigation.navigate('Habit')}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.habitButtonText}>Start Tracking</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    <View style={styles.roundCardsContainer}>
                        {renderRoundCard(
                            "Daily Goals", 
                            "target", 
                            "Set and achieve your daily targets"
                        )}
                        {renderRoundCard(
                            "Progress", 
                            "chart-line",
                            "Track your improvement over time"
                        )}
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#171923',
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    description: {
        fontSize: 18, // Increased font size
        color: '#E2E8F0',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 28,
        fontWeight: '700', // Making it bold
        letterSpacing: 0.5,
    },
    glowingText: {
        textShadowColor: 'rgba(127, 90, 240, 0.8)', // Purple glow
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        elevation: Platform.select({ android: 8, ios: 0 }),
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#E2E8F0',
        marginBottom: 10,
        textAlign: 'center',
    },
   
    habitCard: {
        width: Platform.OS === 'web' ? Math.min(width - 40, 600) : width - 40,
        marginVertical: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: Platform.select({ android: 8, ios: 0, web: 0 }),
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#4A5568',
        alignSelf: 'center',
    },
    habitGradient: {
        padding: 25,
        alignItems: 'center',
    },
    habitTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E2E8F0',
        marginVertical: 10,
        letterSpacing: 0.5,
    },
    habitDescription: {
        fontSize: 16,
        color: '#A0AEC0',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    habitButton: {
        backgroundColor: '#7F5AF0',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 10,
    },
    habitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    roundCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    roundCard: {
        width: width / 2 - 40,
        height: width / 2 - 40,
        borderRadius: (width / 2 - 40) / 2,
        overflow: 'hidden',
        elevation: Platform.select({ android: 8, ios: 0, web: 0 }),
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#4A5568',
    },
    roundGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    roundCardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E2E8F0',
        marginTop: 10,
        textAlign: 'center',
    },
    roundCardDescription: {
        fontSize: 14,
        color: '#A0AEC0',
        textAlign: 'center',
        marginTop: 5,
        paddingHorizontal: 10,
    }
});

export default Support;