    import { Pressable, View } from "react-native";
import { Modal } from "react-native-paper";
import { AntDesign } from '@expo/vector-icons';

type AddCoinModalProps = {
    isOpen:boolean; 
    toggleModal(): void
}
export default function AddCoinModal({isOpen, toggleModal}: AddCoinModalProps) {
    return (

        <Modal visible={isOpen} onDismiss={toggleModal}>
            <View className="w-full h-[360] bg-loadingLight px-[22] py-[22]">
                <View className="self-end">
                    {/*TODO: why i can't press this? */}
                    <Pressable onPress={toggleModal}> 
                        <AntDesign name="closecircle" size={28} color="white" />
                    </Pressable>
                </View>            
                <View className="gap-y-[36] pt-[36]">
                    <View className="w-full h-[40] bg-white rounded-xl" />
                    <View className="w-full h-[40] bg-white rounded-xl" />
                </View>
                <View className="pt-[48]">
                    <View className="w-[50%] h-[40] bg-white self-end rounded-xl" />
                </View>
            </View>
        </Modal>
        )
}