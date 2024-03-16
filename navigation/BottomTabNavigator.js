import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { StackNavigator, PortfolioStackScreen } from './AuthStackNavigator';
import PortfolioStackNavigator from './PortfolioStackNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'PortfolioTab') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                headerStyle: {
                    backgroundColor: '#6200ee',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="PortfolioTab"
                component={PortfolioStackNavigator}
                options={({ navigation }) => ({
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('AddCoin')}>
                            <Ionicons name="add" size={30} color="#fff" style={{ marginRight: 5 }} />
                        </TouchableOpacity>
                    ),
                    title: 'Portfolio',
                })}
            />
            <Tab.Screen name="HomeTab" component={HomeScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
