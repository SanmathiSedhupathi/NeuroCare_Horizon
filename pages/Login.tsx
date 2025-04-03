import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loginUser } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Register: undefined;
    
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Login: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const particleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startAnimations();
    }, []);

    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Start particle animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(particleAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(particleAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError('Please fill in all fields');
                return;
            }
    
            setLoading(true);
            setError('');
    
            const response = await loginUser(email, password);
            await AsyncStorage.setItem('userToken', response.token);
            
            // Reset form
            setEmail('');
            setPassword('');
            setError('');
            
            // Navigate to Home
            navigation.replace('Home');
        } catch (error: any) {
            setError(error.toString());
        } finally {
            setLoading(false);
        }
    };

    const renderParticles = () => {
        return [...Array(8)].map((_, i) => {
            const rotate = particleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [`${i * 45}deg`, `${i * 45 + 360}deg`],
            });

            return (
                <Animated.View
                    key={i}
                    style={[
                        styles.particle,
                        {
                            transform: [
                                { rotate },
                                { translateX: 100 },
                                { scale: particleAnim }
                            ]
                        }
                    ]}
                />
            );
        });
    };

    return (
        <LinearGradient
            colors={['#171923', '#0D1117']}
            style={styles.container}
        >
            <TouchableOpacity
                style={styles.skipButton}
                onPress={() => navigation.navigate('Home')}
            >
                <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color="#FFFFFF"
                />
            </TouchableOpacity>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.particleContainer}>
                    {renderParticles()}
                </View>

                <Animated.View
                    style={[
                        styles.loginContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim }
                            ]
                        }
                    ]}
                >
                    <Text style={styles.title}>NEUROCARE</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="email-outline"
                            size={24}
                            color="#7F5AF0"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#4A5568"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="lock-outline"
                            size={24}
                            color="#7F5AF0"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#4A5568"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            style={styles.eyeIcon}
                        >
                            <MaterialCommunityIcons
                                name={isPasswordVisible ? "eye-off" : "eye"}
                                size={24}
                                color="#7F5AF0"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        activeOpacity={0.7}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={['#7F5AF0', '#6B46C1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.signupContainer}>
    <Text style={styles.signupText}>Don't have an account? </Text>
    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signupLink}>Sign Up</Text>
    </TouchableOpacity>
</View>
                </Animated.View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start', // Change from 'center' to 'flex-start'
        padding: 20,
        paddingTop: '25%', // Add top padding to position the container
    },
    particleContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    particle: {
        position: 'absolute',
        width: 4,
        height: 4,
        backgroundColor: '#7F5AF0',
        borderRadius: 2,
    },
    // Add to StyleSheet
signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
},
signupText: {
    color: '#A0AEC0',
    fontSize: 14,
},
signupLink: {
    color: '#7F5AF0',
    fontSize: 14,
    fontWeight: '600',
},
    loginContainer: {
        backgroundColor: '#1A202C',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#2D3748',
        ...Platform.select({
            ios: {
                shadowColor: '#7F5AF0',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#E2E8F0',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0AEC0',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D3748',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#4A5568',
    },
    input: {
        flex: 1,
        height: 50,
        color: '#E2E8F0',
        marginLeft: 12,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 8,
    },
    loginButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
    },
    gradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    forgotPassword: {
        marginTop: 20,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#7F5AF0',
        fontSize: 14,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    skipButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#7F5AF0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
        zIndex: 1000,
    },
});

export default Login;