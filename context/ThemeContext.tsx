import React, { createContext, useContext, useState } from 'react';

export const darkTheme = {
    background: ['#171923', '#0D1117'],
    card: '#2D3748',
    text: '#E2E8F0',
    subtext: '#A0AEC0',
    primary: '#7F5AF0',
    border: '#4A5568',
} as const;

export const lightTheme = {
    background: ['#F7FAFC', '#EDF2F7'],
    card: '#FFFFFF',
    text: '#2D3748',
    subtext: '#4A5568',
    primary: '#7F5AF0',
    border: '#E2E8F0',
} as const;

type ThemeType = typeof darkTheme;

interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    colors: ThemeType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const value = {
        theme,
        toggleTheme,
        colors: theme === 'dark' ? darkTheme : lightTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};