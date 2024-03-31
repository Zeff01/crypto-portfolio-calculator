import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  AppState,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import CoinCard from "../components/CoinCard";
import {
  fetchUsdToPhpRate,
  updatePortfolioWithCMC,
  updatePortfolioWithCoinGeckoData,
} from "../utils/api";
import { supabase } from "../services/supabase";
import useGlobalStore from "../store/useGlobalStore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PortfolioHeader from "../components/PortfiolioHeader";
import DraggableFlatList from "react-native-draggable-flatlist";
import Spinner from "react-native-loading-spinner-overlay";
import { RefreshControl } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useHandleTheme } from "../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { CoinFetch, ProfileFetch } from "../queries";
import useAuthStore from "../store/useAuthStore";



const sortOptions = {
  default: "default",
  percentDesc: "percentDesc",
  percentAsc: "percentAsc",
  gainsDesc: "gainsDesc",
  gainsAsc: "gainsAsc",
};

const PortfolioScreen = () => {
  const theme = useTheme();
  const { colors } = useHandleTheme();
  const { setUsdToPhpRate } = useGlobalStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [portfolioEntries, setPortfolioEntries] = useState([]);
  const [totalHoldings, setTotalHoldings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [simplifiedView, setSimplifiedView] = useState(false);
  const [sortBy, setSortBy] = useState("gainsDesc");
  const [sortedPortfolioEntries, setSortedPortfolioEntries] =
    useState(portfolioEntries);
  const navigation = useNavigation();
  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);
  const toggleViewMode = () => setSimplifiedView(!simplifiedView);
  const logout = useAuthStore(s => s.logout)
  const user = useAuthStore(s => s.user)
  const session = useAuthStore(s => s.session)

  async function updatePortfolio() {
    const id = user.id;
    const jwt = session.access_token
    console.log({id:Boolean(id), jwt:Boolean(jwt)})
    if (!id || !jwt) return;
    try {
      await ProfileFetch.updatePortfolio(id, jwt)
      console.log('portfolio updated')
    } catch (error) {
      console.error('error updating portfolio', error)
    }
  }

  //fetch portfolio data
  const fetchPortfolioData = async () => {
    showLoader();
    const id = user.id;
    const jwt = session.access_token
    if (!id ||!jwt) {
      console.log('No active session. User must be logged in to fetch portfolio data.')      
      hideLoader()
      return
    }
    try {
      const res = await ProfileFetch.getPortfolioData(id,jwt)
      const data = res.data.data
      setPortfolioEntries(data)
      console.log('portfolio data fetched')
    } catch (error) {
      console.error('error updating portfolio data', error)
    } finally {
      hideLoader()
    }

    // const { data: sessionData, error: sessionError } =
    //   await supabase.auth.getSession();

    // if (sessionError) {
    //   console.error("Error fetching session:", sessionError.message);
    //   hideLoader();
    //   return;
    // }

    // if (sessionData && sessionData.session) {
    //   const { data: userData, error: userError } =
    //     await supabase.auth.getUser();
    //   if (userError) {
    //     console.error("Error fetching user:", userError);
    //     return;
    //   }
    //   if (!userData) {
    //     console.log("No user found");
    //     return;
    //   }

    //   if (userData) {
    //     const { data: portfolioData, error } = await supabase
    //       .from("portfolio")
    //       .select("*")
    //       .eq("userId", userData.user.id)
    //       .order("orderIndex", { ascending: true });

    //     if (error) {
    //       console.error("Error fetching portfolio data:", error);
    //     } else {
    //       setPortfolioEntries(portfolioData);
    //     }
    //   }
    // } else {
    //   console.log(
    //     "No active session. User must be logged in to fetch portfolio data."
    //   );
    // }
    // hideLoader();
  };

  //get dollar rate to php
  const getExchangeRate = async () => {
    try {
      const res = await CoinFetch.getExchangeRate()
      const rates = res.data.rates      
      console.log({rates})
      setUsdToPhpRate(rates);
    } catch (error) {
      console.error('error fetching exchange rate', error)
    }  
  };

  //check if paid already
  const checkUserPaymentStatus = async () => {
    const id = user.id;
    const jwt = session.access_token
    if (!id || !jwt) return;
    try {
      const res = await ProfileFetch.getPaymentStatus(id,jwt)
      if (!res?.data.isPaid) {
        setModalVisible(true)
      }
    } catch (error) {
      console.error('error fetching user data')
    }

    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();
    // if (user) {
    //   const { data, error } = await supabase
    //     .from("subscription")
    //     .select("isPaid")
    //     .eq("userId", user.id)
    //     .single();

    //   if (error) {
    //     console.error("Error fetching user data:", error);
    //     return;
    //   }

    //   if (!data?.isPaid) {
    //     setModalVisible(true);
    //   }
    // }
  };

  //to fetch portfolio data
  useFocusEffect(
    React.useCallback(() => {
      // Fetch or refresh your portfolio data here
      if (user) {
        fetchPortfolioData();
      }
    }, [user])
  );

  //get total holdings based on portfolio entries
  useEffect(() => {
    const total = portfolioEntries.reduce(
      (acc, entry) => acc + entry.totalHoldings,
      0
    );
    setTotalHoldings(total.toFixed(2));
  }, [portfolioEntries]);

  //initial fetch
  useEffect(() => {
    if (user) {
      checkUserPaymentStatus();
      getExchangeRate();
    }
  }, [user]);

  const refreshData = async () => {
    // await fetchPortfolioData();
    // await updatePortfolioWithCoinGeckoData();
  };

  useFocusEffect(
    useCallback(() => {
      if (user)
      refreshData();
    }, [user])
  );

  useEffect(() => {
    const interval = setInterval(
      // updatePortfolioWithCMC, 
      updatePortfolio,
      1800000
    ); // Fetch every 30 mins

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        if (user) {
          updatePortfolio()
        }
        // updatePortfolioWithCMC();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const sortedEntries = [...portfolioEntries]; // Shallow copy the array

    switch (sortBy) {
      case sortOptions.percentDesc:
        sortedEntries.sort(
          (a, b) => b.priceChangePercentage - a.priceChangePercentage
        );
        break;
      case sortOptions.percentAsc:
        sortedEntries.sort(
          (a, b) => a.priceChangePercentage - b.priceChangePercentage
        );
        break;
      case sortOptions.gainsDesc:
        sortedEntries.sort((a, b) => b.totalHoldings - a.totalHoldings);
        break;
      case sortOptions.gainsAsc:
        sortedEntries.sort((a, b) => a.totalHoldings - b.totalHoldings);
        break;
      default:
        // Default to no sorting
        break;
    }

    setSortedPortfolioEntries(sortedEntries);
  }, [sortBy, portfolioEntries]);

  const renderItem = ({ item, index, drag, isActive, navigate }) => {
    const itemStyle = simplifiedView
      ? styles.itemTwoColumn
      : styles.itemSingleColumn;
    return (
      <CoinCard
        style={[itemStyle, { backgroundColor: isActive ? "#f0f0f0" : "#fff" }]}
        data={item}
        fetchPortfolioData={fetchPortfolioData}
        simplifiedView={simplifiedView}
        // onLongPress={() => handleDelete()}
        isActive={isActive}
      />
    );
  };

  const [totalTrueBudgetPerCoin, SetTotalTrueBudgetPerCoin] = useState(0);
  useEffect(() => {
    if (user) {
      fetchTotalBudgetPerCoin();
    }
  }, [user]);

  //fetch total budget per coin
  const fetchTotalBudgetPerCoin = async (userID) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let { data, error, status } = await supabase
          .from("portfolio")
          .select("trueBudgetPerCoin")
          .eq("userId", user.id);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          // Sum the trueBudgetPerCoin values
          const total = data.reduce(
            (acc, { trueBudgetPerCoin }) => acc + Number(trueBudgetPerCoin),
            0
          );
          SetTotalTrueBudgetPerCoin(total * 70);
        }
      } else {
        console.log("No session found. User is not logged in.");
      }
    } catch (error) {
      console.error("Error fetching total budget per coin:", error);
      return 0; // or handle the error as needed
    }
  };

  const ListHeaderComponent = () => {
    const { colors } = useHandleTheme();

    return (
      <View className={`flex flex-col bg-[${colors.card}]`}>
        <PortfolioHeader
          title="Balance"
          totalHoldings={totalHoldings}
          fetchPortfolioData={fetchPortfolioData}
          totalTrueBudgetPerCoin={totalTrueBudgetPerCoin}
        />
        <View style={styles.iconsContainer}>
          <TouchableOpacity // need to encapsulate to picker component to style it
            style={{
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              width: 150,
              height: 35,
              marginRight: "auto",
              borderRadius: 10,
              backgroundColor: "black",
              elevation: 3,
            }}
            itemStyle={{
              fontSize: 12,
              backgroundColor: "red",
            }}
          >
            <Picker
              selectedValue={sortBy}
              onValueChange={(item) => {
                setSortBy(item);
              }}
              mode="dropdown"
              style={{ width: 150, color: "white" }}
              dropdownIconColor={"white"}
              dropdownIconRippleColor={colors.primary}
            >
              <Picker.Item
                label="default"
                value={sortOptions.default}
                style={{
                  backgroundColor: "black",
                  fontSize: 15,
                  color: "white",
                }}
              />
              <Picker.Item
                label="percent desc"
                value={sortOptions.percentDesc}
                style={{
                  backgroundColor: "black",
                  fontSize: 15,
                  color: "white",
                }}
              />
              <Picker.Item
                label="percent asc"
                value={sortOptions.percentAsc}
                style={{
                  backgroundColor: "black",
                  fontSize: 15,
                  color: "white",
                }}
              />
              <Picker.Item
                label="total desc"
                value={sortOptions.gainsDesc}
                style={{
                  backgroundColor: "black",
                  fontSize: 15,
                  color: "white",
                }}
              />
              <Picker.Item
                label="total asc"
                value={sortOptions.gainsAsc}
                style={{
                  backgroundColor: "black",
                  fontSize: 15,
                  color: "white",
                }}
              />
            </Picker>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleViewMode}
            style={styles.toggleViewButton}
          >
            <MaterialIcons
              name={simplifiedView ? "view-agenda" : "view-module"}
              size={36}
              color={colors.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddCoin")}
            style={styles.toggleViewButton}
          >
            <View className="flex flex-row py-[10px] px-[20px] rounded-full justify-center items-center bg-black">
              <MaterialIcons name="add" size={16} color="#02F5C3" />
              <Text className="text-[#FFFFFF] capitalize text-[10px] font-[500] ml-1">
                add
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // await updatePortfolioWithCMC();
      await updatePortfolio()
      await fetchPortfolioData();
    } catch (error) {
      console.error("Refreshing failed:", error);
    }
    setRefreshing(false);
  }, []);

  return (
    <>
      <LinearGradient
        colors={[
          `${colors.background}`,
          `${colors.background}`,
          `${colors.background}`,
        ]}
        className="flex flex-1"
      >
        <View className={`p-[10px] pb-12 flex flex-1`}>
          <Spinner
            visible={loading}
            textContent={"Fetching Portfolio data"}
            textStyle={styles.spinnerTextStyle}
            color={"#FFF"}
            overlayColor={"rgba(0,0,0,0.75)"}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {}}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Ionicons name="warning" size={30} color="red" />
                <Text style={styles.modalText}>Access Denied</Text>
                <Text>Please contact the admin to complete your payment.</Text>
                <TouchableOpacity onPress={logout} style={{position: "absolute", top: "15%", right:"5%"}} >
                  <AntDesign name="logout" size={16} color="red"/>
                </TouchableOpacity>                
              </View>
            </View>
          </Modal>
          {portfolioEntries.length === 0 && (
            <PortfolioHeader
              title="Balance"
              totalHoldings={totalHoldings}
              fetchPortfolioData={fetchPortfolioData}
            />
          )}
          {portfolioEntries.length === 0 ? (
            <View
              style={[
                styles.container,
                styles.placeholderContainer,
                { rowGap: 10 },
              ]}
            >
              <Text style={{ color: theme.colors.text }}>
                No coins added yet.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddCoin")}
                style={[
                  styles.toggleViewButton,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: theme.colors.primary,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 10,
                    elevation: 5,
                  },
                ]}
              >
                <Text style={{ color: "white" }}>ADD COIN</Text>
                <MaterialIcons name="add" size={32} color="#6200ee" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className={`p-[10px] flex flex-1`}>
              <Text
                className={`text-[16px] font-[600] uppercase leading-6 pl-[20px] mb-[20px] text-[${colors.text}]`}
              >
                dashboard account
              </Text>
              <DraggableFlatList
                data={sortedPortfolioEntries}
                renderItem={renderItem}
                keyExtractor={(item, index) => `draggable-item-${item.id}`}
                numColumns={simplifiedView ? 2 : 1}
                ListHeaderComponent={ListHeaderComponent}
                showsVerticalScrollIndicator={false}
                key={simplifiedView ? "two-columns" : "one-column"}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>
          )}
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  rateAndBudgetContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rateDisplay: {
    fontSize: 16,
    marginBottom: 10,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    width: 100,
    marginRight: 8,
    fontSize: 16,
    marginTop: 10,
  },
  inputAndAddIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  budgetDisplay: {
    flexDirection: "column",
  },
  iconButton: {
    padding: 0,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  budgetText: {
    fontSize: 16,
    color: "green",
  },
  budgetTitle: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  spinnerTextStyle: {
    color: "#FFF",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "column",
  },
  toggleViewButton: {
    padding: 0,
    marginHorizontal: 2,
  },
  itemSingleColumn: {
    flex: 1,
  },
  itemTwoColumn: {
    width: Dimensions.get("window").width / 2 - 15,
    flex: 1 / 2,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 8,
    display: "flex",
    flex: 1,
  },
});

export default PortfolioScreen;
