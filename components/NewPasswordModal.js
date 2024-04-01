import { useState, useEffect } from "react";
import { Modal, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useTheme} from 'react-native-paper'
import { passwordSchema } from "../utils/formValidator";
import { useNavigation } from '@react-navigation/core';


export default function NewPasswordModal({email, showModal, setShowModal}) {
    const navigation = useNavigation()

    const [password ,setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)
    const [repeatPasswordValid, setRepeatPasswordValid] = useState(false)
    const theme = useTheme()

    function validator(schema, item, setter) {
        try {
            schema.parse(item)
            setter(true)
        } catch (error) {
            setter(false)
        }
    }

    async function setNewPassword() {
        try {
            setLoading(true)
            await new Promise((res)  => {
                setTimeout(() => {
                    Alert.alert(
                        'Reset Password Success!',
                        'redirecting to login'
                    )
                    res()
                }, 2000)
            })
            setTimeout(() => {
                navigation.navigate('Login') // redirect to login
            },3000)
            
        } catch (error) {
            console.warn(error)
        } finally {
            setLoading(false)
        }
        
    }

    async function cancelResetPassword() {
        Alert.alert(
            'Cancel Reset Password',
            'do you wish to cancel this operation?',
            [
                {
                    text: 'confirm',
                    onPress: () => navigation.navigate('Login')
                },
                {
                    text: 'back'
                }
            ]
        )
    }

    useEffect(() => {
        console.log('password form useEffect')
        validator(passwordSchema, password, setPasswordValid)
    }, [password])
    useEffect(() => {
        console.log('repeat password form useEffect')
        setRepeatPasswordValid(password === repeatPassword && repeatPassword.length > 0)
    }, [password, repeatPassword])


    const disabled = Boolean(loading || !passwordValid || !repeatPasswordValid)

    return (
        <Modal transparent={true} visible={showModal}>            
      <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center', padding:20}}>
        <View style={{width:'100%', height:250, backgroundColor:'white', borderRadius:20, elevation:5, padding:20, justifyContent:'space-between'}}>
            <Text style={{color:theme.colors.text}}>Enter New Password</Text>
            <View>
                <View style={{rowGap:5}}>
                    <Text style={{color:theme.colors.text}}>new password</Text>
                    <TextInput
                    editable={!loading}
                    className='tracking-wider text-neutral-500 bg-gray-200'
                    style={{borderWidth:2, borderColor:'gray', width:'70%', borderRadius:10, paddingHorizontal:15, paddingVertical:5}}
                    placeholder="new password..."
                    placeholderTextColor={'#a3a3a3'}
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    secureTextEntry           
                    />
                </View>
                <View style={{rowGap:5}}>
                    <Text style={{color:theme.colors.text}}>repeat password</Text>
                    <TextInput
                    editable={!loading}
                    className='tracking-wider text-neutral-500 bg-gray-200'
                    style={{borderWidth:2, borderColor:'gray', width:'70%', borderRadius:10, paddingHorizontal:15, paddingVertical:5}}
                    placeholder="repeat password..."
                    placeholderTextColor={'#a3a3a3'}
                    autoCapitalize="none"
                    onChangeText={setRepeatPassword}
                    secureTextEntry            
                    />
                </View>
            </View>
            <View style={{flexDirection:'row', columnGap:40}}> 
          <TouchableOpacity
          onPress={setNewPassword}
          disabled={disabled}
          style={{
            backgroundColor:theme.colors.primary, 
            paddingHorizontal:10, 
            paddingVertical:5, 
            borderRadius:10, 
            elevation:5,
            opacity: (disabled) ? 0.6 : 1,
            position:'relative'
        }}
          >
            <ActivityIndicator size={14} color={theme.colors.text} style={{position:'absolute', top:8, left:75}} animating={loading} /> 
            <Text style={{color: 'white'}}>Confirm New Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={{
            paddingHorizontal:10, 
            paddingVertical:5, 
            borderRadius:10, 
            borderWidth:1,
            borderColor: 'rgba(255,0,0,0.5)',
            opacity:loading?0.6:1
        }}
            disabled={loading}
          >
            <Text style={{color: 'rgba(255,0,0,0.5)'}}
            disabled={loading}
            onPress={cancelResetPassword}
            >
                Cancel
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    )
}