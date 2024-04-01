import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Modal, View, Text } from "react-native";

import { navigationRef } from "./navigationActions";
import DrawerNavigator from "./DrawerTabNavigator";
import AuthStackNavigator from "./AuthStackNavigator";
import useAuthStore from "../store/useAuthStore";
// import { supabase } from "../services/supabase";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthFetch } from "../queries";

const RootNavigation = () => {
  const sessionData = useAuthStore(s => s.session)
  const userData  = useAuthStore(s => s.user)
  const setSession = useAuthStore(s => s.setSession)
  const setUser = useAuthStore(s => s.setUser)  
  const login = useAuthStore(s => s.login)
  const [sessionChecked, setSessionChecked] = useState(false)

  async function checkSavedSession() {
    console.log('checking valid session...')
    try {      
      const sessionStr = await AsyncStorage.getItem('session')
      if (sessionStr) {
        const s = JSON.parse(sessionStr)
        const res = await AuthFetch.refresh(s)
        if (res.status === 201) {
          const { user, session } = res.data
          // setSession(session)
          // setUser(user)
          login(session, user)
          console.log('saved session found, logging in')
        }
        else {
          console.log('no valid session found')
          await AsyncStorage.removeItem('session')
        }
      } else {
        await AsyncStorage.removeItem('session')
        console.log('no valid session found')
      }
    } catch (error) {      
      console.error('error refreshing session', error)
    } finally {
      // this will prevent the login screen from showing while saved session check is ongoing
      setSessionChecked(true) 
    }
  }

  useEffect(() => {    
    console.log('session checker useEffect running')
      checkSavedSession()
  }, [])

  // useEffect(() => {
  //   console.log('session checker useEffect running')
  //   // const checkCurrentSession = async () => {
  //   //   const { data: {session}, error } = await supabase.auth.getSession();

  //   //   if (session) {
  //   //     const {data: {user}} = await supabase.auth.getUser(session.access_token)
  //   //     if (user) {
  //   //       setSession(session);
  //   //       setUser(user)
  //   //     }
  //   //   } else if (error) {
  //   //     console.error("Error getting current session:", error.message);
  //   //   }
  //   // };

  //   // checkCurrentSession();

  //   const { data: listener } = supabase.auth.onAuthStateChange(
  //     async (_event, session) => {
  //       if (!session) {
  //         console.log('no session found')
  //         setSession(null)
  //         setUser(null)
  //         return
  //       }
  //       console.log('session found, checking user...')
  //       const {data:{user}} = await supabase.auth.getUser(session.access_token)
  //       if (user) {          
  //         console.log('session and user data recorded')
  //         setSession(session);
  //         setUser(user)
  //         return
  //       }
  //     }
  //   );

  //   return () => {
  //     if (
  //       listener &&
  //       listener.subscription &&
  //       typeof listener.subscription.unsubscribe === "function"
  //     ) {
  //       listener.subscription.unsubscribe();
  //     }
  //   };
  // }, []);


  return (
    <NavigationContainer ref={navigationRef}>
      <Modal 
      animationType="fade"
      transparent={true}
      visible={!sessionChecked}
      >
        <View 
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        >
          <View
          style={{
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
          >
            <Text style={{fontWeight:'600'}}>Checking Saved Session...</Text>
          </View>
        </View>
      </Modal>
      {!sessionData ? <AuthStackNavigator /> : <DrawerNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigation;
