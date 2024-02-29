import { createDrawerNavigator} from '@react-navigation/drawer'
import StackNavigator from './StackNavigator'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {  useTheme } from 'react-native-paper'
import { Feather } from '@expo/vector-icons';

const Drawer = createDrawerNavigator()

export default  function DrawerNavigator() {
    const theme = useTheme()

    return (
        <Drawer.Navigator 
        drawerContent={(props) => (
            <SafeAreaView style={{padding:15}}>
                <View>
                    <View>
                        <View  style={{width:100, height:100, backgroundColor: theme.colors.primary}} />
                        <Text>Username</Text>
                    </View>
                </View>   
                <View>
                    <TouchableOpacity>
                        <Text>switch account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>logout</Text>
                    </TouchableOpacity>      
                </View>             
                <Text>App Version 0.0.1</Text>                            
            </SafeAreaView>
        )}        
        screenOptions={{
            headerShown: false,                        
        }}
        defaultStatus='open'
        >
            <Drawer.Screen name='Root' component={StackNavigator} />
        </Drawer.Navigator>
    )
}