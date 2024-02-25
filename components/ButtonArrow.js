import { TouchableOpacity, Button, Text, View } from 'react-native';
import React from 'react';
import  FontAwesome  from '@expo/vector-icons/FontAwesome';

const ButtonArrow = ({onPress,title}) => {
  return (
    <>
    <TouchableOpacity onPress={onPress}>
      <View className='flex-row items-center bg-indigo-500 pr-4 rounded-lg'>
        <Text className='bg-indigo-400 px-5 text-slate-100 text-xl py-4 rounded-lg mr-4 font-bold  tracking-wider capitalize'>{title}</Text>
        <FontAwesome name='arrow-right' size={30} color='#f1f5f9' />
      </View>
    </TouchableOpacity>
    </>
  )
}

export default ButtonArrow