import { View, Text,TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useTheme} from  'react-native-paper'
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function DrawerContent(props) {
    const theme=  useTheme()
    return (
        <SafeAreaView style={{padding:15, flex:1}}>
            <View style={{marginBottom:30, rowGap:5, borderBottomWidth:0.5, borderBottomColor:theme.colors.text, paddingBottom:10}}>
                    <View  style={{width:100, height:100, backgroundColor: theme.colors.primary, borderRadius: 100,elevation:10}} />
                    <View>
                        <Text style={{fontWeight:'700', color: theme.colors.text, fontSize:18}}>Username</Text>
                        <View style={{flexDirection:'row', alignItems:'center', columnGap:5}}>
                            <Text>account id: 1234567</Text>
                            <TouchableOpacity>
                                <Feather name="copy" size={16} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
            </View>
            <View style={{rowGap:20}}>
                <View style={{borderBottomWidth:0.5,  borderBottomColor:theme.colors.text}}>
                    <Text style={{fontSize:16, fontWeight:'700', color: theme.colors.text}}>User Settings</Text>
                    <View style={{padding:10}}>
                        <Text style={{color:theme.colors.text}}>user settings</Text>
                        <Text style={{color:theme.colors.text}}>user settings</Text>
                        <Text style={{color:theme.colors.text}}>user settings</Text>
                    </View>
                </View>
                <View style={{borderBottomWidth:0.5,  borderBottomColor:theme.colors.text}}>
                    <Text style={{fontSize:16, fontWeight:'700', color: theme.colors.text}}>App Settings</Text>
                    <View style={{padding:10}}>
                        <Text style={{color:theme.colors.text}}>other settings</Text>
                        <Text style={{color:theme.colors.text}}>other settings</Text>
                        <Text style={{color:theme.colors.text}}>other settings</Text>
                        <Text style={{color:theme.colors.text}}>other settings</Text>
                    </View>
                </View>
                
            </View>
            <View style={{marginTop:'auto'}}>    
                <View style={{flexDirection:'row-reverse',  columnGap:5, paddingBottom:10}}>
                    <Feather name="sun" size={24} color="black" />
                    <Entypo name="switch" size={24} color="black" />
                </View>
                <View style={{rowGap:10}}>
                <TouchableOpacity style={{borderWidth:1,borderColor:'#adadad', paddingHorizontal:20, paddingVertical:6, borderRadius:10}}>
                    <Text style={{fontSize:16, textAlign:'center', color: theme.colors.text}}>switch account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderWidth:1,borderColor:'#adadad', paddingHorizontal:20, paddingVertical:6, borderRadius:10}}>
                    <Text style={{fontSize:16, textAlign:'center', color: theme.colors.text}}>logout</Text>
                </TouchableOpacity>      
                </View>         
                <Text style={{fontSize:12, fontStyle:'italic', opacity:0.7}}>App Version 0.0.1</Text>                            
            </View>             
        </SafeAreaView>
    )
}