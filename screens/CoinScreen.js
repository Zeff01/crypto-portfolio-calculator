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
import useAuthStore from "../store/useAuthStore";
import { ProfileFetch } from "../queries";
import { Feather } from '@expo/vector-icons';
import { ActivityIndicator } from "react-native";

export default function CoinScreen({ route }) {
  const navigation = useNavigation();
  const { usdToPhpRate } = useGlobalStore();
  const theme = useTheme();

  const data = route.params.data;
  const [tableData, setTableData] = useState([]);
  const [shares, setShares] = useState(data ? data.shares.toString() : "0");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(false)
  const initialShares = data ? data.shares.toString() : "0"
  const user = useAuthStore(s => s.user)
  const session = useAuthStore(s => s.session)


  useEffect(() => {
    console.log('table data useEffect')
    if (data) {
      setTableData(generateTableData(data, dataToParse, usdToPhpRate));
    }
  }, [data, usdToPhpRate]);

  if (!data) {
    return <Text>Loading...</Text>;
  }

  const truncatedDescription = data.coinDescription
    ? truncateDescription(data.coinDescription, 15)
    : "";
  const fullDescription = data.coinDescription;

  async function updateCoin() {
    if (Number(shares) <= 0) return;
    if (loading) return
    try {
      setLoading(true)
      const id = user.id;
      const jwt = session.access_token
      if (!id || !jwt) return;
      await ProfileFetch.updateSingleCoin(id, jwt, Number(shares), data)      
      const res = await ProfileFetch.getPortfolioCoinData(id,jwt,data.coinId)
      const newData = res.data.data
      setTableData(generateTableData(newData, dataToParse, usdToPhpRate))
      console.log('coin share updated!')
    } catch (error) {
      console.error('failed to update coin', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSharesChange = async (text) => {
    const inputText = text.trim();
    setShares(inputText);

    if (inputText === "") {
      setShares("0");
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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/images/back-arrow.png")}
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
                <View style={{ flex: 1, alignItems: "center", display:'flex', flexDirection:'row' , justifyContent:'flex-end' }}>
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
                    {
                      Number(initialShares) !== Number(shares) ?
                      <TouchableOpacity onPress={updateCoin}>
                        {
                          loading ?
                          <ActivityIndicator size={18} color={"black"} /> :
                          <Feather name="check-circle" size={18} color="black" />
                        }
                      </TouchableOpacity> :
                      <Feather name="edit" size={18} color="transparent" />
                    }


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
