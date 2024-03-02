import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2563eb',
        height: '20%',
        width: '90%',
        justifyContent: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        paddingHorizontal: 40,
        gap: 8,
        marginTop: 10,
        overflow: 'hidden',
        elevation: 5,
        
    },
    text : {
        color: '#fafafa',
        fontWeight: 'bold',
        textTransform: 'capitalize',

    },
    title: {
        fontSize: 14,
        letterSpacing: 0.8,
    },
    subTitle: {
        fontSize: 18,
        letterSpacing: 0.4
    },
    image: {
        position: 'absolute',
        top: 50,
        right: -10,
        zIndex: -1,
        opacity: 0.1,
        transform: [{ rotate: '14deg'}],
    }

});

const Banner = ({ username }) => {
  return (
    <View style={ styles.container }>
      <Text style={[styles.text, styles.title ] }>welcome {username}</Text>
      <Text style={[styles.text, styles.subTitle ] }>monitor you wallet's growth today</Text>
      <Image
        source={require('../../assets/images/Union.png')}
        style={styles.image}
      />
    </View>
  )
}

export default Banner