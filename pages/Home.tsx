import React, { useEffect, useRef, useState } from 'react';
import { 
    View, 
    Text,
    StyleSheet, 
    Animated, 
    TouchableOpacity, 
    Dimensions,
    Easing,
    TextInput,
    FlatList,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
    Home: undefined;
    Doctors: undefined;
    ChatBot: undefined; // Changed from ChatScreen to ChatBot
    // ...other screens
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation<NavigationProp>();
    const { colors } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const expandAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCards] = useState<{ icon: "hospital-building" | "history" | "cog" | "calendar-check" | "account" | "notebook" | "star" | "palette"; title: string; index: number }[]>([
        { icon: "hospital-building", title: "Doctors", index: 0 }, // Changed from chat/ChatScreen
        { icon: "history", title: "History", index: 1 },
        { icon: "cog", title: "Settings", index: 2 },
        { icon: "calendar-check", title: "Habit", index: 3 },
        { icon: "account", title: "Profile", index: 4 },
        { icon: "notebook", title: "JournalApp", index: 5 },
        { icon: "star", title: "Games", index: 6 },
        { icon: "palette", title: "Hobbies", index: 7 }
    ]);

    useEffect(() => {
        startAnimations();
    }, []);

    const startAnimations = () => {
        Animated.parallel([
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ),
        ]).start();
    };

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
        Animated.parallel([
            Animated.spring(expandAnim, {
                toValue: isExpanded ? 0 : 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: isExpanded ? 1 : 0.8,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    };

    const renderCard = (icon: "hospital-building" | "history" | "cog" | "calendar-check" | "account" | "notebook" | "star" | "palette", title: string, index: number) => {
        const angleRad = ((index * 45) * Math.PI) / 180;
        const distance = (title === "Profile" || title === "Doctors") ? 130 : 200; // Reduced from 160 to 130
        const verticalOffset = -150;
        
        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [
                            {
                                translateX: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, distance * Math.cos(angleRad)]
                                })
                            },
                            {
                                translateY: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, (distance * Math.sin(angleRad)) + verticalOffset]
                                })
                            },
                            { scale: expandAnim },
                            {
                                rotate: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg']
                                })
                            }
                        ],
                        opacity: expandAnim
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.cardButton}
                    onPress={() => navigation.navigate(title as keyof RootStackParamList)}
                >
                    <LinearGradient
                        colors={['#2D3748', '#1A202C']}
                        style={styles.cardContent}
                    >
                        <MaterialCommunityIcons name={icon} size={24} color="#7F5AF0" />
                        <Text style={styles.cardText}>{title}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderCircleAnimation = () => {
        return (
            <Animated.View style={styles.circleContainer}>
                <LinearGradient
                    colors={['#7F5AF0', '#6B46C1']}
                    style={styles.circleGradient}
                >
                    <Animated.View style={{
                        transform: [
                            { rotate: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })}
                        ]
                    }}>
                        <View style={styles.particleRing}>
                            {[...Array(8)].map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.particle,
                                        {
                                            transform: [
                                                { rotate: `${i * 45}deg` },
                                                { translateX: 30 }
                                            ]
                                        }
                                    ]}
                                />
                            ))}
                        </View>
                    </Animated.View>
                </LinearGradient>
            </Animated.View>
        );
    };

    const renderParticleRing = () => {
        const spin = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        const counterSpin = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['360deg', '0deg']
        });

        return (
            <TouchableOpacity 
                style={styles.particleSystemContainer}
                onPress={() => navigation.navigate('ChatBot')}  // Changed from 'ChatScreen' to 'ChatBot'
                activeOpacity={0.7}
            >
                <Animated.View style={[styles.particleCore, {
                    transform: [{ scale: pulseAnim }]
                }]}>
                    <LinearGradient
                        colors={['#7F5AF0', '#6B46C1']}
                        style={styles.coreGradient}
                    >
                        <Text style={styles.botEmoji}>🤖</Text>
                    </LinearGradient>
                </Animated.View>

                <Animated.View style={[styles.orbitRing, {
                    transform: [{ rotate: spin }]
                }]}>
                    {[...Array(12)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.orbitParticleContainer,
                                {
                                    transform: [
                                        { rotate: `${i * 30}deg` },
                                        { translateX: 50 }
                                    ]
                                }
                            ]}
                        >
                            <Animated.View style={[styles.particle, {
                                transform: [{ scale: pulseAnim }]
                            }]} />
                        </View>
                    ))}
                </Animated.View>

                <Animated.View style={[styles.orbitRing, {
                    transform: [{ rotate: counterSpin }]
                }]}>
                    {[...Array(8)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.orbitParticleContainer,
                                {
                                    transform: [
                                        { rotate: `${i * 45}deg` },
                                        { translateX: 80 }
                                    ]
                                }
                            ]}
                        >
                            <Animated.View style={[styles.particleSmall, {
                                transform: [{ scale: pulseAnim }]
                            }]} />
                        </View>
                    ))}
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const getFilteredCards = () => {
        if (!searchQuery) return [];
        return filteredCards.filter(card => 
            card.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <MaterialCommunityIcons 
                    name="magnify" 
                    size={24} 
                    color="#7F5AF0" 
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search cards..."
                    placeholderTextColor="#4A5568"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        if (text.length > 0 && isExpanded) {
                            toggleExpansion();
                        }
                    }}
                />
            </View>
            
            <Animated.View 
                style={[
                    styles.profileCard,
                    { opacity: Animated.subtract(1, expandAnim) }
                ]}
            >
                <LinearGradient
                    colors={['#2D3748', '#1A202C']}
                    style={styles.profileGradient}
                >
                    <Image
                        source={{ uri: 'https://via.placeholder.com/120' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Thejus</Text>
                        <Text style={styles.profileStatus}>Online</Text>
                        <Text style={styles.profileRole}>Software Developer</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={28}
                            color="#7F5AF0"
                        />
                    </TouchableOpacity>
                </LinearGradient>
            </Animated.View>

            {searchQuery.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={getFilteredCards()}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.suggestionItem}
                                onPress={() => {
                                    navigation.navigate(item.title as keyof RootStackParamList);
                                    setSearchQuery('');
                                }}
                            >
                                <MaterialCommunityIcons 
                                    name={item.icon} 
                                    size={24} 
                                    color="#7F5AF0" 
                                />
                                <Text style={styles.suggestionText}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
            
            <View style={styles.menuContainer}>
                {renderCard("hospital-building", "Doctors", 0)} // Changed from chat/ChatScreen
                {renderCard("history", "History", 1)}
                {renderCard("cog", "Settings", 2)}
                {renderCard("calendar-check", "Habit", 3)}
                {renderCard("account", "Profile", 4)}
                {renderCard("notebook", "JournalApp", 5)}
                {renderCard("star", "Games", 6)}
                {renderCard("palette", "Hobbies", 7)}
            </View>
            
            <TouchableOpacity
                style={[
                    styles.centerButton, 
                    styles.centeredPosition,
                    { opacity: searchQuery.length > 0 ? 0 : 1 }
                ]}
                onPress={toggleExpansion}
                activeOpacity={0.8}
                pointerEvents={searchQuery.length > 0 ? 'none' : 'auto'}
            >
                <LinearGradient
                    colors={['#7F5AF0', '#6B46C1']}
                    style={styles.centerButtonGradient}
                >
                    <Animated.View style={{
                        transform: [
                            { rotate: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })},
                            { scale: scaleAnim }
                        ]
                    }}>
                        <MaterialCommunityIcons
                            name={isExpanded ? "close" : "plus"}
                            size={32}
                            color="#FFFFFF"
                        />
                    </Animated.View>
                </LinearGradient>
            </TouchableOpacity>
            {renderParticleRing()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171923',
    },
    menuContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 150,
    },
    centerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2D3748',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 2,
    },
    centerButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centeredPosition: {
        position: 'absolute',
        left: '50%',
        top: '35%',
        transform: [
            { translateX: -30 },
            { translateY: -30 }
        ],
        zIndex: 3,
    },
    card: {
        position: 'absolute',
        width: 110,
        height: 110,
        zIndex: 1,
    },
    cardButton: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    cardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    cardText: {
        marginTop: 10,
        fontSize: 16,
        color: '#E2E8F0',
        fontWeight: '600',
    },
    circleContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    circleGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    particleRing: {
        width: 60,
        height: 60,
        position: 'absolute',
    },
    particle: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    bottomCircleContainer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        zIndex: 1,
    },
    bottomCircleGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    particleSystemContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 50,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 1,
    },
    particleCore: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#7F5AF0',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        backgroundColor: '#2D3748',
    },
    coreGradient: {
        flex: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botEmoji: {
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 40,
    },
    orbitRing: {
        position: 'absolute',
        width: 160,
        height: 160,
    },
    orbitParticleContainer: {
        position: 'absolute',
        left: '50%',
        top: '50%',
    },
    particle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7F5AF0',
        marginLeft: -4,
        marginTop: -4,
    },
    particleSmall: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#6B46C1',
        marginLeft: -2,
        marginTop: -2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D3748',
        margin: 16,
        marginTop: 10,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#4A5568',
    },
    
    searchIcon: {
        marginRight: 12,
    },
    
    searchInput: {
        flex: 1,
        height: 50,
        color: '#E2E8F0',
        fontSize: 16,
    },
    
    suggestionsContainer: {
        position: 'absolute',
        top: 110,
        left: 16,
        right: 16,
        backgroundColor: '#2D3748',
        borderRadius: 12,
        maxHeight: 200,
        zIndex: 10,
        borderWidth: 1,
        borderColor: '#4A5568',
    },
    
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#4A5568',
    },
    
    suggestionText: {
        marginLeft: 12,
        color: '#E2E8F0',
        fontSize: 16,
    },
    profileCard: {
        marginHorizontal: 16,
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
        height: 120,
    },
    
    profileGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        borderWidth: 1,
        borderColor: '#4A5568',
        borderRadius: 16,
        height: '100%',
    },
    
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 0,
        borderRightWidth: 2,
        borderColor: '#7F5AF0',
    },
    
    profileInfo: {
        flex: 1,
        marginLeft: 16,
        paddingVertical: 12,
    },
    
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E2E8F0',
        marginBottom: 6,
    },
    
    profileStatus: {
        fontSize: 16,
        color: '#48BB78',
        marginBottom: 4,
    },

    profileRole: {
        fontSize: 14,
        color: '#A0AEC0',
    },
    
    profileButton: {
        padding: 16,
        height: '100%',
        justifyContent: 'center',
    }
});

export default Home;
