import React, { useState } from 'react';
import { View,TextInput,ScrollView, Text, Button, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { supabase } from '../services/supabase'; // Adjust the import path as necessary

import Logo from '../components/Logo';
import Forms from '../components/Forms';
import ButtonArrow from '../components/ButtonArrow';




const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email, password
        });
        setLoading(false);

        if (error) {
            Alert.alert('Login Failed', error.message);
        } else {
            // Navigate to Home Screen upon successful login
            navigation.navigate('HomeBottomTab');
        }
    };

    const handleLogins =() => {
        navigation.navigate('HomeBottomTab');
    }

    const handleForget =() => {
        navigation.navigate('Forget');
    }

    const handleSignup =() => {
        navigation.navigate('SignUp');
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 6, backgroundColor:'white' }}>
            <View className='flex-1 justify-center items-center px-6 '>
                        <View className='mb-10'>
                            <Logo size={150}/>
                        </View>
                        <View className='w-full bg-gray-300 rounded-lg px-8 py-5'>
                            <Forms type={'login'}/>
                        </View>
                        <View className='w-full flex-row justify-between items-center mt-5'>
                            <Text 
                                className='font-bold text-lg text-neutral-600 tracking-wider' 
                                onPress={handleForget}>Forgot?</Text>
                            <ButtonArrow onPress={handleLogins} title={'login'}/>
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
                        {/* <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <Button title={loading ? 'Logging in...' : 'Login'} onPress={() => navigation.navigate('HomeBottomTab')} disabled={loading} />
                        <Button
                            title="Don't have an account? Sign Up"
                            onPress={() => navigation.navigate('SignUp')}
                        /> */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 16,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
    },
});

export default LoginScreen;
