import { View, TextInput } from 'react-native'
import React, { useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useTheme} from 'react-native-paper'

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
  const theme = useTheme()

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
            <View className='flex-row gap-2 justify-center items-center border-b px-2 py-3' style={{opacity:loading?0.5:1}}>
              <FontAwesome name='envelope-o' size={25} color={isEmailFocused ? '#6366f1' : '#242222'} type='regular' />
              <TextInput
                editable={!loading}
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
            <View className='flex-row gap-2 justify-center items-center px-2 py-3' style={{opacity:loading?0.5:1}}>
              <FontAwesome name='lock' size={25} color={isPasswordFocused ? '#6366f1' : '#242222'} type='regular' />
              <TextInput
                editable={!loading}
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
            <View className='flex-row gap-2 justify-center items-center border-b px-2 py-3' style={{opacity:loading?0.5:1,  }}>
              <FontAwesome name='id-card-o' size={25} color={firstNameValid? 'green' : isFirstNameFocused ? '#6366f1' : '#f4f4f5'} />
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base'
                placeholder="First Name"
                placeholderTextColor={'#a3a3a3'}
                onFocus={() => setIsFirstNameFocused(true)}
                onBlur={() => setIsFirstNameFocused(false)}
                onChangeText={setFirstName}
              />
            </View>
            <View className='flex-row gap-2 justify-center items-center border-b px-2 py-3' style={{opacity:loading?0.5:1,  }}>
              <FontAwesome name='id-badge' size={25} color={lastNameValid? 'green' : isLastNameFocused ? '#6366f1' : '#f4f4f5'} />
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base'
                placeholder="Last Name"
                placeholderTextColor={'#a3a3a3'}
                onFocus={() => setIsLastNameFocused(true)}
                onBlur={() => setIsLastNameFocused(false)}
                onChangeText={setLastName}
              />
            </View>
            <View className='flex-row gap-2 justify-center items-center border-b px-2 py-3' style={{opacity:loading?0.5:1,  }}>
              <FontAwesome name='user' size={25} color={usernameValid? 'green' : isUsernameFocused ? '#6366f1' : '#f4f4f5'} />
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base'
                placeholder="Username"
                placeholderTextColor={'#a3a3a3'}
                autoCapitalize="none"
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                onChangeText={setUsername}
              />
            </View>
            <View className='flex-row gap-2 justify-center items-center border-b px-2 py-3' style={{opacity:loading?0.5:1,  }}>
              <FontAwesome name='envelope-o' size={25} color={emailValid? 'green' : isEmailFocused ? '#6366f1' : '#f4f4f5'} type='regular' />
              <TextInput
                editable={!loading}
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
            <View className='flex-row gap-2 justify-center items-center border-b px-2 py-3' style={{opacity:loading?0.5:1,  }}>
              <FontAwesome name='lock' size={25} color={passwordValid? 'green' : isPasswordFocused ? '#6366f1' : '#f4f4f5'} type='regular' />
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base'
                placeholder="Password"
                placeholderTextColor={'#a3a3a3'}
                secureTextEntry
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChangeText={setPassword}
              />
            </View>
            <View className='flex-row gap-2 justify-center items-center px-2 py-3' style={{opacity:loading?0.5:1,  }}>
              <FontAwesome name='lock' size={25} color={repeatPasswordValid? 'green' : isRepeatPasswordFocused ? '#6366f1' : '#f4f4f5'} type='regular' />
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base'
                placeholder="Repeat password"
                placeholderTextColor={'#a3a3a3'}
                secureTextEntry
                onFocus={() => setIsRepeatPasswordFocused(true)}
                onBlur={() => setIsRepeatPasswordFocused(false)}
                onChangeText={setRepeatPassword}
              />
            </View>
          </>
        )
      }
    </>
  )
}

export default Forms


