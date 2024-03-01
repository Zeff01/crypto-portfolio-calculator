import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { navigationRef } from './navigationActions'; // Updated import path
import DrawerNavigator from './DrawerTabNavigator';

const RootNavigation = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <DrawerNavigator />
        </NavigationContainer>
    );
};

export default RootNavigation;
