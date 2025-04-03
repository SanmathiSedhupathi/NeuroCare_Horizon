import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './pages/ChatScreen';
import Home from './pages/Home';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';
import { TouchableOpacity, StatusBar, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Habit from './pages/Habit';
import Settings from './pages/Settings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeProvider } from './context/ThemeContext';
import Games from './pages/Games';
import ZenGarden from './pages/ZenGarden';
import ColorFlow from './pages/ColorFlow';
import BubblePop from './pages/BubblePop';
import JournalApp from './pages/JournalApp';
import Hobbies from './pages/Hobbies';
import Doctors from './pages/Doctors';
import Profile from './pages/Profile';
import History from './pages/History';
import SnakeGame from './pages/SnakeGame';
import 'react-native-url-polyfill/auto';
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';

if (typeof global.setImmediate === 'undefined') {
  polyfillGlobal('setImmediate', () => (callback: (...args: any[]) => void) => {
    return setTimeout(callback, 0);
  });
}

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor="#171923" />
                <Stack.Navigator 
                    initialRouteName="Login"
                    screenOptions={{
                        headerBackground: () => (
                            <LinearGradient
                                colors={['#171923', '#1A202C']}
                                style={{ flex: 1 }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        ),
                        headerTintColor: '#E2E8F0',
                        headerStyle: {
                            height: 60,
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTitleStyle: {
                            fontWeight: '600',
                            fontSize: 18,
                            color: '#E2E8F0',
                        },
                        headerTitleAlign: 'center'
                    }}
                >
                    <Stack.Screen 
                        name="Login" 
                        component={Login}
                        options={{
                            headerShown: false
                        }}
                    />

                    <Stack.Screen 
                        name="Register" 
                        component={Register}
                        options={{
                            headerShown: false
                        }}
                    />

                    <Stack.Screen 
                        name="Home" 
                        component={Home}
                        options={({ navigation }) => ({
                            title: 'Welcome',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.toggleDrawer()}
                                    style={{ marginLeft: 16 }}
                                >
                                    <MaterialCommunityIcons 
                                        name="menu" 
                                        size={24} 
                                        color="#E2E8F0" 
                                    />
                                </TouchableOpacity>
                            ),
                        })}
                    />
                    
                    <Stack.Screen 
                        name="ChatBot" 
                        component={ChatScreen}
                        options={({ navigation }) => ({
                            title: 'ChatBot',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('Home')}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="home" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />

                    <Stack.Screen 
                        name="Support" 
                        component={Support}
                        options={({ navigation }) => ({
                            title: 'Support',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />

                    <Stack.Screen 
                        name="Habit" 
                        component={Habit}
                        options={({ navigation }) => ({
                            title: 'Daily Habits',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />

                    <Stack.Screen 
                        name="Settings" 
                        component={Settings}
                        options={({ navigation }) => ({
                            title: 'Settings',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <MaterialCommunityIcons 
                                        name="arrow-left" 
                                        size={24} 
                                        color="#7F5AF0" 
                                    />
                                </TouchableOpacity>
                            ),
                        })}
                    />

                    <Stack.Screen 
                        name="Games" 
                        component={Games}
                        options={({ navigation }) => ({
                            title: 'Games',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />

                    <Stack.Screen 
                        name="ZenGarden" 
                        component={ZenGarden}
                        options={({ navigation }) => ({
                            title: 'Zen Garden',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />

                    <Stack.Screen 
                        name="ColorFlow" 
                        component={ColorFlow}
                        options={({ navigation }) => ({
                            title: 'Color Flow',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />

                    <Stack.Screen 
                        name="BubblePop" 
                        component={BubblePop}
                        options={({ navigation }) => ({
                            title: 'Bubble Pop',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />
                    <Stack.Screen 
                        name="Doctors" 
                        component={Doctors}
                        options={({ navigation }) => ({
                            title: 'Doctors',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />
                     <Stack.Screen 
                        name="Profile" 
                        component={Profile}
                        options={({ navigation }) => ({
                            title: 'Doctors',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />
 <Stack.Screen 
                        name="History" 
                        component={History}
                        options={({ navigation }) => ({
                            title: 'Doctors',
                            headerLeft: () => (
                                <TouchableOpacity 
                                    onPress={() => navigation.goBack()}
                                    style={styles.headerButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                                </TouchableOpacity>
                            ),
                        })}
                    />

                    <Stack.Screen 
                        name="JournalApp" 
                        component={JournalApp}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen 
                        name="Hobbies" 
                        component={Hobbies}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen 
                        name="SnakeGame" 
                        component={SnakeGame}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginLeft: 15,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#2D3748',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    }
});

export default App;
