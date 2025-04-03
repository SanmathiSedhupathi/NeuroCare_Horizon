import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    ScrollView,
    Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ProfileStats {
    habits: number;
    streaks: number;
    chatSessions: number;
    gamesPlayed: number;
}

const Profile: React.FC = () => {
    const [stats] = useState<ProfileStats>({
        habits: 12,
        streaks: 5,
        chatSessions: 24,
        gamesPlayed: 8
    });

    const renderStatCard = (title: string, value: number, icon: keyof typeof MaterialCommunityIcons.glyphMap) => (
        <LinearGradient
            colors={['#2D3748', '#1A202C']}
            style={styles.statCard}
        >
            <MaterialCommunityIcons name={icon} size={24} color="#7F5AF0" />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </LinearGradient>
    );

    return (
        <LinearGradient 
            colors={['#171923', '#0D1117']} 
            style={styles.container}
        >
            <ScrollView>
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.name}>Thejus</Text>
                    <Text style={styles.role}>Software Developer</Text>
                    
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialCommunityIcons name="pencil" size={20} color="#E2E8F0" />
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                    {renderStatCard('Active Habits', stats.habits, 'calendar-check')}
                    {renderStatCard('Best Streak', stats.streaks, 'fire')}
                    {renderStatCard('Chat Sessions', stats.chatSessions, 'chat')}
                    {renderStatCard('Games Played', stats.gamesPlayed, 'gamepad-variant')}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Info</Text>
                    <LinearGradient
                        colors={['#2D3748', '#1A202C']}
                        style={styles.infoCard}
                    >
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="email" size={20} color="#7F5AF0" />
                            <Text style={styles.infoText}>thejus@gmail.com</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="phone" size={20} color="#7F5AF0" />
                            <Text style={styles.infoText}>+91 88877 33322</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="map-marker" size={20} color="#7F5AF0" />
                            <Text style={styles.infoText}>Erode, TamilNadu</Text>
                        </View>
                    </LinearGradient>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#7F5AF0',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginTop: 15,
    },
    role: {
        fontSize: 16,
        color: '#A0AEC0',
        marginTop: 5,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7F5AF0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 15,
    },
    editButtonText: {
        color: '#E2E8F0',
        marginLeft: 8,
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 16,
    },
    statCard: {
        width: (width - 48) / 2,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginTop: 8,
    },
    statTitle: {
        fontSize: 14,
        color: '#A0AEC0',
        marginTop: 4,
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 12,
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 16,
        color: '#E2E8F0',
        marginLeft: 12,
    },
});

export default Profile;