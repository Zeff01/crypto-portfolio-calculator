import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { supabase } from "../services/supabase";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import useAuthStore from "../store/useAuthStore";

export default function DrawerContent(props) {
  const theme = useTheme();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let { data, error } = await supabase
          .from("subscription")
          .select("firstName, lastName, email, username")
          .eq("userId", user.id)
          .single();

        if (error) {
          console.error("Error fetching user info:", error);
          setUserInfo({
            firstName: "Guest",
            lastName: "",
            email: "No email",
            username: "guest_user",
          });
        } else if (!data) {
          console.log("No user information found");
          setUserInfo({
            firstName: "Guest",
            lastName: "",
            email: "No email",
            username: "guest_user",
          });
        } else {
          setUserInfo(data);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      useAuthStore.getState().logout();
      if (error) throw error;
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://crypto-privacy-policy.vercel.app/");
  };

  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "rgba(30, 30, 30, 0.99)",
        color: "#fff",
      }}
    >
      {/* Logo and User Info Section */}
      <View style={{ alignItems: "left", marginBottom: 30, paddingLeft: 20 }}>
        {/* Logo - Replace with your actual logo image */}

        <View
          style={{ flexDirection: "row", alignItems: "center", paddingTop: 10 }}
        >
          {/* Column 1: Image */}
          <View style={{ marginRight: 10 }}>
            <TouchableOpacity onPress={closeDrawer}>
              <View
                style={{
                  backgroundColor: "rgba(43, 43, 43, 0.47)",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../assets/images/back-arrow.png")}
                  style={{ width: 17, height: 17 }}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Column 2: Details Button */}
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              marginLeft: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                width: 80,
                height: 34,
                borderRadius: 37,
                backgroundColor: "#02F5C3",
                paddingHorizontal: 20,
                paddingVertical: 8,
                marginRight: 10,
              }}
            >
              <Text style={{ fontSize: 12, textAlign: "center" }}>Details</Text>
            </TouchableOpacity>
          </View>

          {/* Column 3: Bell Icon */}
          <View
            style={{
              backgroundColor: "rgba(43, 43, 43, 0.47)",
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
            }}
          >
            <Image
              source={require("../assets/images/bell.png")}
              style={{ width: 15, height: 15 }}
            />
          </View>
        </View>

        <Text style={{ color: "#02F5C3", marginTop: 40, marginBottom: 15 }}>
          Personal Account
        </Text>

        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#1E1E1E",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
            {userInfo.firstName?.charAt(0).toUpperCase()}
            {userInfo.lastName?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            color: "#fff",
            lineHeight: 36,
            marginTop: 10,
          }}
        >
          {userInfo.firstName} {userInfo.lastName}
        </Text>

        <Text style={{ color: "#B4B4B4" }}>{userInfo.email}</Text>
        {/* <Text style={{ color: '#fff', marginBottom: 5 }}>@{userInfo.username}</Text> */}
      </View>

      {/* line */}
      <View
        style={{
          height: 1,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          width: "100%",
        }}
      />

      <View style={{ paddingLeft: 20 }}>
        {/* Settings */}
        <View style={{ marginTop: 30 }}>
          {/* Example navigation item */}
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(43, 43, 43, 0.47)",
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/images/settings.png")}
                style={{ width: 16, height: 16 }}
              />
            </View>

            <Text style={{ marginLeft: 10, color: "#ffffff", fontSize: 16 }}>
              Settings
            </Text>
          </TouchableOpacity>
          {/* Add more navigation items as needed */}
        </View>

        {/* Help */}
        <View>
          {/* Example navigation item */}
          <TouchableOpacity
            onPress={() => {}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(43, 43, 43, 0.47)",
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/images/help.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>

            <Text style={{ marginLeft: 10, color: "#ffffff", fontSize: 16 }}>
              Help
            </Text>
          </TouchableOpacity>
          {/* Add more navigation items as needed */}
        </View>

        {/* Privacy and Security*/}
        <View>
          {/* Example navigation item */}
          <TouchableOpacity
            onPress={openPrivacyPolicy}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(43, 43, 43, 0.47)",
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/images/privacy.png")}
                style={{ width: 30, height: 30 }}
              />
            </View>

            <Text style={{ marginLeft: 10, color: "#ffffff", fontSize: 16 }}>
              Privacy and Security
            </Text>
          </TouchableOpacity>
          {/* Add more navigation items as needed */}
        </View>

        {/* Signout*/}
        <View>
          {/* Example navigation item */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(43, 43, 43, 0.47)",
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/images/signout.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>

            <Text style={{ marginLeft: 10, color: "#ffffff", fontSize: 16 }}>
              Signout
            </Text>
          </TouchableOpacity>
          {/* Add more navigation items as needed */}
        </View>
      </View>

      {/* line */}
      <View
        style={{
          height: 1,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          width: "100%",
          marginTop: 50,
        }}
      />
      <View>
        <Text
          style={{
            color: "#02F5C3",
            marginTop: 10,
            marginBottom: 10,
            paddingLeft: 20,
          }}
        >
          Version 6.2
        </Text>
      </View>
    </SafeAreaView>
  );
}
