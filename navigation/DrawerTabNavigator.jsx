import { createDrawerNavigator} from '@react-navigation/drawer'
import StackNavigator from './StackNavigator'
import DrawerContent from '../components/DrawerContent'


const Drawer = createDrawerNavigator()

export default  function DrawerNavigator() {

    return (
        <Drawer.Navigator         
        drawerContent={(props) => (
            <DrawerContent  {...props} />
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