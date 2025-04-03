import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

interface Bubble {
    id: number;
    x: number;
    y: number;
    scale: Animated.Value;
    opacity: Animated.Value;
}

const BubblePop: React.FC = () => {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    
    useEffect(() => {
        createBubble();
        return () => {
            // Cleanup timeouts when component unmounts
            bubbles.forEach(bubble => {
                bubble.scale.stopAnimation();
                bubble.opacity.stopAnimation();
            });
        };
    }, []);

    const createBubble = () => {
        const newBubble: Bubble = {
            id: Date.now(),
            x: Math.random() * (width - 60),
            y: Math.random() * (height - 60),
            scale: new Animated.Value(0),
            opacity: new Animated.Value(1),
        };

        setBubbles(prevBubbles => [...prevBubbles, newBubble]);

        Animated.spring(newBubble.scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();

        setTimeout(createBubble, Math.random() * 1000 + 500);
    };

    const popBubble = (id: number) => {
        const bubble = bubbles.find(b => b.id === id);
        if (!bubble) return;
        
        setScore(prev => prev + 1);

        Animated.parallel([
            Animated.spring(bubble.scale, {
                toValue: 1.5,
                useNativeDriver: true,
            }),
            Animated.timing(bubble.opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setBubbles(prevBubbles => prevBubbles.filter(b => b.id !== id));
        });
    };

    return (
        <LinearGradient 
            colors={['#171923', '#0D1117']} 
            style={styles.container}
        >
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
            {bubbles.map(bubble => (
                <Animated.View
                    key={bubble.id}
                    style={[
                        styles.bubble,
                        {
                            left: bubble.x,
                            top: bubble.y,
                            transform: [{ scale: bubble.scale }],
                            opacity: bubble.opacity,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.bubbleTouch}
                        onPress={() => popBubble(bubble.id)}
                    />
                </Animated.View>
            ))}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scoreContainer: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#2D3748',
        padding: 10,
        borderRadius: 10,
        zIndex: 1,
    },
    scoreText: {
        color: '#E2E8F0',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bubble: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#7F5AF0',
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    bubbleTouch: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
});

export default BubblePop;