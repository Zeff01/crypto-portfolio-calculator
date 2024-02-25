import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../store/useAuthStore';

// Import your screens
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AddCoinScreen from '../screens/AddCoinScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const authToken = useAuthStore((state) => state.authToken);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#6200ee',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >



            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="HomeBottomTab" component={BottomTabNavigator} options={{ headerShown: false }} />

            <Stack.Screen
                name="AddCoin"
                component={AddCoinScreen}
                options={({ navigation }) => ({
                    title: 'Add Coin',

                })}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginRight: 10,
    },
});

export default StackNavigator;
