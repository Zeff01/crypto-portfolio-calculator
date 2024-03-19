import { View, TextInput, Text } from 'react-native'
import React, { useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'

const Forms = ({ 
  type, 
  setEmail, 
  setPassword, 
  setUsername, 
  setFirstName, 
  setLastName, 
  setRepeatPassword, 
  loading,
  firstNameValid,
  lastNameValid,
  usernameValid,
  emailValid,
  passwordValid,
  repeatPasswordValid,

}) => {

  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRepeatPasswordFocused, setIsRepeatPasswordFocused] = useState(false);

  return (
    <>
      {
        type === 'login' ? (
          <>
            <View className='flex flex-col gap-2 justify-center items-start py-3' style={{opacity:loading?0.5:1}}>
              <Text>Email</Text>
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base border-b '
                placeholderTextColor={'#a3a3a3'}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                onChangeText={setEmail}
              />
            </View>
            <View className='flex flex-col gap-2 justify-center items-start py-3' style={{opacity:loading?0.5:1}}>
              <Text>Password</Text>
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base border-b'
                placeholderTextColor={'#a3a3a3'}
                secureTextEntry
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChangeText={setPassword}
              />
            </View>
          </>
        ) : (
          <>
            <View className='flex flex-col justify-center items-start py-3' style={{opacity:loading?0.5:1}}>
              <Text>First Name</Text>
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base border-b'
                placeholderTextColor={'#a3a3a3'}
                onFocus={() => setIsFirstNameFocused(true)}
                onBlur={() => setIsFirstNameFocused(false)}
                onChangeText={setFirstName}
              />
            </View>
            <View className='flex flex-col justify-center items-start py-3' style={{opacity:loading?0.5:1}}>
              <Text>Last Name</Text>
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base border-b'
                placeholderTextColor={'#a3a3a3'}
                onFocus={() => setIsLastNameFocused(true)}
                onBlur={() => setIsLastNameFocused(false)}
                onChangeText={setLastName}
              />
            </View>
            <View className='flex flex-col justify-center items-start py-3' style={{opacity:loading?0.5:1}}>
              <Text>Username</Text>
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base border-b'
                placeholderTextColor={'#a3a3a3'}
                autoCapitalize="none"
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                onChangeText={setUsername}
              />
            </View>
            <View className='flex flex-col justify-center items-start py-3' style={{opacity:loading?0.5:1}}>
              <Text>Email</Text>
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base border-b'
                placeholderTextColor={'#a3a3a3'}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                onChangeText={setEmail}
              />
            </View>
            <View className='flex flex-col gap-2 justify-center items-start py-3' style={{opacity:loading?0.5:1}}>
              <Text>Password</Text>
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base border-b'
                placeholderTextColor={'#a3a3a3'}
                secureTextEntry
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChangeText={setPassword}
              />
            </View>
            <View className='flex flex-col gap-2 justify-center items-start py-3' style={{opacity:loading?0.5:1}}>
              <Text>Repeat Password</Text>
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base border-b'
                placeholderTextColor={'#a3a3a3'}
                secureTextEntry
                onFocus={() => setIsRepeatPasswordFocused(true)}
                onBlur={() => setIsRepeatPasswordFocused(false)}
                onChangeText={setPassword}
              />
            </View>
          </>
        )
      }
    </>
  )
}

export default Forms


