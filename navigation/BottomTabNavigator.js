// In BottomTabNavigator.js or wherever your BottomTabNavigator is defined
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
                name="Portfolio"
                component={PortfolioScreen}
                options={({ navigation }) => ({
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('AddCoin')}>
                            <Ionicons name="add" size={30} color="#fff" />
                        </TouchableOpacity>
                    ),
                    title: 'Portfolio', // Ensure you have a title for aesthetics
                })}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
