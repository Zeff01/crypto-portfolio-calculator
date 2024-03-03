import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../store/useAuthStore';

export default function DrawerContent(props) {
  const theme = useTheme();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({});


  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        let { data, error } = await supabase
          .from('subscription')
          .select('firstName, lastName, email, username')
          .eq('userId', user.id)
          .single();

        if (error) {
          console.error('Error fetching user info:', error);
          setUserInfo({ firstName: 'Guest', lastName: '', email: 'No email', username: 'guest_user' });
        } else if (!data) {
          console.log('No user information found');
          setUserInfo({ firstName: 'Guest', lastName: '', email: 'No email', username: 'guest_user' });
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
      console.error('Logout error:', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: theme.colors.surface }}>
      {/* Logo and User Info Section */}
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        {/* Logo - Replace with your actual logo image */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.onSurface }}>
          {userInfo.firstName} {userInfo.lastName}
        </Text>
        <Text style={{ color: theme.colors.onSurface }}>{userInfo.email}</Text>
        <Text style={{ color: theme.colors.onSurface, marginBottom: 5 }}>@{userInfo.username}</Text>
      </View>

      {/* Drawer Navigation Items */}
      <View>
        {/* Example navigation item */}
        <TouchableOpacity onPress={() => { }} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <FontAwesome5 name="cog" size={20} color={theme.colors.onSurface} />
          <Text style={{ marginLeft: 10, color: theme.colors.onSurface }}>Settings</Text>
        </TouchableOpacity>
        {/* Add more navigation items as needed */}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 'auto',
          backgroundColor: theme.colors.primary,
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ textAlign: 'center', color: 'white' }}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={{ textAlign: 'center', marginTop: 10, color: theme.colors.onSurface, opacity: 0.6 }}>
        App Version 0.0.1
      </Text>
    </SafeAreaView>
  );
}
