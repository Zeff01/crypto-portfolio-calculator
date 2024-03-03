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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);


    const updatePassword = (pwd) => {
        setPassword(pwd);
        setPasswordsMatch(pwd === repeatPassword);
    };

    const updateRepeatPassword = (pwd) => {
        setRepeatPassword(pwd);
        setPasswordsMatch(pwd === password);
    };


    const handleSignUp = async () => {
        if (!passwordsMatch) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email, password, options: {
                data: {
                    username: username,
                    firstName: firstName,
                    lastName: lastName
                }
            }
        });

        setLoading(false);

        if (data?.user) {

            await supabase
                .from('subscription')
                .insert([
                    { isPaid: false, userId: data.user.id, email: email, firstName: firstName, lastName: lastName }
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



    const handleLogin = () => {
        navigation.navigate('Login');
    }

    return (
        <ScrollView contentContainerStyle={{ justifyContent: 'center', paddingHorizontal: 6, backgroundColor: 'white', paddingTop: 20, flex: 1 }}>
            <View className='flex-1 justify-start items-center px-6 '>
                <View className='w-full '>
                    <Logo size={80} />
                </View>
                <View className='w-full bg-gray-200 rounded-lg px-6 py-4'>
                    <Forms setEmail={setEmail} setPassword={updatePassword} setUsername={setUsername} setLastName={setLastName} setFirstName={setFirstName} setRepeatPassword={updateRepeatPassword} />
                </View>
                <View className='w-full flex-row justify-end items-center mt-5'>
                    <ButtonArrow onPress={handleSignUp} title={'Signup'} />
                </View>
                <View className='w-full flex-col justify-between items-center mt-10 '>
                    <Text className='font-bold text-lg text-neutral-600 tracking-wider capitalize'>
                        Already have an account?
                    </Text>
                    <Text
                        className='font-bold text-lg text-indigo-500 tracking-wider capitalize'
                        onPress={handleLogin}>
                        Login
                    </Text>
                </View>

            </View>
        </ScrollView>
    );
};


export default SignUpScreen;
