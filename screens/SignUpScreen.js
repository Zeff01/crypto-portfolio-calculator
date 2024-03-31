import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Alert } from "react-native";
import { supabase } from "../services/supabase";
import Logo from "../components/Logo";
import Forms from "../components/Forms";
import { AuthFetch } from "../queries";

import {
  firstNameSchema,
  lastNameSchema,
  usernameSchema,
  passwordSchema,
  emailSchema,
} from "../utils/formValidator";
import Button from "../components/Button";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [repeatPasswordValid, setRepeatPasswordValid] = useState(false);
  const [formValid, setFormValid] = useState(false);
  

  function validator(schema, item, setter) {
    try {
      schema.parse(item);
      setter(true);
    } catch (error) {
      setter(false);
    }
  }

  useEffect(() => {
    validator(firstNameSchema, firstName, setFirstNameValid);
  }, [firstName]);
  useEffect(() => {
    validator(lastNameSchema, lastName, setLastNameValid);
  }, [lastName]);
  useEffect(() => {
    validator(usernameSchema, username, setUsernameValid);
  }, [username]);
  useEffect(() => {
    validator(emailSchema, email, setEmailValid);
  }, [email]);
  useEffect(() => {
    validator(passwordSchema, password, setPasswordValid);
  }, [password]);
  useEffect(() => {
    setRepeatPasswordValid(
      password === repeatPassword && repeatPassword.length !== 0
    );
  }, [repeatPassword, password]);

  useEffect(() => {
    setFormValid(
      Boolean(
        firstNameValid &&
          lastNameValid &&
          usernameValid &&
          emailValid &&
          passwordValid &&
          repeatPasswordValid
      )
    );
  }, [
    firstNameValid,
    lastNameValid,
    usernameValid,
    emailValid,
    passwordValid,
    repeatPasswordValid,
  ]);

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
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    if (!firstNameSchema.safeParse(firstName).success) {
      Alert.alert("Validation Error", "First Name is invalid.");
      return;
    }

    try {
      setLoading(true)
      const res = await AuthFetch.signup({
        email,
        password,
        username,
        firstName,
        lastName
      })
      if (res.status === 201) {
        console.log('user created')
        Alert.alert("Signup Successful", "Login to continue");
        navigation.navigate("Login");
        return;
      }
      throw new Error('somethin went wrong on signup step')
    } catch (error) {
      console.error('failed to create user', error)
    } finally {
      setLoading(false)
      return
    }

    // try {
    //   const { data, error } = await supabase.auth.signUp({
    //     email,
    //     password,
    //     options: {
    //       data: {
    //         username: username,
    //         firstName: firstName,
    //         lastName: lastName,
    //       },
    //     }        
    //   });
    //   if (error) throw error;

    //   setLoading(false);

    //   if (data?.user) {
    //     const { error: insertError } = await supabase
    //       .from("subscription")
    //       .insert([
    //         {
    //           isPaid: false,
    //           userId: data.user.id,
    //           email: email,
    //           firstName: firstName,
    //           lastName: lastName,
    //           username: username,
    //         },
    //       ]);

    //     if (insertError) throw insertError;
    //   }
    //   Alert.alert("Signup Successful", "Login to continue");
    //   navigation.navigate("Login");
    // } catch (error) {
    //   console.error("Signup Error:", error.message);
    //   Alert.alert("Signup Failed", error.message);
    //   setLoading(false);
    // }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "flex-start",
        paddingHorizontal: 6,
        backgroundColor: "white",
        paddingTop: 50,
      }}
    >
      <View className=" w-full items-center px-6  pb-8">
        <View className="flex flex-row w-full items-end justify-between  text-start  relative mb-8">
          <View className="">
            <Logo size={33.47} />
          </View>
          <Text className="text-[16px] font-[400] leading-[24px] tracking-[1.5px]">
            Crypto Profit
          </Text>
          <View></View>
        </View>
        <View className="flex w-full mb-2">
          <Text className="text-[24px] w-[500] leading-8">Register</Text>
        </View>
        <View className="w-full rounded-lg">
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
        <View className="w-full  mt-5">
          <Button
            onPress={handleSignUp}
            title={"Sign Up"}
            style={{ opacity: formValid && !loading ? 1 : 0.5 }}
            disabled={!formValid || loading}
            loading={loading}
          />
        </View>
        <View className="w-full flex-col justify-between items-center mt-4 ">
          <Text className="font-[500] text-[14px] text-[#B4B4B4] tracking-wider capitalize mb-2 ">
            Already have an account?
          </Text>
          <Text
            className="font-[500] text-[14px] text-[#1E1E1E] tracking-wider capitalize"
            onPress={handleLogin}
          >
            Login
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
