import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';

const ColorFlow = () => {
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const colors = [
        { id: 0, color: '#7F5AF0' },
        { id: 1, color: '#2CB67D' },
        { id: 2, color: '#FF8906' },
        { id: 3, color: '#E53170' }
    ];

    const startGame = () => {
        setSequence([Math.floor(Math.random() * 4)]);
        setUserSequence([]);
        setIsPlaying(true);
        setScore(0);
    };

    const playSequence = async () => {
        for (let i = 0; i < sequence.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Flash the color
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        setIsPlaying(false);
    };

    const handlePress = (colorId: number) => {
        if (isPlaying) return;

        const newUserSequence = [...userSequence, colorId];
        setUserSequence(newUserSequence);

        if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
            // Game Over
            setIsPlaying(true);
            setTimeout(startGame, 1000);
            return;
        }

        if (newUserSequence.length === sequence.length) {
            setScore(score + 1);
            setUserSequence([]);
            setSequence([...sequence, Math.floor(Math.random() * 4)]);
            setIsPlaying(true);
            setTimeout(() => playSequence(), 1000);
        }
    };

    useEffect(() => {
        if (sequence.length > 0 && isPlaying) {
            playSequence();
        }
    }, [sequence]);

    return (
        <View style={styles.container}>
            <Text style={styles.score}>Score: {score}</Text>
            <View style={styles.grid}>
                {colors.map(({ id, color }) => (
                    <TouchableOpacity
                        key={id}
                        style={[styles.colorButton, { backgroundColor: color }]}
                        onPress={() => handlePress(id)}
                        disabled={isPlaying}
                    />
                ))}
            </View>
            {!isPlaying && sequence.length === 0 && (
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={styles.startText}>Start Game</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171923',
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 220,
        height: 220,
        justifyContent: 'center',
    },
    colorButton: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 8,
    },
    score: {
        fontSize: 24,
        color: '#E2E8F0',
        marginBottom: 32,
    },
    startButton: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#7F5AF0',
        borderRadius: 8,
    },
    startText: {
        color: '#E2E8F0',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ColorFlow;