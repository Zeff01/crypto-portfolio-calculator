import { View } from "react-native";

export default function Signup() {
    return (
        <View className="w-[300] gap-y-[50]">
            <View className="w-full h-[200] bg-loadingLight"></View> 
            <View className="w-full h-[50] bg-loadingLight"></View> 
            <View className="w-full h-[50] bg-loadingLight"></View> 
            <View className="w-[50%] h-[50] bg-loadingLight self-end"></View> 
        </View>
    )
}