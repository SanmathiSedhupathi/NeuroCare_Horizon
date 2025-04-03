import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HistoryItem {
    id: string;
    title: string;
    date: string;
    type: 'chat' | 'habit' | 'game';
    score?: number;
    details: string;
}

const History: React.FC = () => {
    const [history] = useState<HistoryItem[]>([
        {
            id: '1',
            title: 'Chat Session',
            date: '2024-04-03',
            type: 'chat',
            details: 'Discussed anxiety management techniques'
        },
        {
            id: '2',
            title: 'Daily Habits',
            date: '2024-04-03',
            type: 'habit',
            score: 80,
            details: '8/10 habits completed'
        },
        {
            id: '3',
            title: 'Snake Game',
            date: '2024-04-02',
            type: 'game',
            score: 15,
            details: 'High score achieved'
        }
    ]);

    const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
        <LinearGradient
            colors={['#2D3748', '#1A202C']}
            style={styles.historyCard}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={
                        item.type === 'chat' ? 'chat' :
                        item.type === 'habit' ? 'calendar-check' : 'gamepad-variant'
                    }
                    size={24}
                    color="#7F5AF0"
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.details}>{item.details}</Text>
                {item.score !== undefined && (
                    <View style={styles.scoreContainer}>
                        <MaterialCommunityIcons name="star" size={16} color="#7F5AF0" />
                        <Text style={styles.score}>{item.score}</Text>
                    </View>
                )}
            </View>
        </LinearGradient>
    );

    return (
        <LinearGradient
            colors={['#171923', '#0D1117']}
            style={styles.container}
        >
            <Text style={styles.headerTitle}>Activity History</Text>
            <FlatList
                data={history}
                renderItem={renderHistoryItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </LinearGradient>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContainer: {
        padding: 16,
    },
    historyCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2D3748',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1A202C',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#A0AEC0',
        marginBottom: 8,
    },
    details: {
        fontSize: 14,
        color: '#E2E8F0',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    score: {
        fontSize: 14,
        color: '#7F5AF0',
        marginLeft: 4,
    },
});

export default History;