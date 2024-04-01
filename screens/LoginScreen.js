import React, { useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import { supabase } from "../services/supabase"; // Adjust the import path as necessary
import Logo from "../components/Logo";
import Forms from "../components/Forms";
import Button from "../components/Button";
import { AuthFetch } from "../queries";
import useAuthStore from "../store/useAuthStore";
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login)
  

  const handleLogin = async () => {
    try {
      setLoading()
      const res = await AuthFetch.login({email, password})
      if (res.status === 200) {
        const {user, session} = res.data
        await AsyncStorage.setItem('session', JSON.stringify(session))
        login(session, user)
      }
    } catch (error) {
      console.error('error loggin in', error)
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false)
    }

    setLoading(true);
    const { data: session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    console.log({ email, password, error });
    if (error) {
      Alert.alert("Login Failed", error.message);
      return
    }
    const {data:{user}, error:err} = await supabase.auth.getUser()
    if (err || !user) {
      Alert.alert("encountered error when trying to get user data", err.message)
      return 
    }
    // TODO: add this when the changing the onAuthStateChange useEffect
    // useAuthStore.getState().login(session, user);
  };

  const handleForget = () => {
    navigation.navigate("Forget");
  };

  const handleSignup = () => {
    navigation.navigate("SignUp");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 6,
        backgroundColor: "white",
        paddingTop: 50,
      }}
    >
      <View className="flex h-full w-full justify-top items-center px-6">
        <View className="flex flex-row w-full items-center justify-center  text-start mb-[80px] mt-3 relative">
          <View className="absolute top-[-50%] left-[0%] translate-x-[-50%] translate-y-[-50%]">
            <Logo size={33.47} />
          </View>
          <Text className="text-[16px] font-[400] leading-[24px] tracking-[1.5px]">
            Crypto Profit
          </Text>
        </View>
        <View className="flex w-full mb-10">
          <Text className="text-[24px] w-[500] leading-8">Sign In</Text>
        </View>
        <View className="w-full rounded-lg">
          <Forms type={"login"} setEmail={setEmail} setPassword={setPassword} />
        </View>
        <View className="w-full flex-row justify-between items-center m-5">
          <Text
            className="font-[500] text-[14px] text-neutral-600 tracking-wider"
            onPress={handleForget}
          >
            Forgot?
          </Text>
        </View>
        <View className="w-full">
          <Button
            onPress={handleLogin}
            title={"login"}
            disabled={Boolean(loading || !password || !email)}
            loading={loading}
            style={{ opacity: !loading && password && email ? 1 : 0.9 }}
          />
        </View>
        <View className="w-full flex-col justify-between items-center mt-10  py-10">
          <Text className="font-[500] text-[14px] text-[#B4B4B4] tracking-wider capitalize mb-4">
            don't have an account yet?
          </Text>
          <Text
            className="font-[500] text-[14px] text-[#1E1E1E]  tracking-wider capitalize"
            onPress={handleSignup}
          >
            create account
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
