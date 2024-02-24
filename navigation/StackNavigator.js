import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../store/useAuthStore'
import { navigate } from './navigationActions';
import BottomTabNavigator from './BottomTabNavigator';
//SCREENS
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import HomeScreen from '../screens/HomeScreen';


const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const authToken = useAuthStore((state) => state.authToken);

    useEffect(() => {
        if (authToken) {
            navigate('Home');
        }
    }, [authToken]);

    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="HomeBottomTab" component={BottomTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
