import { View, Text, Image } from 'react-native'
import React from 'react'
import LogoIcon from '../assets/svgs/logo-blue.svg';


const Logo = ({ size }) => {
  return (
    <LogoIcon height={size} width={size} />
  )
}

export default Logo
