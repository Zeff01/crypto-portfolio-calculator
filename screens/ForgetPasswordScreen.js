import { View, Text, TextInput, Pressable, TouchableOpacity } from 'react-native'
import {useState, useEffect} from 'react'
import { useTheme} from 'react-native-paper'

import Logo from '../components/Logo'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import ButtonArrow from '../components/ButtonArrow'
import ResetCodeModal from '../components/ResetCodeModal'
import NewPasswordModal from '../components/NewPasswordModal'
import { emailSchema } from '../utils/formValidator'

const ForgetPasswordScreen = () => {
  const [loading, setLoading] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false)

  const theme = useTheme()

  function validator(schema, item, setter) {
    try {
        schema.parse(item)
        setter(true)
    } catch (error) {
        setter(false)
    }
}

  function requestPasswordReset() {
    setShowModal(true)
  }

  useEffect(() => {
    validator(emailSchema, email, setEmailValid)
  }, [email])
  
  return (
    <>
    <ResetCodeModal 
    showModal={showModal}
    setShowModal={setShowModal}
    email={email}
    setShowNewPasswordModal={setShowNewPasswordModal}
    />
    <NewPasswordModal
    showModal={showNewPasswordModal}
    setShowModal={setShowNewPasswordModal}
    email={email}
    />
    
    <View style={{alignItems:'center', justifyContent:'center', flex:1, padding:20, rowGap:20}}>
        <Logo size={160} />
        <Text style={{fontWeight:'600', fontSize:18, color: theme.colors.text}}>Reset Password</Text>
        <View className="w-full bg-gray-200 rounded-lg px-6 py-4">
        <View className='flex-row gap-2 justify-center items-center border-b px-2 py-3' style={{opacity:loading?0.5:1}}>
              <FontAwesome name='envelope-o' size={25} color={emailValid? 'green' : isEmailFocused ? '#6366f1' : '#242222'} type='regular' />
              <TextInput
                editable={!loading}
                className='w-full h-[40px] p-2 font-bold tracking-wider text-neutral-500 text-base '
                placeholder="enter your email here..."
                placeholderTextColor={'#a3a3a3'}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                onChangeText={setEmail}
                
              />
            </View>
        </View>
        <ButtonArrow 
        title={'Reset Password'}
        disabled={!emailValid||loading}
        style={{opacity: (!emailValid||loading)?0.5:1 }}
        loading={loading}
        onPress={requestPasswordReset}
        />
    </View>
    </>

  )
}

export default ForgetPasswordScreen