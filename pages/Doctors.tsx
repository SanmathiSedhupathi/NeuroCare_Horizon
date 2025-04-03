import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GEOAPIFY_API_KEY = 'ff5b745726394f58b8e09bf5a9921e3a';

interface Coords {
    latitude: number;
    longitude: number;
}

interface PlaceProperties {
    name: string;
    address_line1: string;
    address_line2: string;
    tel: string;
    place_id: string;
    lat: number;
    lon: number;
}

interface Place {
    properties: PlaceProperties;
}

const predefinedCoords: Coords = {
    latitude: 11.0168,   // Latitude of Coimbatore
    longitude: 76.9558,  // Longitude of Coimbatore
};

const openDirections = (place: Place) => {
    const { lat, lon, name } = place.properties;
    const origin = `${predefinedCoords.latitude},${predefinedCoords.longitude}`;
    const destination = `${lat},${lon}`;

    const scheme = Platform.select({
        ios: `maps://app?saddr=${origin}&daddr=${destination}`,
        android: `google.navigation:q=${destination}&mode=d`,
    });

    const browserUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    Linking.canOpenURL(scheme!).then((supported) => {
        if (supported) {
            Linking.openURL(scheme!);
        } else {
            Linking.openURL(browserUrl);
        }
    }).catch(() => {
        Linking.openURL(browserUrl);
    });
};

const Doctors: React.FC = () => {
    const navigation = useNavigation();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied');
                // Use predefined coordinates if permission denied
                fetchNearbyPlaces(predefinedCoords);
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({});
                const currentCoords: Coords = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                };
                fetchNearbyPlaces(currentCoords);
            } catch (error) {
                console.error('Error getting location:', error);
                fetchNearbyPlaces(predefinedCoords);
            }
        };

        getLocationPermission();
    }, []);

    const fetchNearbyPlaces = async (coords: Coords): Promise<void> => {
        try {
            const response = await fetch(
                `https://api.geoapify.com/v2/places?categories=healthcare.hospital&exclude=healthcare.hospital.speciality.eye&bias=proximity:${coords.longitude},${coords.latitude}&limit=10&apiKey=${GEOAPIFY_API_KEY}`
            );
            
            const data = await response.json();

            if (!data || !data.features) {
                console.error("No places found.");
                setPlaces([]); // Set an empty array to prevent errors
                setLoading(false);
                return;
            }

            setPlaces(data.features as Place[]);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const renderPlace = ({ item }: { item: Place }) => {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.properties.name}</Text>
                <Text style={styles.cardText}>{item.properties.address_line1}</Text>
                <Text style={styles.cardText}>{item.properties.address_line2}</Text>
                <Text style={styles.cardText}>{item.properties.tel}</Text>
                
                <TouchableOpacity 
                    style={styles.directionButton}
                    onPress={() => openDirections(item)}
                >
                    <MaterialCommunityIcons 
                        name="directions" 
                        size={20} 
                        color="#E2E8F0" 
                    />
                    <Text style={styles.directionButtonText}>
                        Get Directions
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <LinearGradient 
            colors={['#171923', '#0D1117']} 
            style={styles.container}
        >
            <FlatList
                data={places}
                keyExtractor={(item) => item.properties.place_id}
                renderItem={renderPlace}
                contentContainerStyle={styles.listContainer}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#1A202C',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#E2E8F0',
    },
    cardText: {
        color: '#A0AEC0',
        marginBottom: 4,
    },
    directionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7F5AF0',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        justifyContent: 'center',
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    directionButtonText: {
        color: '#E2E8F0',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Doctors;
