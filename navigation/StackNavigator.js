import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import useAuthStore from '../store/useAuthStore';

// Import your screens
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AddCoinScreen from '../screens/AddCoinScreen';
import { supabase } from '../services/supabase';
import { useNavigation } from '@react-navigation/native';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import CoinScreen from '../screens/CoinScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const authToken = useAuthStore((state) => state.authToken);
    const navigation = useNavigation()
    useEffect(() => {

        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession()

            if (data.session) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeBottomTab' }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        }
        getSession()
    }, [navigation]);

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
            <Stack.Screen name="HomeBottomTab" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
                name="AddCoin"
                component={AddCoinScreen}
                options={({ navigation }) => ({
                    title: 'Add Coin',

                })}
            />
            <Stack.Screen
                name="Coin"
                component={CoinScreen}
                options={({ navigation }) => ({
                    title: 'Coin Info',

                })}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    title: '',
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    title: '',
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen name="Forget" component={ForgetPasswordScreen} />

        </Stack.Navigator>

    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginRight: 10,
    },
});

export default StackNavigator;
