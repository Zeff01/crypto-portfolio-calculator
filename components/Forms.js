import { View, TextInput } from 'react-native'
import React, { useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'

const Forms = ({ type, setEmail, setPassword, setUsername }) => {
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRepeatPasswordFocused, setIsRepeatPasswordFocused] = useState(false);

  return (
    <>
      {
        type === 'login' ? (
          <>
            <View className='flex-row gap-2 justify-center items-center border-b px-2 pb-6'>
              <FontAwesome name='envelope-o' size={25} color={isEmailFocused ? '#6366f1' : '#242222'} type='regular' />
              <TextInput
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base '
                placeholder="Email"
                placeholderTextColor={'#a3a3a3'}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                onChangeText={setEmail}
              />
            </View>
            <View className='flex-row gap-2 justify-center items-center px-2 pt-6'>
              <FontAwesome name='lock' size={25} color={isPasswordFocused ? '#6366f1' : '#242222'} type='regular' />
              <TextInput
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base'
                placeholder="Password"
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
            <View className='flex-row gap-2 justify-center items-center border-b px-2 pb-6'>
              <FontAwesome name='user' size={25} color={isUsernameFocused ? '#6366f1' : '#f4f4f5'} type='regular' />
              <TextInput
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base '
                placeholder="Username"
                placeholderTextColor={'#a3a3a3'}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                onChangeText={setUsername}
              />
            </View>
            <View className='flex-row gap-2 justify-center items-center border-b px-2 py-6'>
              <FontAwesome name='envelope-o' size={25} color={isEmailFocused ? '#6366f1' : '#f4f4f5'} type='regular' />
              <TextInput
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base '
                placeholder="Email"
                placeholderTextColor={'#a3a3a3'}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                onChangeText={setEmail}
              />
            </View>
            <View className='flex-row gap-2 justify-center items-center border-b px-2 py-6'>
              <FontAwesome name='lock' size={25} color={isPasswordFocused ? '#6366f1' : '#f4f4f5'} type='regular' />
              <TextInput
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base'
                placeholder="Password"
                placeholderTextColor={'#a3a3a3'}
                secureTextEntry
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChangeText={setPassword}
              />
            </View>
            <View className='flex-row gap-2 justify-center items-center px-2 pt-6'>
              <FontAwesome name='lock' size={25} color={isRepeatPasswordFocused ? '#6366f1' : '#f4f4f5'} type='regular' />
              <TextInput
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base'
                placeholder="Repeat password"
                placeholderTextColor={'#a3a3a3'}
                secureTextEntry
                onFocus={() => setIsRepeatPasswordFocused(true)}
                onBlur={() => setIsRepeatPasswordFocused(false)}
              />
            </View>
          </>
        )
      }
    </>
  )
}

export default Forms


