import React, { useState } from 'react';
import { View,TextInput,ScrollView, Text, Button, StyleSheet, Alert, KeyboardAvoidingView  } from 'react-native';
import { supabase } from '../services/supabase'; // Adjust the import path as necessary

import Logo from '../components/Logo';
import Forms from '../components/Forms';
import ButtonArrow from '../components/ButtonArrow';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSignUp = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email, password, options: {
                data: {
                    name: name,
                    age: 27,
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

    const handleLogins =() => {
        navigation.navigate('HomeBottomTab');
    }

    const handleForget =() => {
        navigation.navigate('Forget');
    }

    const handleLogin =() => {
        navigation.navigate('Login');
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 6, backgroundColor:'white' }}>
            <View className='flex-1 justify-start items-center px-6 '>
                        <View className='w-full mb-10'>
                            <Logo size={80}/>
                        </View>
                        <View className='w-full bg-gray-300 rounded-lg px-8 py-5'>
                            <Forms/>
                        </View>
                        <View className='w-full flex-row justify-end items-center mt-5'>
                            <ButtonArrow onPress={handleLogins} title={'Signup'}/>
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
        backgroundColor: '#fff',
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

export default SignUpScreen;
