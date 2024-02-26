// temp route to view signup page
import { View } from "react-native";
import Login from "../../components/Login";
import Signup from "../../components/Signup";

export default function login() {
    return (
        <View className="h-screen items-center justify-center">
            <Signup />
        </View>
    )
    
}
