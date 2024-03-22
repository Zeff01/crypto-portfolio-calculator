import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useHandleTheme } from '../../hooks/useTheme';


const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#2563eb',
        height: '15%',
        width: '90%',
        justifyContent: 'center',
        // alignItems: 'flex-start',
        borderRadius: 10,
        // shadowColor: '#000',
        // paddingHorizontal: 40,
        gap: 8,
        overflow: 'hidden',
        // elevation: 5,/
        
    },
    text : {
        color: '#ffffff',
        fontWeight: 'bold',
        textTransform: 'capitalize',

    },
    title: {
        fontSize: 16,
        letterSpacing: 0.8,
        fontWeight: 500, 
    },
    subTitle: {
        fontSize: 16,
        // letterSpacing: 0.4,
        color: '#B4B4B4',
        fontWeight: 400,
    },
    image: {
        position: 'absolute',
        top: 5,
        right: -10,
        zIndex: -1,
        opacity: 0.1,
        transform: [{ rotate: '14deg'}],
    },

    
 

});

const Banner = ({ username }) => {
    const { colors, theme } = useHandleTheme();

  return (
    <View style={ styles.container }>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <Text style={[styles.text, styles.title, { color: colors.text }]}>welcome {username}</Text>
    
    <TouchableOpacity onPress={() => {}}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: "#02F5C3", fontWeight: '600', fontSize: 16 }}>Portal</Text>
        <Image source={require('./assets/arrow.png')} style={{ width: 16, height: 16, marginLeft: 5 }} />
    </View>
    </TouchableOpacity>


</View>



      <Text style={[ styles.subTitle ] }>Monitor Your Wallet's Growth Today</Text>
      
    </View>
  )
}

export default Banner