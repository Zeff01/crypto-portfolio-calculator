import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabase'; // Adjust the import path as necessary

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
        console.log("data: from sign up", data)
        setLoading(false);

        if (data?.user) {
            console.log('goes here')
            const insertResponse = await supabase
                .from('subscription')
                .insert([
                    { isPaid: false, userId: data.user.id }
                ]);
            console.log("insertResponse:", insertResponse)

        }

        if (error) {
            Alert.alert('Signup Failed', error.message);
        } else {
            Alert.alert('Signup Successful', 'Login to continue');
            // Optionally navigate to Login Screen or Home Screen after signup
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SignUp Screen</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
            <TextInput
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
            <Button title={loading ? 'Signing up...' : 'Sign Up'} onPress={handleSignUp} disabled={loading} />
            <Button
                title="Already have an account? Login"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
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
