import { View, Text, Image } from 'react-native'
import React from 'react'
import LogoIcon from '../assets/svgs/logo-blue.svg';
import  CryptoProfitIcon  from '../assets/svgs/cryptoProfitIcon.svg';



const Logo = ({ size }) => {
  return (
    <CryptoProfitIcon height={size} width={size} />
  )
}

export default Logo
