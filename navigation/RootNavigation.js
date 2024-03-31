import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { navigationRef } from "./navigationActions";
import DrawerNavigator from "./DrawerTabNavigator";
import AuthStackNavigator from "./AuthStackNavigator";
import useAuthStore from "../store/useAuthStore";
import { supabase } from "../services/supabase";

const RootNavigation = () => {
  const sessionData = useAuthStore(s => s.session)
  const userData  = useAuthStore(s => s.user)
  const setSession = useAuthStore(s => s.setSession)
  const setUser = useAuthStore(s => s.setUser)

  useEffect(() => {
    console.log('session checker useEffect running')
    // const checkCurrentSession = async () => {
    //   const { data: {session}, error } = await supabase.auth.getSession();

    //   if (session) {
    //     const {data: {user}} = await supabase.auth.getUser(session.access_token)
    //     if (user) {
    //       setSession(session);
    //       setUser(user)
    //     }
    //   } else if (error) {
    //     console.error("Error getting current session:", error.message);
    //   }
    // };

    // checkCurrentSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          console.log('no session found')
          setSession(null)
          setUser(null)
          return
        }
        console.log('session found, checking user...')
        const {data:{user}} = await supabase.auth.getUser(session.access_token)
        if (user) {          
          console.log('session and user data recorded')
          setSession(session);
          setUser(user)
          return
        }
      }
    );

    return () => {
      if (
        listener &&
        listener.subscription &&
        typeof listener.subscription.unsubscribe === "function"
      ) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (userData) {
      console.log(userData.id, 'userid')
    }
    if (sessionData) {
      console.log(sessionData.refresh_token, 'refreshtoken')
    }
  }, [sessionData, userData])

  return (
    <NavigationContainer ref={navigationRef}>
      {!sessionData ? <AuthStackNavigator /> : <DrawerNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigation;
