import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabase';

import Logo from '../components/Logo';
import Forms from '../components/Forms';
import ButtonArrow from '../components/ButtonArrow';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');

    const handleSignUp = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email, password, options: {
                data: {
                    username: username,
                }
            }
        });

        setLoading(false);

        if (data?.user) {

            await supabase
                .from('subscription')
                .insert([
                    { isPaid: false, userId: data.user.id }
                ]);


        }

        if (error) {
            Alert.alert('Signup Failed', error.message);
        } else {
            Alert.alert('Signup Successful', 'Login to continue');
            // Optionally navigate to Login Screen or Home Screen after signup
            navigation.navigate('Login');
        }
    };

    const handleLogins = () => {
        navigation.navigate('HomeBottomTab');
    }

    const handleForget = () => {
        navigation.navigate('Forget');
    }

    const handleLogin = () => {
        navigation.navigate('Login');
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 6, backgroundColor: 'white' }}>
            <View className='flex-1 justify-start items-center px-6 '>
                <View className='w-full mb-10'>
                    <Logo size={80} />
                </View>
                <View className='w-full bg-gray-200 rounded-lg px-6 py-4'>
                    <Forms setEmail={setEmail} setPassword={setPassword} setUsername={setUsername} />
                </View>
                <View className='w-full flex-row justify-end items-center mt-5'>
                    <ButtonArrow onPress={handleSignUp} title={'Signup'} />
                </View>
                <View className='w-full flex-col justify-between items-center mt-10  py-10'>
                    <Text className='font-bold text-lg text-neutral-600 tracking-wider capitalize'>
                        Already have an account?
                    </Text>
                    <Text
                        className='font-bold text-lg text-indigo-500 tracking-wider capitalize'
                        onPress={handleLogin}>
                        login
                    </Text>
                </View>

            </View>
        </ScrollView>
    );
};


export default SignUpScreen;
