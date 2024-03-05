import { TouchableOpacity, Button, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';
import  FontAwesome  from '@expo/vector-icons/FontAwesome';


const ButtonArrow = ({onPress,title, loading, ...props}) => {
  return (
    <>
    <TouchableOpacity onPress={onPress} {...props}>
      <View className='flex-row items-center bg-indigo-500 pr-4 rounded-lg'>
        <Text className='bg-indigo-400 px-5 text-slate-100 text-xl py-4 rounded-lg mr-4 font-bold  tracking-wider capitalize'>{title}</Text>
        {loading?
        <ActivityIndicator size={30} color={'#f1f5f9'} />:
        <FontAwesome name='arrow-right' size={30} color='#f1f5f9' />
        }
      </View>
    </TouchableOpacity>
    </>
  )
}

export default ButtonArrow