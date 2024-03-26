import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./BottomTabNavigator";
import DrawerContent from "../components/DrawerContent";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Logo from "../components/Logo";
import { useHandleTheme } from "../hooks/useTheme";

const Drawer = createDrawerNavigator();

const CustomHeaderLeft = () => (
  <View className="ml-[18px]">
    <Logo size={33.47} />
  </View>
);
const CustomHeaderRight = ({ navigation }) => {
  const { colors, toggleTheme } = useHandleTheme();

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}
      className="flex flex-row items-center mr-[20px]"
    >
      {/* <View className='bg-[#F2F2F2] rounded-full p-4'>
                <Icon name='eye' size={10.47} onPress={() => handleClick}/>
                
            </View> */}
      <TouchableOpacity
        className={`rounded-full p-4`}
        style={{ backgroundColor: colors.secondary }}
        onPress={() => toggleTheme()}
      >
        <Icon name="eye" size={10.47} color={colors.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
        style={{ marginLeft: 20 }}
      >
        <Icon name="menu" size={30} color={colors.button} />
      </TouchableOpacity>
    </View>
  );
};

export default function DrawerNavigator() {
  const { colors } = useHandleTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTitleAlign: "left", // Center align the title
        headerTitleStyle: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 24,
          letterSpacing: 0.9,
          color: colors.text,
        },
        headerLeft: () => <CustomHeaderLeft navigation={navigation} />,
        headerRight: () => <CustomHeaderRight navigation={navigation} />,
        title: "Crypto Profit",
      })}
    >
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
