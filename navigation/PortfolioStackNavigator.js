import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PortfolioScreen from "../screens/PortfolioScreen";
import AddCoinScreen from "../screens/AddCoinScreen";
import CoinScreen from "../screens/CoinScreen";

const PortfolioStack = createNativeStackNavigator();

const PortfolioStackNavigator = () => {
    return (
        <PortfolioStack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: '#6200ee',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <PortfolioStack.Screen
                name="Portfolio"
                component={PortfolioScreen}
                options={{ 
                    title: 'My Portfolio',
                }}
            />
            <PortfolioStack.Screen
                name="AddCoin"
                component={AddCoinScreen}
                options={{ title: 'Add New Coin' }}
            />
            <PortfolioStack.Screen
                name="CoinDetails"
                component={CoinScreen}
                options={{ title: 'Coin Details' }}
            />
            {/* Remove the extraneous 's' from here */}
        </PortfolioStack.Navigator>
    );
};


export default PortfolioStackNavigator