import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ZenGarden from './ZenGarden';

// Add type for navigation
type RootStackParamList = {
  Games: undefined;
  ZenGarden: undefined;
  SnakeGame: undefined;
  BubblePop: undefined;
};

type GamesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Games = () => {
    const navigation = useNavigation<GamesScreenNavigationProp>();

    const games = [
        {
            title: "Zen Garden",
            description: "Create your own peaceful garden by arranging elements",
            icon: "flower",
            route: "ZenGarden"
        },
        {
            title: "Snake Game",
            description: "Classic snake game with a modern twist",
            icon: "snake",
            route: "SnakeGame"
        },
        {
            title: "Bubble Pop",
            description: "Pop calming bubbles and create patterns",
            icon: "circle-outline",
            route: "BubblePop"
        }
    ];

    interface Game {
        title: string;
        description: string;
        icon: string;
        route: keyof RootStackParamList;
    }

    const renderGameCard = (game: Game, index: number) => (
        <TouchableOpacity 
            key={index}
            onPress={() => {
                console.log('Navigating to:', game.route); // Add this for debugging
                navigation.navigate(game.route);
            }}
            style={styles.gameCard}
        >
            <LinearGradient
                colors={['#2D3748', '#1A202C']}
                style={styles.cardGradient}
            >
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons 
                        name={game.icon} 
                        size={40} 
                        color="#7F5AF0" 
                    />
                </View>
                <View style={styles.textContainer}></View>
                    <Text style={styles.gameTitle}>{game.title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#171923', '#1A202C']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Relaxation Games</Text>
                <Text style={styles.headerSubtitle}>Take a break and unwind</Text>
            </LinearGradient>
            
            <ScrollView style={styles.scrollView}>
                {games.map((game, index) => renderGameCard(game, index))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171923',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#2D3748',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#E2E8F0',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#A0AEC0',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    gameCard: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#2D3748',
        borderRadius: 16,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2D3748',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E2E8F0',
        marginBottom: 4,
    },
    gameDescription: {
        fontSize: 14,
        color: '#A0AEC0',
    },
});

export default Games;