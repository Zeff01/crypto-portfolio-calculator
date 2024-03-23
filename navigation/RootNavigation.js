import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { navigationRef } from './navigationActions';
import DrawerNavigator from './DrawerTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../services/supabase';


const RootNavigation = () => {
    const { session, setSession } = useAuthStore();

    useEffect(() => {
        const checkCurrentSession = async () => {
            const { data: currentSession, error } = await supabase.auth.getSession();

            if (currentSession) {
                setSession(currentSession);
            } else if (error) {
                console.error('Error getting current session:', error.message);
            }
        };

        checkCurrentSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
   

        return () => {
               if (listener && listener.subscription && typeof listener.subscription.unsubscribe === 'function') {
            listener.subscription.unsubscribe();
        }
        };
    }, [setSession]);

    return (
        <NavigationContainer ref={navigationRef}>
            {!session ?  <AuthStackNavigator />: <DrawerNavigator /> }
        </NavigationContainer>
    );
};

export default RootNavigation;
