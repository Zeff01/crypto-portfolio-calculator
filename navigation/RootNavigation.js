import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { navigationRef } from './navigationActions'; // Updated import path

const RootNavigation = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <StackNavigator />
        </NavigationContainer>
    );
};

export default RootNavigation;
