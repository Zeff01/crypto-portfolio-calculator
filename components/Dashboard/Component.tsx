import { View } from "react-native";

export default function Dashboard() {
    return (
        <View className="w-[300] gap-y-[40]">
            <View className="flex flex-row gap-x-[20]">
                <View className="w-[140] aspect-square bg-loadingLight rounded-xl" />
                <View className="gap-y-[10]">
                    <View className="bg-loadingLight h-[20] w-[140] rounded-xl" />
                    <View className="bg-loadingLight h-[20] w-[120] rounded-xl" />
                    <View className="bg-loadingLight h-[20] w-[140] rounded-xl" />
                </View>
            </View>
            <View className="w-full h-[100] bg-loadingLight rounded-xl" />
            <View className="w-full h-[100] bg-loadingLight rounded-xl" />
            <View className="flex-row gap-x-[20]">
                <View className="w-[140] h-[160] bg-loadingLight rounded-xl" />
                <View className="w-[140] h-[160] bg-loadingLight rounded-xl" />
            </View>
        </View>
    )
}