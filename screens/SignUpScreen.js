import React from 'react';
import { View, Text, Button } from 'react-native';

const SignUpScreen = ({ navigation }) => {
    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-lg mb-4">SignUp Screen</Text>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
};

export default SignUpScreen;
