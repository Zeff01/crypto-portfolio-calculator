import { supabase } from "../services/supabase";

// utils/api.js

export const fetchUsdToPhpRate = async () => {
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };

  // COINMARKET CAP USDT TO PHP
  const searchUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=usdt&convert=PHP`;

  const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD";
  // const apiUrl = process.env.EXPO_PUBLIC_EXCHANGERATE_API_URL

  try {
    // const searchResponse = await fetch(searchUrl, { headers });
    // const searchData = await searchResponse.json();
    // return searchData.data.USDT[0].quote.PHP.price

    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.rates.PHP;
    // return data.conversion_rate;
  } catch (error) {
    console.error("Failed to fetch exchange rate", error);
    return null;
  }
};

export const fetchCMCSearchResultsWithDetails = async (query) => {
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };

  // Initial Coin Search
  const searchUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${query}`;
  const searchResponse = await fetch(searchUrl, { headers });

  const searchData = await searchResponse.json();
  console.log("searchData:", searchData);
  if (!searchData.data || searchData.data.length === 0) {
    return [];
  }

  const coinIds = searchData.data.map((coin) => coin.id).join(",");

  // Fetch Detailed Information and Logos
  const detailsUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`;
  const logosUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinIds}`;
  const performanceUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest?id=${coinIds}&time_period=all_time`;

  // Fetch price performance stats
  const [detailsResponse, logosResponse, performanceResponse] =
    await Promise.all([
      fetch(detailsUrl, { headers }),
      fetch(logosUrl, { headers }),
      fetch(performanceUrl, { headers }),
    ]);

  const detailsData = await detailsResponse.json();
  const logosData = await logosResponse.json();
  const performanceData = await performanceResponse.json();
  console.log("performanceData", performanceData);

  // Compile Detailed Results including Logos
  const detailedResults = searchData.data.flatMap((coin) => {
    const coinDetail = performanceData.data[coin.id];
    if (
      !coinDetail ||
      !coinDetail.periods ||
      !coinDetail.periods.all_time ||
      !coinDetail.periods.all_time.quote
    ) {
      console.error(`Missing all_time period data for coins ${coin.id}`);
      return []; // Use flatMap with empty array to skip processing this coin
    }

    const allTimePeriodData = coinDetail.periods.all_time;
    const quoteUSD = allTimePeriodData.quote.USD;

    const detail = detailsData.data[coin.id];
    if (!detail) {
      console.error(`Detail data missing for coin ${coin.id}`);
      return [];
    }

    const logoInfo = logosData.data[coin.id];
    const currentPrice = detail.quote.USD.price;

    const athPrice = quoteUSD.high;
    const atlPrice = quoteUSD.low;
    const athRoi = currentPrice / atlPrice;
    const percentIncreaseFromAtl = (currentPrice / atlPrice - 1) * 100;
    const priceChangeIcon =
      quoteUSD.percent_change >= 0 ? "arrow-up" : "arrow-down";
    const priceChangeColor = quoteUSD.percent_change >= 0 ? "green" : "red";

    return [
      {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        logo: logoInfo.logo,
        description: logoInfo.description,
        marketCapRank: detail.cmc_rank,
        currentPrice,
        tradingVolume: detail.quote.USD.volume_24h,
        marketCap: detail.quote.USD.market_cap,
        circulatingSupply: detail.circulating_supply,
        totalSupply: detail.total_supply,
        maxSupply: detail.max_supply === "null" ? -1 : detail.max_supply,
        allTimeHigh: athPrice,
        allTimeLow: atlPrice,
        athRoi,
        percentIncreaseFromAtl,
        priceChangeIcon,
        priceChangeColor,
        priceChangePercentage: detail.quote.USD.percent_change_24h,
      },
    ];
  });

  return detailedResults;
};

async function fetchLatestCoinDataBatch(coinIds) {
  console.log("coinIds:", coinIds);

  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };
  try {
    const idsQueryParam = coinIds.join(",");
    const detailsUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${idsQueryParam}`;
    const logosUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${idsQueryParam}`;
    const performanceUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest?id=${idsQueryParam}&time_period=all_time`;

    // New: Fetch price performance stats
    const [detailsResponse, logosResponse, performanceResponse] =
      await Promise.all([
        fetch(detailsUrl, { headers }),
        fetch(logosUrl, { headers }),
        fetch(performanceUrl, { headers }),
      ]);

    const detailsData = await detailsResponse.json();
    const logosData = await logosResponse.json();
    const performanceData = await performanceResponse.json();

    return {
      detailsData: detailsData.data,
      logosData: logosData.data,
      performanceData: performanceData.data,
    };
  } catch (error) {
    console.error("Error fetching data for coin:", error);
    console.log("Error details:", { detailsData, logosData, performanceData });
    return null;
  }
}

