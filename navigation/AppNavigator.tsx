import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Games from '../pages/Games';
import ZenGarden from '../pages/ZenGarden';
import ColorFlow from '../pages/ColorFlow';
import BubblePop from '../pages/BubblePop';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Games"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#171923',
          },
          headerTintColor: '#E2E8F0',
        }}
      >
        <Stack.Screen name="Games" component={Games} />
        <Stack.Screen name="ZenGarden" component={ZenGarden} />
        <Stack.Screen name="ColorFlow" component={ColorFlow} />
        <Stack.Screen name="BubblePop" component={BubblePop} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;