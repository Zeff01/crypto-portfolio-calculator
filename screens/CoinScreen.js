import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import useGlobalStore from "../store/useGlobalStore";
import { dataToParse, generateTableData } from "../utils/formatter";
import { supabase } from "../services/supabase";
import { useNavigation } from "@react-navigation/native";

export default function CoinScreen({ route }) {
  const navigation = useNavigation();
  const { usdToPhpRate } = useGlobalStore();
  const theme = useTheme();

  const data = route.params.data;
  const [tableData, setTableData] = useState([]);
  const [shares, setShares] = useState(data.shares.toString());

  const [showFullDescription, setShowFullDescription] = useState(false);
  useEffect(() => {
    setTableData(generateTableData(data, dataToParse, usdToPhpRate));
  }, [data, usdToPhpRate]);

  const truncatedDescription = data.coinDescription
    ? truncateDescription(data.coinDescription, 15)
    : "";
  const fullDescription = data.coinDescription;

  const handleSharesChange = async (text) => {
    // Trim whitespace and store the input as a string for UI purposes
    const inputText = text.trim();
    setShares(inputText);
  
    // Handle empty input case
    if (inputText === "") {
      setShares("0"); // Use "0" instead of 0 to keep the state as a string
    } else {
      // Parse the input as a float for calculations
      const newSharesFloat = parseFloat(inputText);
      if (!isNaN(newSharesFloat)) {
        try {
          // Fetch user's budget from the subscription table
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .from("subscription")
            .select("budget")
            .eq("userId", data.userId)
            .single();
  
          if (subscriptionError || !subscriptionData) {
            throw subscriptionError || new Error("No subscription data found");
          }
  
          const userBudget = subscriptionData.budget || 0;
  
          // Update Supabase table with new shares value
          const { data: updateData, error } = await supabase
            .from("portfolio")
            .update({
              shares: newSharesFloat,
              totalHoldings: newSharesFloat * data.currentPrice,
              trueBudgetPerCoin: (newSharesFloat * data.currentPrice) / (data.currentPrice / data.allTimeLow),
              projectedRoi: ((newSharesFloat * data.currentPrice) / (data.currentPrice / data.allTimeLow)) * 70,
              additionalBudget: Math.max(
                userBudget - (newSharesFloat * data.currentPrice) / (data.currentPrice / data.allTimeLow),
                0
              ),
            })
            .eq("coinId", data.coinId)
            .eq("userId", data.userId);
  
          if (error) {
            throw error;
          }
  
          // Fetch updated data after successful update
          const { data: newData, error: fetchError } = await supabase
            .from("portfolio")
            .select("*")
            .eq("coinId", data.coinId)
            .eq("userId", data.userId)
            .single();
  
          if (fetchError) {
            throw fetchError;
          }
  
          // Update tableData state with the new data
          setTableData(generateTableData(newData, dataToParse, usdToPhpRate));
        } catch (error) {
          console.error("Error updating shares:", error.message);
        }
      }
    }
  };
  

  function toggleDescription() {
    setShowFullDescription(!showFullDescription);
  }

  function truncateDescription(description, maxLength) {
    const words = description.split(" ");
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(" ") + "...";
    }
    return description;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 1,
          }}
          >
      <View
          style={{
          backgroundColor: theme.colors.surface,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center'
          }}
      >
      <Image
          source={require('../assets/images/back-arrow.png')}
          style={{ width: 17, height: 17 }}
      />
      </View>
    </TouchableOpacity>


       
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Image
            source={{ uri: data.coinImage }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 28,
              color: theme.colors.text,
              marginTop: 10,
            }}
          >
            {data.coinName}
          </Text>
          {data.coinDescription && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.text,
                  marginTop: 10,
                  marginLeft: 30,
                  marginRight: 30,
                  textAlign: "center",
                }}
              >
                {showFullDescription ? fullDescription : truncatedDescription}
              </Text>
              {data.coinDescription.split(" ").length > 15 && (
                <TouchableOpacity
                  onPress={toggleDescription}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ color: theme.colors.primary }}>
                    {showFullDescription ? "Show Less" : "Show More"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {tableData.map((r, index) => {
          const key = r[0];
          const value = r[1];

          // Check if it's the "Shares" row
          if (key === "Shares") {
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 20,
                  marginVertical: 8,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 16,
                      color: theme.colors.primary,
                    }}
                  >
                    {key}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <TextInput
                    style={{
                      fontWeight: "500",
                      color: theme.colors.text,
                      textAlign: "right",
                    }}
                    value={shares}
                    onChangeText={handleSharesChange}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            );
          } else {
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 20,
                  marginVertical: 8,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 16,
                      color: theme.colors.primary,
                    }}
                  >
                    {key}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  {typeof value === "string" && value.includes("|") ? (
                    value.split("|").map((item, idx) => (
                      <Text
                        key={idx}
                        style={{ fontWeight: "500", color: theme.colors.text }}
                      >
                        {item}
                      </Text>
                    ))
                  ) : (
                    <Text
                      style={{ fontWeight: "500", color: theme.colors.text }}
                    >
                      {value}
                    </Text>
                  )}
                </View>
              </View>
            );
          }
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