export async function updatePortfolioWithCMC() { //
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return;
  }
  if (!userData) {
    console.log("No user found");
    return;
  }

  // Fetch budget from the subscription table
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from("subscription")
    .select("budget")
    .eq("userId", userData.user.id)
    .single();

  if (subscriptionError || !subscriptionData) {
    console.error("Error fetching subscription data:", subscriptionError);
    return;
  }

  const userBudget = subscriptionData.budget || 0;

  const { data: portfolioEntries, error: portfolioError } = await supabase
    .from("portfolio")
    .select("*")
    .eq("userId", userData.user.id);

  if (portfolioError) {
    console.error("Error fetching portfolio:", portfolioError);
    return;
  }

  try {
    const BATCH_SIZE = 10;
    for (let i = 0; i < portfolioEntries.length; i += BATCH_SIZE) {
      const batchEntries = portfolioEntries.slice(i, i + BATCH_SIZE);
      const batchIds = batchEntries.map((entry) => entry.coinId);

      const batchData = await fetchLatestCoinDataBatch(batchIds);
      if (!batchData) continue;

      await Promise.all(
        batchEntries.map(async (entry) => {
          const detail = batchData.detailsData[entry.coinId];
          const logoInfo = batchData.logosData[entry.coinId];
          const coinDetail = batchData.performanceData[entry.coinId];

          if (
            !coinDetail ||
            !coinDetail.periods ||
            !coinDetail.periods.all_time ||
            !coinDetail.periods.all_time.quote
          ) {
            console.error(
              `Missing all_time period data for coin ${entry.coinId}`
            );
            return;
          }
          if (!detail || !detail.quote || !detail.quote.USD) {
            console.error("Quote data is missing for coin:", entry.coinId);
            return; // Skip this iteration
          }

          const allTimePeriodData = coinDetail.periods.all_time;
          const quoteUSD = allTimePeriodData.quote.USD;

          const currentPrice = detail?.quote?.USD?.price ?? 0;
          const athPrice = quoteUSD.high;
          const atlPrice = quoteUSD.low;
          const athRoi = currentPrice / atlPrice;
          const percentIncreaseFromAtl = (currentPrice / atlPrice - 1) * 100;
          const priceChangeIcon =
            detail.quote.USD.percent_change_24h >= 0
              ? "arrow-up"
              : "arrow-down";
          const priceChangeColor =
            detail.quote.USD.percent_change_24h >= 0 ? "green" : "red";

          const totalHoldings = currentPrice * entry.shares;

          const trueBudgetPerCoin = totalHoldings / (currentPrice / atlPrice);
          const projectedRoi = trueBudgetPerCoin * 70;

          const mustOwnShares = userBudget / atlPrice;
          const sharesMissing = mustOwnShares - entry.shares;
          const additionalBudget = sharesMissing * currentPrice;

          const updateResponse = await supabase
            .from("portfolio")
            .update({
              coinImage: logoInfo.logo,
              coinName: detail.name,
              currentPrice: currentPrice,
              //self calculation
              athRoi: athRoi,
              increaseFromATL: percentIncreaseFromAtl,
              totalHoldings: totalHoldings,
              trueBudgetPerCoin: trueBudgetPerCoin,
              additionalBudget: additionalBudget,
              sharesMissing: sharesMissing,
              mustOwnShares: mustOwnShares,
              projectedRoi: projectedRoi,
              priceChangeIcon: priceChangeIcon,
              priceChangeColor: priceChangeColor,
              allTimeHigh: athPrice,
              allTimeLow: atlPrice,
              priceChangePercentage: detail.quote.USD.percent_change_24h,
              tradingVolume: detail.quote.USD.volume_24h,
              marketCap: detail.quote.USD.market_cap,
              maxSupply: detail.max_supply === "null" ? -1 : detail.max_supply,
              totalSupply: detail.total_supply,
              circulatingSupply: detail.circulating_supply,
            })
            .match({ id: entry.id });

          if (updateResponse.error) {
            console.error("Supabase update error:", updateResponse.error);
            console.log("Failed updateResponse:", updateResponse);
            return;
          }
        })
      );
    }
  } catch (error) {
    console.error("An error occurred during the update process:", error);
    // Log additional details as needed
  }
}

