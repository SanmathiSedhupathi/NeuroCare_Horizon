import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, GestureResponderEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ZenGarden = () => {
    const [placedElements, setPlacedElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState('tree');

    const elementTypes = ['tree', 'flower', 'stone', 'water'];

    const handleGardenPress = (event: GestureResponderEvent) => {
        const position = {
            x: event.nativeEvent.locationX,
            y: event.nativeEvent.locationY
        };
        setPlacedElements([...placedElements, { type: selectedElement, position }]);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.garden} 
                onPress={handleGardenPress}
                activeOpacity={1}
            >
                {placedElements.map((element, index) => (
                    <Animated.View
                        key={index}
                        style={[styles.element, { left: element.position.x, top: element.position.y }]}
                    >
                        <MaterialCommunityIcons name={element.type} size={30} color="#2D3748" />
                    </Animated.View>
                ))}
            </TouchableOpacity>
            <View style={styles.toolbar}>
                {elementTypes.map((type) => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => setSelectedElement(type)}
                        style={[
                            styles.toolbarItem,
                            selectedElement === type && styles.selectedItem
                        ]}
                    >
                        <MaterialCommunityIcons name={type} size={24} color="#7F5AF0" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171923',
    },
    garden: {
        flex: 1,
        backgroundColor: '#E2E8F0',
    },
    toolbar: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#2D3748',
        justifyContent: 'center',
    },
    toolbarItem: {
        padding: 8,
        marginHorizontal: 8,
        borderRadius: 8,
        backgroundColor: '#1A202C',
    },
    selectedItem: {
        backgroundColor: '#7F5AF0',
    },
    element: {
        position: 'absolute',
    },
});

export default ZenGarden;