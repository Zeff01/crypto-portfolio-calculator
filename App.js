import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { CustomLightTheme, CustomDarkTheme } from './constants/Theme'
import useThemeStore from './store/useThemeStore';
import RootNavigation from './navigation/RootNavigation';
import { supabase } from './services/supabase';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [session, setSession] = useState()


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])



  const scheme = useThemeStore((state) => state.theme) || 'light';
  const theme = scheme === 'dark' ? CustomDarkTheme : CustomLightTheme;


  if (!fontsLoaded) {
    return null;
  }



  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootNavigation />
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