export async function fetchCMCGlobalMetrics() {
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };
  const globalMetricsUrl =
    "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest";

  try {
    const response = await fetch(globalMetricsUrl, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching CoinMarketCap data:", error.message);
    return null;
  }
}

export async function fetchTrendingTokens() {
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };

  const trendingTokenUrl =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

  try {
    const response = await fetch(trendingTokenUrl, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Extract IDs from trending tokens
    const coinIds = data.data.map((token) => token.id).join(",");

    // Fetch icons' URLs
    const logosUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinIds}`;
    const logosResponse = await fetch(logosUrl, { headers });
    if (!logosResponse.ok) {
      throw new Error(`HTTP error! status: ${logosResponse.status}`);
    }
    const logosData = await logosResponse.json();

    // Add icon URLs to each trending token
    const tokensWithIcons = data.data.map((token) => {
      const tokenInfo = logosData.data[token.id];
      const iconUrl = tokenInfo.logo; // Assuming 'logo' is the correct field for the icon URL.
      return { ...token, iconUrl };
    });

    return tokensWithIcons;
  } catch (error) {
    console.error("Error fetching Trending Token data:", error);
    return null;
  }
}

export async function fetchGainersAndLosers() {
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };

  const gainersLosersUrl =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/gainers-losers";

  try {
    const response = await fetch(gainersLosersUrl, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // The structure of the response for gainers and losers might differ from the listings endpoint.
    // Assuming it has a similar structure where data contains an array of tokens
    // You might need to adjust the path to tokens based on the actual response structure
    const coinIds = data.data.map((token) => token.id).join(",");

    // Fetch icons' URLs
    const logosUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinIds}`;
    const logosResponse = await fetch(logosUrl, { headers });
    if (!logosResponse.ok) {
      throw new Error(`HTTP error! status: ${logosResponse.status}`);
    }
    const logosData = await logosResponse.json();

    // Add icon URLs to each trending token
    const tokensWithIcons = data.data.map((token) => {
      const tokenInfo = logosData.data[token.id];
      const iconUrl = tokenInfo.logo; // Assuming 'logo' is the correct field for the icon URL.
      return { ...token, iconUrl };
    });

    return tokensWithIcons;
  } catch (error) {
    console.error("Error fetching Trending Gainers and Losers data:", error);
    return null;
  }
}
export async function fetchLatestContent() {
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };

  const latestContentUrl =
    "https://pro-api.coinmarketcap.com/v1/content/latest";

  try {
    const response = await fetch(latestContentUrl, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching Latest Content:", error.message);
    return null;
  }
}

export async function fetchCryptocurrencyCategory(categoryId) {
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };

  const categoryUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=${categoryId}`;

  try {
    const response = await fetch(categoryUrl, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching Cryptocurrency Category:", error.message);
    return null;
  }
}

export async function fetchCryptocurrencyCategories() {
  const headers = {
    "X-CMC_PRO_API_KEY": process.env.EXPO_PUBLIC_CMCKEY,
    Accept: "application/json",
  };

  const categoriesUrl =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories";

  try {
    const response = await fetch(categoriesUrl, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching Cryptocurrency Categories:", error.message);
    return null;
  }
}
