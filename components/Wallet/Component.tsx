import { Pressable, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useState } from "react";
import AddCoinModal from "../Modals/AddCoinModal";
export default function Wallet() {
    const [isModalOpen, setIsModalOpen] = useState(true)

    function toggleModal() {
        setIsModalOpen(b => !b)
    }

    return (
        <>
        <View className="w-[300] gap-y-[30]">
            <View className="self-end">
                <Pressable onPress={toggleModal}>
                    <AntDesign name="pluscircle" size={36} color="#d9d9d9" />
                </Pressable>
            </View>
            <View className="gap-y-[18]">
                <View className="w-full h-[70] rounded-lg bg-loadingLight" />
                <View className="w-full h-[70] rounded-lg bg-loadingLight" />
                <View className="w-full h-[70] rounded-lg bg-loadingLight" />
                <View className="w-full h-[70] rounded-lg bg-loadingLight" />
                <View className="w-full h-[70] rounded-lg bg-loadingLight" />
                <View className="w-full h-[70] rounded-lg bg-loadingLight" />
                <View className="w-full h-[70] rounded-lg bg-loadingLight" />
            </View>
        </View>
        <AddCoinModal  
        isOpen={isModalOpen} 
        toggleModal={toggleModal} 
        />
        
        </>
    )
}