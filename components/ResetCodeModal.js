import { Modal, TouchableOpacity, Pressable, View, Text, TextInput, ActivityIndicator} from 'react-native'
import { useEffect, useState } from 'react'
import { useTheme} from 'react-native-paper'

export default function ResetCodeModal({showModal, setShowModal, email, setShowNewPasswordModal}) {
    const theme = useTheme()
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [canResend, setCanResend] = useState(false)
    const [resendCooldown, setResendCooldown]  = useState(10)

    async function resendCode() {
        try {
            setLoading(true)
            await new Promise((res)  => {
                setTimeout(() => {
                    setCanResend(false)
                    setResendCooldown(10)
                    res()
                }, 2000)
            })
            
        } catch (error) {
            console.warn(error)
        } finally {
            setLoading(false)
        }
        
    }

    async function verify() {
        setLoading(true)
        try {
            await new Promise(res => {
                setTimeout(() => {
                    setShowNewPasswordModal(true)
                    setShowModal(false)
                    res()
                }, 2000)
            })
        } catch (error) {
            
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log('reset code useEffect')
        if (!showModal) {
            return
        }
        if (resendCooldown ===  0) {
            setCanResend(true)
            return
        }
        const timeout = setTimeout(() => {
            setResendCooldown(t  => t-1)
        }, 1000)
        
        return () => clearTimeout(timeout)

    }, [resendCooldown, showModal, canResend])


    return (
        <Modal transparent={true} visible={showModal}>            
      <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', alignItems:'center', justifyContent:'center', padding:20}}>
        <View style={{width:'100%', height:250, backgroundColor:'white', borderRadius:20, elevation:5, padding:20, justifyContent:'space-between'}}>
          <View>
            <Text style={{fontSize:13, opacity:0.8}}>resetting password for:</Text>
            <Text style={{fontWeight:'bold', fontSize:16, color: theme.colors.text}}>{email}</Text>
          </View>
          <View style={{rowGap:5}}>
            <Text style={{color:theme.colors.text}}>password reset code</Text>
 
                <TextInput
                    editable={!loading}
                    className='tracking-wider text-neutral-500 bg-gray-200'
                    style={{borderWidth:2, borderColor:'gray', width:'70%', borderRadius:10, paddingHorizontal:15, paddingVertical:5}}
                    placeholder="enter the code here..."
                    placeholderTextColor={'#a3a3a3'}
                    autoCapitalize="none"
                    onChangeText={setCode}
                    maxLength={6}                
                />
              <View style={{flexDirection:'row', columnGap:10}}>
                <Text style={{color:theme.colors.text, fontSize:13}}>did not receive code?</Text>
                {
                canResend ?
                <TouchableOpacity onPress={resendCode} style={{justifyContent:'center', opacity:loading?0.6:1}} disabled={loading}>
                    {loading ?
                    <ActivityIndicator size={13} color={theme.colors.text} /> :
                    <Text style={{color:'rgba(255,0,0,0.7)', fontSize:13}}>resend code</Text>}
                </TouchableOpacity> :
                <Text style={{color: theme.colors.text, fontSize:13, opacity:0.5}}>resend code in {resendCooldown} seconds</Text>    
                }
            </View>
          </View>
          
          <View style={{flexDirection:'row', columnGap:40}}> 
          <TouchableOpacity 
          onPress={verify}
          disabled={code.length < 6 || loading}
          style={{
            backgroundColor:theme.colors.primary, 
            paddingHorizontal:10, 
            paddingVertical:5, 
            borderRadius:10, 
            elevation:5,
            opacity: (code.length < 6|| loading) ? 0.6 : 1,
            position:'relative'
        }}
          >
            <ActivityIndicator size={14} color={theme.colors.text} style={{position:'absolute', top:8, left:20}} animating={loading} /> 
            <Text style={{color: 'white'}}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowModal(false)}
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
            <Text style={{color: 'rgba(255,0,0,0.5)'}}>
                Cancel
            </Text>
          </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
    )
}