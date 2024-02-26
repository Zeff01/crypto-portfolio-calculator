import { View, Text } from "react-native";

// this should be a form btw
export default function Login() {


    return (
        <View className="w-[300] items-center justify-center gap-y-[12]">
            <View className="w-full items-center justify-center">
                <View className="h-[150] aspect-square rounded-full bg-blue-400" />
                {/*TODO: replace this placeholder for logo */}
                <View className="items-center">
                    <Text className="text-blue-600" style={{fontSize: 24, fontWeight: 'bold'}}>Crypto</Text>
                    <Text className="text-blue-600" style={{fontSize: 16, fontWeight: 'bold'}}>PROFIT</Text>
                </View>
            </View>
            <View className="gap-y-1">
                <View className="bg-loadingLight w-[300] h-[50]"></View>
                <View className="bg-loadingLight w-[300] h-[50]"></View>
            </View>
            <View className="w-[300] flex-row pt-[50] justify-between items-center">
                <View className="bg-loadingLight w-[50] h-[10]"></View>
                <View className="bg-loadingLight w-[100] h-[40]"></View>
            </View>
            <View className="pt-[70] items-center gap-y-[10]">
                <View className="bg-loadingLight w-[100] h-[10]"></View>
                <View className="bg-loadingLight w-[80] h-[10]"></View>
            </View>
        </View>
    )
}




