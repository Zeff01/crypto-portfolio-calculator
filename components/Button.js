
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import React from 'react'
import  FontAwesome  from '@expo/vector-icons/FontAwesome';



const Button = ({onPress,title, loading, ...props}) => {




  return (
    <>
    <TouchableOpacity onPress={onPress} {...props}>
      <View className='flex flex-row items-center justify-center bg-[#1E1E1E] rounded-[37px]'>
        <Text className='text-[#02F5C3] text-xl py-4 rounded-lg mr-4 font-bold  tracking-wider capitalize'>{title}</Text>
      </View>
    </TouchableOpacity>
    </>
  )
}

export default Button
