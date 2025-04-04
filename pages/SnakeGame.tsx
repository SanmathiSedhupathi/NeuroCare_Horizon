import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const gridSize = 10;
const { width } = Dimensions.get('window');
const cellSize = Math.floor((width - 40) / gridSize);

const SnakeGame: React.FC = () => {
    const [snake, setSnake] = useState<{ x: number; y: number }[]>([
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
    ]);
    const [direction, setDirection] = useState<string>('RIGHT');
    const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        const gameInterval = setInterval(() => {
            const newSnake = [...snake];
            const head = { ...newSnake[0] };

            // Update the snake's head position based on the direction
            if (direction === 'UP') head.y -= 1;
            if (direction === 'DOWN') head.y += 1;
            if (direction === 'LEFT') head.x -= 1;
            if (direction === 'RIGHT') head.x += 1;

            newSnake.unshift(head);

            // Check if the snake eats the food
            if (head.x === food.x && head.y === food.y) {
                setFood({
                    x: Math.floor(Math.random() * gridSize),
                    y: Math.floor(Math.random() * gridSize),
                });
                setScore(score + 1); // Increment the score
            } else {
                newSnake.pop();
            }

            // Check for collisions with walls or itself
            if (
                head.x < 0 ||
                head.y < 0 ||
                head.x >= gridSize ||
                head.y >= gridSize ||
                newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
            ) {
                setGameOver(true);
                clearInterval(gameInterval);
            } else {
                setSnake(newSnake);
            }
        }, 200);

        return () => clearInterval(gameInterval);
    }, [snake, direction, food, gameOver, score]);

    const handleDirection = (newDirection: string) => {
        if (
            (newDirection === 'UP' && direction !== 'DOWN') ||
            (newDirection === 'DOWN' && direction !== 'UP') ||
            (newDirection === 'LEFT' && direction !== 'RIGHT') ||
            (newDirection === 'RIGHT' && direction !== 'LEFT')
        ) {
            setDirection(newDirection);
        }
    };

    const resetGame = () => {
        setSnake([
            { x: 2, y: 2 },
            { x: 1, y: 2 },
            { x: 0, y: 2 },
        ]);
        setDirection('RIGHT');
        setFood({ x: 5, y: 5 });
        setGameOver(false);
        setScore(0);
    };

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < gridSize; i++) {
            const row = [];
            for (let j = 0; j < gridSize; j++) {
                const isSnake = snake.some(segment => segment.x === j && segment.y === i);
                const isFood = food.x === j && food.y === i;
                row.push(
                    <View
                        key={`${i}-${j}`}
                        style={[
                            styles.cell,
                            isSnake ? styles.snakeCell : isFood ? styles.foodCell : styles.emptyCell
                        ]}
                    />
                );
            }
            grid.push(
                <View key={i} style={styles.row}>
                    {row}
                </View>
            );
        }
        return grid;
    };

    return (
        <LinearGradient colors={['#171923', '#0D1117']} style={styles.container}>
            <Text style={styles.title}>Snake Game</Text>
            <Text style={styles.score}>
                {gameOver ? `Game Over! Final Score: ${score}` : `Score: ${score}`}
            </Text>

            <View style={styles.gridContainer}>
                {renderGrid()}
            </View>

            {!gameOver && (
                <View style={styles.controls}>
                    <TouchableOpacity 
                        style={styles.controlButton} 
                        onPress={() => handleDirection('UP')}
                    >
                        <MaterialCommunityIcons name="arrow-up" size={30} color="#E2E8F0" />
                    </TouchableOpacity>
                    
                    <View style={styles.horizontalControls}>
                        <TouchableOpacity 
                            style={styles.controlButton} 
                            onPress={() => handleDirection('LEFT')}
                        >
                            <MaterialCommunityIcons name="arrow-left" size={30} color="#E2E8F0" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.controlButton} 
                            onPress={() => handleDirection('RIGHT')}
                        >
                            <MaterialCommunityIcons name="arrow-right" size={30} color="#E2E8F0" />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.controlButton} 
                        onPress={() => handleDirection('DOWN')}
                    >
                        <MaterialCommunityIcons name="arrow-down" size={30} color="#E2E8F0" />
                    </TouchableOpacity>
                </View>
            )}

            {gameOver && (
                <TouchableOpacity style={styles.retryButton} onPress={resetGame}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 20,
    },
    score: {
        fontSize: 20,
        color: '#E2E8F0',
        marginBottom: 20,
    },
    gridContainer: {
        borderWidth: 2,
        borderColor: '#2D3748',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#1A202C',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: cellSize,
        height: cellSize,
        borderWidth: 1,
        borderColor: '#2D3748',
    },
    snakeCell: {
        backgroundColor: '#7F5AF0',
    },
    foodCell: {
        backgroundColor: '#EF4444',
    },
    emptyCell: {
        backgroundColor: '#1A202C',
    },
    controls: {
        marginTop: 30,
        alignItems: 'center',
    },
    horizontalControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 150,
        marginVertical: 10,
    },
    controlButton: {
        backgroundColor: '#2D3748',
        padding: 15,
        borderRadius: 12,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    retryButton: {
        backgroundColor: '#7F5AF0',
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SnakeGame;
