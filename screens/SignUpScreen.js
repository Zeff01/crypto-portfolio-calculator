import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { AntDesign } from '@expo/vector-icons';

import Logo from '../components/Logo';
import Forms from '../components/Forms';
import ButtonArrow from '../components/ButtonArrow';

import { firstNameSchema, lastNameSchema, usernameSchema, passwordSchema, emailSchema } from '../utils/formValidator';

const SignUpScreen = ({ navigation }) => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [firstNameValid, setFirstNameValid] = useState(false)
    const [lastNameValid, setLastNameValid] = useState(false)
    const [usernameValid, setUsernameValid] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)
    const [repeatPasswordValid, setRepeatPasswordValid] = useState(false)
    const [formValid, setFormValid] = useState(false)

    function validator(schema, item, setter) {
        try {
            schema.parse(item)
            setter(true)
        } catch (error) {
            setter(false)
        }
    }

    useEffect(() => {
        validator(firstNameSchema, firstName, setFirstNameValid)
    }, [firstName])
    useEffect(() => {
        validator(lastNameSchema, lastName, setLastNameValid)
    }, [lastName])
    useEffect(() => {
        validator(usernameSchema, username, setUsernameValid)
    }, [username])
    useEffect(() => {
        validator(emailSchema, email, setEmailValid)
    }, [email])
    useEffect(() => {
        validator(passwordSchema, password, setPasswordValid)
    }, [password])
    useEffect(() => {
        setRepeatPasswordValid(password === repeatPassword && repeatPassword.length !== 0)
    }, [repeatPassword, password])

    useEffect(() => {
        setFormValid(Boolean(
            firstNameValid&& 
            lastNameValid&& 
            usernameValid&& 
            emailValid&& 
            passwordValid&& 
            repeatPasswordValid
        ))
    }, [firstNameValid, lastNameValid, usernameValid, emailValid, passwordValid, repeatPasswordValid])
    

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
            <View style={{flex:1, justifyContent:'flex-start', alignItems:'center', paddingHorizontal:10}}>
                <View style={{width:'100%', marginVertical:10}}>
                    <Logo size={80} />
                </View>
                <View 
                className='w-full bg-gray-200 rounded-lg px-6 py-4' 
                >
                    <Forms 
                    setEmail={setEmail} 
                    setPassword={updatePassword} 
                    setUsername={setUsername} 
                    setLastName={setLastName} 
                    setFirstName={setFirstName} 
                    setRepeatPassword={updateRepeatPassword} 
                    loading={loading}
                    firstNameValid={firstNameValid}
                    lastNameValid={lastNameValid}
                    usernameValid={usernameValid}
                    emailValid={emailValid}
                    passwordValid={passwordValid}
                    repeatPasswordValid={repeatPasswordValid}
                    />
                </View>
                <View className='w-full flex-row justify-end items-center mt-5'>
                    <ButtonArrow 
                    onPress={handleSignUp} 
                    title={'Signup'} 
                    style={{opacity: (formValid&&!loading)?1:0.5}}
                    disabled={!formValid || loading}
                    loading={loading}
                    />
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
