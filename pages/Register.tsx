import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';

export const registerUser = async (username: string, email: string, password: string) => {
    const response = await axios.post('http://192.168.183.17:3000/api/register', {
        username,
        email,
        password
    });
    return response.data;
};

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Register: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [username, setUsername] = useState(''); // Add this line
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            if (!username || !email || !password || !confirmPassword) {
                setError('Please fill in all fields');
                return;
            }

            if (username.length < 3) {
                setError('Username must be at least 3 characters long');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email');
                return;
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }

            setLoading(true);
            setError('');

            await registerUser(username, email, password);
            navigation.replace('Login');
        } catch (error: any) {
            console.error('Registration error:', error); // Log the error for debugging
            setError('Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#171923', '#0D1117']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started</Text>

                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={24}
                                color="#7F5AF0"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#4A5568"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

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
                                keyboardType="email-address"
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

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={24}
                                color="#7F5AF0"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="#4A5568"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!isConfirmPasswordVisible}
                            />
                            <TouchableOpacity
                                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                style={styles.eyeIcon}
                            >
                                <MaterialCommunityIcons
                                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                                    size={24}
                                    color="#7F5AF0"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                            onPress={handleRegister}
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
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
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
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
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
    registerButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
    },
    registerButtonDisabled: {
        opacity: 0.7,
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    loginText: {
        color: '#A0AEC0',
        fontSize: 14,
    },
    loginLink: {
        color: '#7F5AF0',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Register;