import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerContent from '../components/DrawerContent';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

const CustomHeaderLeft = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 20 }}>
        <Icon name="menu" size={30} color="#fff" />
    </TouchableOpacity>
);

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
                headerStyle: {
                    backgroundColor: '#6200ee',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 22,
                },
                headerTitleAlign: 'center', // Center align the title
                headerLeft: () => <CustomHeaderLeft navigation={navigation} />,
                title: 'CryptoPortfolio',
            })}
        >
            <Drawer.Screen name="Home" component={BottomTabNavigator} />
        </Drawer.Navigator>
    );
}
