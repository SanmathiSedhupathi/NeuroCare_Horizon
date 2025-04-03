import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
    const navigation = useNavigation();
    const { theme, toggleTheme, colors } = useTheme();
    const [notifications, setNotifications] = React.useState(true);

    // Replace isDarkMode state with theme context
    const isDarkMode = theme === 'dark';

    // Update the renderSettingItem to use theme colors
    const renderSettingItem = (
        icon: string,
        title: string,
        subtitle: string,
        rightElement?: React.ReactNode
    ) => (
        <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingLeft}>
                <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
                <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.settingSubtitle, { color: colors.subtext }]}>{subtitle}</Text>
                </View>
            </View>
            {rightElement}
        </View>
    );

    return (
        <LinearGradient colors={colors.background} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons 
                        name="arrow-left" 
                        size={24} 
                        color={colors.text} 
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            </View>

            <ScrollView style={styles.content}>
                {renderSettingItem(
                    'theme-light-dark',
                    'Dark Mode',
                    'Toggle dark/light theme',
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : colors.text}
                    />
                )}

                {renderSettingItem(
                    'bell-outline',
                    'Notifications',
                    'Enable push notifications',
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : colors.text}
                    />
                )}

                {renderSettingItem(
                    'account-outline',
                    'Account',
                    'Manage your account'
                )}

                {renderSettingItem(
                    'shield-outline',
                    'Privacy',
                    'Privacy settings'
                )}

                {renderSettingItem(
                    'help-circle-outline',
                    'Help',
                    'Get support'
                )}

                {renderSettingItem(
                    'information-outline',
                    'About',
                    'App information'
                )}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        marginLeft: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 14,
    },
});

export default Settings;