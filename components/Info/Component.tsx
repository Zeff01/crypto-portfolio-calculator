import { View } from "react-native";
import { AntDesign } from '@expo/vector-icons';

//TODO: split this into multiple component
export default function Info() {
    return (
        <View className="w-[340] gap-y-[15]">
            <View className="flex-row justify-between">
                <View className="gap-y-[5]">
                    <View className="w-[100] h-[70] aspect-square bg-loadingLight rounded-lg"></View>
                    <View className="w-[130] h-[30] bg-loadingLight rounded-lg"></View>
                </View>
                <View className="gap-y-[5] justify-between">
                    <View className="self-end">
                        <AntDesign name="closecircle" size={24} color="#d9d9d9" />
                    </View>
                    <View className="w-[130] h-[30] bg-loadingLight rounded-lg"></View>
                </View>
            </View>
            <View className="bg-loadingLight w-full px-[24] pb-[16] gap-y-[16]">
                <View className="w-full bg-white h-[50]" />
                <View className="w-full bg-white h-[50]" />
                <View className="w-full bg-white h-[50]" />
                <View className="w-full bg-white h-[50]" />
            </View>
            <View className=" flex-row justify-between">
                <View className="bg-loadingLight h-[50] w-[160]" />
                <View className="bg-loadingLight h-[50] w-[160]" />
            </View>
            <View className="bg-loadingLight p-[30] pt-[15] gap-y-[15]">
                <View className="w-full bg-white h-[40]" />
                <View className="w-full bg-white h-[40]" />
            </View>
            <View className="w-full bg-loadingLight h-[50]" />
        </View>
    )
}