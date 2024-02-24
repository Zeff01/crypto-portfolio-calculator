import React from 'react';
import { View, Text, Button } from 'react-native';

const SignInScreen = ({ navigation }) => {
    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-lg mb-4">SignIn Screen</Text>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
};

export default SignInScreen;
