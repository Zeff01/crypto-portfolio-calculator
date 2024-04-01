import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FontAwesome, Foundation, Ionicons } from "@expo/vector-icons";
import useGlobalStore from "../store/useGlobalStore";
import { supabase } from "../services/supabase";
import { useHandleTheme } from "../hooks/useTheme";
import { ProfileFetch } from "../queries";
import useAuthStore from "../store/useAuthStore";
import { ActivityIndicator } from "react-native";
const PortfolioHeader = ({
  title,
  totalHoldings,
  fetchPortfolioData,
  totalTrueBudgetPerCoin,
}) => {
  const { colors, theme } = useHandleTheme();
  const [holdingsVisible, setHoldingsVisible] = useState(true);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budget, setBudget] = useState(0);  
  const { usdToPhpRate } = useGlobalStore();
  const session  = useAuthStore(s => s.session)
  const user  = useAuthStore(s => s.user)
  const [loading ,setLoading] = useState(false)



  const phpBudget = (budget * usdToPhpRate).toFixed(2)

  const fetchBudget = async () => {
    try {
      const id = user.id;
      const jwt = session.access_token
      if (!id || !jwt) return
      const res = await ProfileFetch.getBudget(id, jwt)
      const budget = res.data.budget ?? 0
      console.log(`the current budget is ${budget}`)
      setBudget(budget)
    } catch (error) {
      console.error('error fetching budget', error)
    }
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();
    // if (user) {
    //   const { data, error } = await supabase
    //     .from("subscription")
    //     .select("budget")
    //     .eq("userId", user.id)
    //     .single();

    //   if (error) {
    //     console.error("Error fetching budget:", error);
    //     return;
    //   }

    //   // Set budget to fetched value or fallback to 0 if null/undefined
    //   setBudget(data?.budget ?? 0);
    // }
  };


  const updateBudget = async (newBudget) => {
    if (loading) return
    try {
      const id = user.id;
      const jwt = session.access_token
      if (id && jwt) {
        setLoading(true)
        const res = await ProfileFetch.updateBudget(id, jwt, {newBudget})
        console.log(`status for updating budget is ${res.status}`)
        if (res.status === 200) {
          console.log('success updating budget')
          fetchPortfolioData?.();
          setBudget(newBudget);
        }
      }
    } catch (error) {
      console.error('error updating budget', error)      
    } finally {
      setLoading(false)
      setIsEditingBudget(false);
    }
    return

    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();
    // if (user) {
    //   const { error } = await supabase
    //     .from("subscription")
    //     .update({ budget: newBudget })
    //     .eq("userId", user.id);

    //   const { data: portfolioData, error: fetchError } = await supabase
    //     .from("portfolio")
    //     .select("*")
    //     .eq("userId", user.id);

    //   if (fetchError || !portfolioData) {
    //     console.error("Error fetching portfolio data:", fetchError);
    //     return;
    //   }

    //   if (error) {
    //     console.error("Error updating budget:", error);
    //     return;
    //   }
    //   portfolioData.forEach(async (entry) => {
    //     const mustOwnShares = newBudget / entry.atlPrice;
    //     const sharesMissing = mustOwnShares - entry.shares;
    //     const additionalBudget = sharesMissing * entry.currentPrice;
    //     const { error: updateError } = await supabase
    //       .from("portfolio")
    //       .update({
    //         additionalBudget: additionalBudget,
    //         sharesMissing: sharesMissing,
    //         mustOwnShares: mustOwnShares,
    //       })
    //       .match({ id: entry.id });

    //     if (updateError) {
    //       console.error("Error updating portfolio entry:", updateError);
    //     }
    //   });

    //   fetchPortfolioData?.();
    //   setBudget(newBudget);
    //   setIsEditingBudget(false);
    // }
  };

  const handleBudgetChange = (value) => {
    const numericValue = value.replace(/[^\d.]/g, "");
    setBudget(numericValue);
  };

  //edit budget input
  const toggleEdit = () => {
    setIsEditingBudget(!isEditingBudget);
  };

  const handleBudgetUpdate = () => {
    const newBudgetValue = parseFloat(budget.replace(/,/g, ""));
    if (!isNaN(newBudgetValue) && newBudgetValue >= 0) {
      console.log("Updating budget...");
      updateBudget(newBudgetValue);
    } else {
      console.warn("Invalid budget value entered.");
      alert("Please enter a valid budget value.");
    }
  };

  let formattedBudget = budget?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  let numericBudget = parseFloat(budget);
  if (isNaN(numericBudget) || isNaN(usdToPhpRate)) {
    // Handle error or set defaults
    numericBudget = 0; // Default or error handling
  }

  // const phpBudget = (numericBudget * usdToPhpRate).toFixed(2);

  useEffect(() => {
    console.log('fetch budget useEffect')
    if (user) {
      fetchBudget();
    }
  }, [user]);

  return (
    <View
      style={{
        marginBottom: 20,
        padding: 20,
        borderRadius: 8,
        backgroundColor: colors.coin,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Your View content */}
      <View style={styles.content}>
        <Text
          className={`text-[16px] font-[500] mb-2 leading-[24px] text-[${colors.text}]`}
        >
          {title}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setHoldingsVisible(!holdingsVisible)}
          >
            <FontAwesome
              name={holdingsVisible ? "eye" : "eye-slash"}
              size={20}
              color={colors.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Foundation name="graph-pie" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>
      {holdingsVisible ? (
        <View style={styles.holdingsContainer}>
          <View className="flex flex-row gap-2 items-end">
            <Text className={`text-[24px] font-[500] text-[${colors.text}]`}>
              {parseFloat(totalHoldings).toLocaleString("en-US")}
            </Text>
            <Text
              className={`text-[10px] font-[400] text-[#B4B4B4] uppercase tracking-[2px]`}
            >
              usd
            </Text>
          </View>
          <View className="flex flex-row gap-2 items-end">
            <Text className={`text-[24px] font-[500] text-[${colors.text}]`}>
              {new Intl.NumberFormat("en-US", {
                style: "decimal",
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }).format(parseFloat(totalHoldings) * usdToPhpRate)}
            </Text>

            <Text className="text-[10px] font-[400]  text-[#B4B4B4] uppercase tracking-[2px]">
              php
            </Text>
          </View>

          <View>
            <Text
              className={`text-[16px] font-[500] my-2 leading-[24px] text-[${colors.text}]`}
            >
              Total ROI
            </Text>
            <View className="flex flex-row gap-2 items-end">
              <Text className={`text-[24px] font-[500] text-[${colors.text}]`}>
                {parseFloat(totalTrueBudgetPerCoin).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>

              <Text
                className={`text-[10px] font-[400]  text-[#B4B4B4] uppercase tracking-[2px]`}
              >
                usd
              </Text>
            </View>
            <View className="flex flex-row gap-2 items-end">
              <Text className={`text-[24px] font-[500] text-[${colors.text}]`}>
                {new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }).format(parseFloat(totalTrueBudgetPerCoin) * usdToPhpRate)}
              </Text>

              <Text className="text-[10px] font-[400]  text-[#B4B4B4] uppercase tracking-[2px]">
                php
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text className={`text-[16px] text-[${colors.text}] mb-2`}>******</Text>
      )}
      {isEditingBudget ? (
        <>
          <Text style={styles.holdings}>Enter Budget in (USD)</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              style={styles.budgetInput}
              value={budget.toString()}
              onChangeText={handleBudgetChange}
              placeholder="0"
              keyboardType="numeric"
              returnKeyType="done"
              onBlur={handleBudgetUpdate}
            />

            <TouchableOpacity
              onPress={handleBudgetUpdate}
              style={styles.iconButton}
            >      
              {
                loading ?
                <ActivityIndicator size={30} color="green" /> :
                <FontAwesome name="check-circle" size={30} color="green" />
              }        
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.budgetContainer}>
          <Text
            className={` text-[14px] text-[${colors.text}] mb-2 font-[500] leading-[21px]`}
          >
            Your Budget:
          </Text>
          <View className="flex flex-row">
            <Text
              className={` text-[14px] text-[${colors.text}] font-[500] text-center`}
            >
              {" "}
              {formattedBudget} / ₱{phpBudget}
            </Text>
            <TouchableOpacity onPress={toggleEdit} style={styles.iconButton}>
              <FontAwesome
                name="pencil-square-o"
                size={16}
                color={colors.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  holdingsContainer: {
    flexDirection: "column",
    gap: 4,
    marginBottom: 10,
  },
  holdings: {
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
  },
  budgetContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  },
  budget: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "500",
    textAlign: "center",
  },
  iconButton: {
    marginLeft: 5,
  },
  budgetInput: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 2,
    marginTop: 5,
    width: 150,
  },
});

export default PortfolioHeader;
