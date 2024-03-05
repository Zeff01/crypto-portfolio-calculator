import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text, Button, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { supabase } from '../services/supabase'; // Adjust the import path as necessary
import useAuthStore from '../store/useAuthStore'
import Logo from '../components/Logo';
import Forms from '../components/Forms';
import ButtonArrow from '../components/ButtonArrow';




const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const { data: session, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);
        console.log({email, password, error})
        if (error) {            
            Alert.alert('Login Failed', error.message);
        } else {
            useAuthStore.getState().login(session);
        }
    };


    const handleForget = () => {
        navigation.navigate('Forget');
    }

    const handleSignup = () => {
        navigation.navigate('SignUp');
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 6, backgroundColor: 'white' }}>
            <View className='flex-1 justify-center items-center px-6 '>
                <View className='mb-10'>
                    <Logo size={150} />
                </View>
                <View className='w-full bg-gray-200 rounded-lg px-6 py-4'>
                    <Forms type={'login'} setEmail={setEmail} setPassword={setPassword} />

                </View>
                <View className='w-full flex-row justify-between items-center mt-5'>
                    <Text
                        className='font-bold text-lg text-neutral-600 tracking-wider'
                        onPress={handleForget}>Forgot?</Text>
                    <ButtonArrow 
                    onPress={handleLogin} 
                    title={'login'} 
                    disabled={Boolean(loading||!password||!email)}
                    loading={loading}
                    style={{opacity: (!loading&&password&&email)?1:0.5}}

                    />
                </View>
                <View className='w-full flex-col justify-between items-center mt-10  py-10'>
                    <Text className='font-bold text-lg text-neutral-600 tracking-wider capitalize'>
                        don't have an account yet?
                    </Text>
                    <Text
                        className='font-bold text-lg text-indigo-500 tracking-wider capitalize'
                        onPress={handleSignup}>
                        create account
                    </Text>
                </View>

            </View>
        </ScrollView>
    );
};



export default LoginScreen;
