import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { debounce } from "lodash";
import { fetchCMCSearchResultsWithDetails } from "../utils/api";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../services/supabase";
import { Text, Button } from "react-native-paper";
import CustomModal from "../components/CustomModal";
import { useTheme } from "react-native-paper";
import { useHandleTheme } from "../hooks/useTheme";
import { CoinFetch, ProfileFetch } from "../queries";
import useAuthStore from "../store/useAuthStore";

const AddCoinScreen = () => {
  const theme = useTheme();
  const { colors } = useHandleTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [numberOfShares, setNumberOfShares] = useState("");
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [budgetPerCoin, setBudgetPerCoin] = useState(0);
  const [addCoinLoading, setAddCoinLoading] = useState(false);

  const user = useAuthStore(s => s.user)
  const session = useAuthStore(s => s.session)

  const debouncedSearch = debounce(async (query, abort) => {
    // If the query is empty, clear the search results and exit early
    if (!query) {
        setSearchResults([]);
        return;
    }

    // Set search loading state to indicate that search is in progress
    setSearchLoading(true);

    try {
        const res = await CoinFetch.searchWithDetails(query, abort)
        const results = res.data
        // Attempt to fetch search results using the provided query
        // const results = await fetchCMCSearchResultsWithDetails(query);

        // Update the search results state with the fetched results
        setSearchResults(results);

        // Set search loading state to false as search is successful
        setSearchLoading(false);
    } catch (error) {
        // Log any errors that occur during the search
        console.error(error);
    }
}, 800);


  async function fetchBudget() {
    const id = user.id;
    const jwt = session.access_token;
    if (!id || !jwt) return;
    try {
      const res = await ProfileFetch.getBudget(id, jwt)
      const budget = res.data.budget
      setBudgetPerCoin(budget)
    } catch (error) {
      console.error('error fetching budget', error)
    }
  }


  useEffect(() => {
      console.log('fetch budget effect')
    // const fetchBudget = async () => {
    //   try {
    //     const {
    //       data: { user },
    //     } = await supabase.auth.getUser();

    //     if (!user) {
    //       console.error("User not logged in");
    //       return;
    //     }

    //     const { data, error } = await supabase
    //       .from("subscription")
    //       .select("budget")
    //       .eq("userId", user.id)
    //       .single();

    //     if (error) {
    //       throw error;
    //     }

    //     if (data) {
    //       setBudgetPerCoin(data.budget);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching budget:", error.message);
    //   }
    // };
    if (user) {
      fetchBudget();
    }
  }, [user]);

  useEffect(() => {
    console.log('search coin useEffect')
    const abort = new AbortController()
    debouncedSearch(searchTerm, abort);
    return () => {
      abort.abort()
      setSearchLoading(false);
      return debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const handleSelectCoin = async (coin) => {
    setSelectedCoin(coin);
  };

  const handleConfirm = async () => {
    if (!selectedCoin || !numberOfShares) return;
    try {
      const id = user.id;
      const jwt = session.access_token
      if (!id || !jwt) return;
      setAddCoinLoading(true)
      await ProfileFetch.addCoin(id,jwt,{
        selectedCoin,
        numberOfShares,
        userId: id,
        budgetPerCoin
      })
      setSelectedCoin(null);
      setNumberOfShares("");
      navigation.goBack();
    } catch (error) {
      console.error(error)
        const errMsg = error?.response?.data?.error;
        if (errMsg.includes("You already have")) {
          setModalMessage(
            `You already have ${selectedCoin.name} in your portfolio.`
          );
          setIsModalVisible(true);
        }
    } finally {
      setAddCoinLoading(false)
    }
    return

    // setAddCoinLoading(true);
    // if (selectedCoin && numberOfShares) {
    //   console.log("selectedCoin:", selectedCoin);
    //   //MY  Calculations
    //   const totalHoldings =
    //     selectedCoin.currentPrice * parseFloat(numberOfShares);
    //   const trueBudgetPerCoin =
    //     totalHoldings / (selectedCoin.currentPrice / selectedCoin.allTimeLow);
    //   const projectedRoi = trueBudgetPerCoin * 70;

    //   const mustOwnShares = budgetPerCoin / selectedCoin.allTimeLow;
    //   const sharesMissing = mustOwnShares - numberOfShares;
    //   const additionalBudget = sharesMissing * selectedCoin.currentPrice;

    //   const {
    //     data: { user },
    //   } = await supabase.auth.getUser();

    //   if (user) {
    //     const { data: existingEntries, error: existingEntriesError } =
    //       await supabase
    //         .from("portfolio")
    //         .select("*")
    //         .eq("userId", user.id)
    //         .eq("coinId", selectedCoin.id);

    //     if (existingEntriesError) {
    //       console.error(
    //         "Error checking for existing portfolio entry:",
    //         existingEntriesError
    //       );
    //       setAddCoinLoading(false);
    //       return;
    //     }

    //     if (existingEntries.length > 0) {
    //       setModalMessage(
    //         `You already have ${selectedCoin.name} in your portfolio.`
    //       );
    //       setIsModalVisible(true);
    //       setAddCoinLoading(false);
          
    //       return;
    //     }

    //     const portfolioData = {
    //       userId: user.id,
    //       shares: parseFloat(numberOfShares, 10),
    //       //self caulculation
    //       athRoi: selectedCoin.athRoi,
    //       increaseFromATL: selectedCoin.percentIncreaseFromAtl,
    //       totalHoldings: totalHoldings,
    //       trueBudgetPerCoin: trueBudgetPerCoin,
    //       additionalBudget: additionalBudget,
    //       mustOwnShares: mustOwnShares,
    //       sharesMissing: sharesMissing,
    //       projectedRoi: projectedRoi,
    //       priceChangeIcon: selectedCoin.priceChangeIcon,
    //       priceChangeColor: selectedCoin.priceChangeColor,

    //       //from api
    //       coinId: selectedCoin.id,
    //       coinImage: selectedCoin.logo,
    //       coinName: selectedCoin.name,
    //       coinSymbol: selectedCoin.symbol,
    //       coinDescription: selectedCoin.description,
    //       marketCapRank: selectedCoin.marketCapRank,
    //       allTimeHigh: selectedCoin.allTimeHigh,
    //       allTimeLow: selectedCoin.allTimeLow,
    //       priceChangePercentage: selectedCoin.priceChangePercentage,
    //       tradingVolume: selectedCoin.tradingVolume,
    //       marketCap: selectedCoin.marketCap,
    //       maxSupply: selectedCoin.maxSupply,
    //       totalSupply: selectedCoin.totalSupply,
    //       circulatingSupply: selectedCoin.circulatingSupply,
    //       currentPrice: selectedCoin.currentPrice,
    //     };

    //     const { data, error } = await supabase
    //       .from("portfolio")
    //       .insert([portfolioData]);

    //     if (error) {
    //       console.error("Error saving portfolio data:", error);
    //       setAddCoinLoading(false);
    //     } else {
    //       console.log("Portfolio data saved successfully:", data);
    //       setSelectedCoin(null);
    //       setNumberOfShares("");
    //       setAddCoinLoading(false);
    //       navigation.goBack();
    //     }
    //   } else {
    //     console.error("User not logged in");
    //     setAddCoinLoading(false);
    //   }
    //   setAddCoinLoading(false);
    // }
    // setAddCoinLoading(false);
  };

  const dynamicStyles = StyleSheet.create({
    textInput: {
      color: colors.text,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomModal
        isVisible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
        title={modalMessage}
        onConfirm={() => setIsModalVisible(false)}
        // onCancel={handleCancel}
        // confirmText="Yes, Confirm"
        // cancelText="No, Cancel"
      />
      {selectedCoin ? (
        <View
          style={[
            styles.selectedCoinContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Image source={{ uri: selectedCoin.thumb }} style={styles.icon} />
          <Text style={styles.coinName}>{selectedCoin.name}</Text>
          <TextInput
            style={[
              styles.searchInput,
              dynamicStyles.textInput,
              { backgroundColor: colors.input, marginTop: 20, paddingLeft: 35 },
              { opacity: addCoinLoading ? 0.5 : 1 },
            ]}
            placeholder="Number of Shares"
            value={numberOfShares}
            onChangeText={setNumberOfShares}
            keyboardType="numeric"
            editable={!addCoinLoading}
            width={350}
          />
          <View style={styles.actionContainer}>
            <Button
              mode="contained"
              onPress={handleConfirm}
              style={[
                styles.actionButton,
                { backgroundColor: "#02F5C3", marginTop: 20 },
              ]}
              labelStyle={styles.buttonLabel}
              disabled={addCoinLoading}
            >
              {addCoinLoading ? (
                <ActivityIndicator size={22} animating={addCoinLoading} />
              ) : (
                "Confirm"
              )}
            </Button>
            <Button
              onPress={() => setSelectedCoin(null)}
              mode="contained"
              style={[
                styles.actionButton,
                { backgroundColor: "#292E2D", marginTop: 20 }, // Setting the background color
              ]}
              labelStyle={{ color: "#fff" }} // Setting the text color
              disabled={addCoinLoading}
            >
              Cancel
            </Button>
          </View>
        </View>
      ) : (
        <>
          <View style={{ position: "relative", margin: 20 }}>
            <TextInput
              style={[
                styles.searchInput,
                dynamicStyles.textInput,
                { backgroundColor: colors.input, paddingLeft: 30 },
              ]}
              placeholder="Search for a coin..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <ActivityIndicator
              animating={searchLoading}
              size={24}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                marginTop: -12,
              }}
            />
          </View>

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectCoin(item)}
                style={styles.resultItem}
              >
                <Image source={{ uri: item.logo }} style={styles.icon} />
                <Text style={styles.coinName}>{item.symbol}</Text>
                <Text style={[styles.coinName, { fontSize: 12 }]}>{item.name}</Text>


              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: 55,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  coinName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  selectedCoinContainer: {
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    width: "40%",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    width: "80%",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 12,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    marginTop: 10,
  },
});

export default AddCoinScreen;
