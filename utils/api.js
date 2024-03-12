import { supabase } from "../services/supabase";

// utils/api.js
export const fetchCoinDataCoinGecko = async (coinId) => {
    const url = `${process.env.EXPO_PUBLIC_COIN_GECKO_URL}/coins/${coinId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data) {
            console.error('Coin data not found');
            return null;
        }

        return {
            id: data.id,
            icon: data.image.small,
            name: data.name,
            currentPrice: data.market_data.current_price.usd,
            allTimeHigh: data.market_data.ath.usd,
            allTimeLow: data.market_data.atl.usd,
            athDate: data.market_data.ath_date.usd,
            atlDate: data.market_data.atl_date.usd,
            marketCap: data.market_data.market_cap.usd,
            totalSupply: data.market_data.total_supply,
            circulatingSupply: data.market_data.circulating_supply,
            maxSupply: data.market_data.max_supply,
            tradingVolume: data.market_data.total_volume.usd,
            priceChangePercentage: data.market_data.price_change_percentage_24h,

        };
    } catch (error) {
        console.error('Failed to fetch coin data:', error);
        return null;
    }
};
export async function updatePortfolioWithCoinGeckoData() {
    const { data: portfolioEntries, error: portfolioError } = await supabase
        .from('portfolio')
        .select('*');

    if (portfolioError) {
        console.error('Error fetching portfolio:', portfolioError);
        return;
    }

    const coinDataPromises = portfolioEntries.map(entry =>
        fetch(`https://api.coingecko.com/api/v3/coins/${entry.coinId}`)
            .then(response => response.json())
            .catch(error => {
                console.error(`Error fetching data for coin ${entry.coinId}:`, error);
                return null;
            })
    );

    try {
        const coinDatas = await Promise.all(coinDataPromises);

        for (let i = 0; i < portfolioEntries.length; i++) {
            const entry = portfolioEntries[i];
            const coinData = coinDatas[i]

            // Perform your calculations here
            const athRoi = (coinData.market_data.ath.usd ?? 0) / (coinData.market_data.atl.usd ?? 1);
            const percentIncreaseFromAtl = ((coinData.market_data.current_price.usd ?? 0) / (coinData.market_data.atl.usd ?? 1) - 1) * 100;
            const totalHoldings = coinData.market_data.current_price.usd * entry.shares;
            const trueBudgetPerCoin = totalHoldings / entry.shares;
            const projectedRoi = trueBudgetPerCoin * 70;
            const additionalBudget = Math.max(entry.budget - trueBudgetPerCoin, 0);
            const priceChangeIcon = coinData.market_data.price_change_percentage_24h >= 0 ? 'arrow-up' : 'arrow-down';
            const priceChangeColor = coinData.market_data.price_change_percentage_24h >= 0 ? 'green' : 'red';

            // Update the entry in Supabase
            const updateResponse = await supabase
                .from('portfolio')
                .update({
                    coinImage: coinData.image.small,
                    coinName: coinData.name,
                    allTimeHigh: coinData.market_data.ath.usd,
                    allTimeLow: coinData.market_data.atl.usd,
                    athRoi,
                    increaseFromATL: percentIncreaseFromAtl,
                    totalHoldings: totalHoldings,
                    trueBudgetPerCoin: trueBudgetPerCoin,
                    additionalBudget: additionalBudget,
                    projectedRoi: projectedRoi,
                    marketCap: coinData.market_data.market_cap.usd,
                    totalSupply: coinData.market_data.total_supply,
                    circulatingSupply: coinData.market_data.circulating_supply,
                    maxSupply: coinData.market_data.max_supply,
                    tradingVolume: coinData.market_data.total_volume.usd,
                    marketCapRank: coinData.market_cap_rank,
                    currentPrice: coinData.market_data.current_price.usd,
                    priceChangePercentage: coinData.market_data.price_change_percentage_24h,
                    priceChangeIcon,
                    priceChangeColor
                })
                .match({ id: entry.id });

            if (updateResponse.error) {
                console.error(`Error updating portfolio entry for coin ${entry.coinId}:`, updateResponse.error);
            }
        }
    } catch (error) {

        console.error('Error updating portfolio with CoinGecko data:', error);
    }
}

export const fetchSearchResults = async (query) => {
    const url = `${process.env.EXPO_PUBLIC_COIN_GECKO_URL}/search?query=${query}`;


    const response = await fetch(url);
    const data = await response.json();
    return data.coins;
};

export const fetchUsdToPhpRate = async () => {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMCKEY,
        'Accept': 'application/json',
    };

    // COINMARKET CAP USDT TO PHP
    const searchUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=usdt&convert=PHP`
    
    
    // const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    const apiUrl = process.env.EXPO_PUBLIC_EXCHANGERATE_API_URL
    try {
    // const searchResponse = await fetch(searchUrl, { headers });
    // const searchData = await searchResponse.json();
    // return searchData.data.USDT[0].quote.PHP.price

    const response = await fetch(apiUrl);
        const data = await response.json();
        // return data.rates.PHP;
        return data.conversion_rate;
    } catch (error) {
        console.error('Failed to fetch exchange rate', error);
        return null;
    }
};

export const fetchCMCSearchResultsWithDetails = async (query) => {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMCKEY,
        'Accept': 'application/json',
    };

    // Initial Coin Search
    const searchUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${query}`;
    const searchResponse = await fetch(searchUrl, { headers });
    const searchData = await searchResponse.json();
    if (!searchData.data || searchData.data.length === 0) {
        return [];
    }

    const coinIds = searchData.data.map(coin => coin.id).join(',');

    // Fetch Detailed Information and Logos
    const detailsUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`;
    const logosUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinIds}`;
    const performanceUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest?id=${coinIds}&time_period=all_time`;

    // New: Fetch price performance stats
    const [detailsResponse, logosResponse, performanceResponse] = await Promise.all([
        fetch(detailsUrl, { headers }),
        fetch(logosUrl, { headers }),
        fetch(performanceUrl, { headers }),

    ]);

    const detailsData = await detailsResponse.json();
    const logosData = await logosResponse.json();
    const performanceData = await performanceResponse.json();

    // Compile Detailed Results including Logos
    const detailedResults = searchData.data.map(coin => {

        const detail = detailsData.data[coin.id];
        const logoInfo = logosData.data[coin.id];
        const performanceStats = performanceData.data[coin.id].quote.USD;
        const quoteUSD = detail.quote.USD;
        const athPrice = performanceStats.high;
        const atlPrice = performanceStats.low;
        const currentPrice = quoteUSD.price;



        const athRoi = (athPrice / atlPrice)
        const percentIncreaseFromAtl = ((currentPrice / atlPrice) - 1) * 100;
        const priceChangeIcon = quoteUSD.percent_change_24h >= 0 ? 'arrow-up' : 'arrow-down';
        const priceChangeColor = quoteUSD.percent_change_24h >= 0 ? 'green' : 'red';

        return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            logo: logoInfo.logo,
            description: logoInfo.description,
            marketCapRank: detail.cmc_rank,
            currentPrice: currentPrice,
            tradingVolume: quoteUSD.volume_24h,
            marketCap: quoteUSD.market_cap,
            circulatingSupply: detail.circulating_supply,
            totalSupply: detail.total_supply,
            maxSupply: detail.max_supply === 'null' ? -1 : detail.max_supply,
            allTimeHigh: athPrice,
            allTimeLow: atlPrice,
            athRoi,
            percentIncreaseFromAtl,
            priceChangeIcon,
            priceChangeColor,
            priceChangePercentage: quoteUSD.percent_change_24h,
        };
    });


    return detailedResults;
};

async function fetchLatestCoinData(coinId) {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMCKEY,
        'Accept': 'application/json',
    };
    try {
        const detailsUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinId}`;
        const logosUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinId}`;
        const performanceUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest?id=${coinId}&time_period=all_time`;

        // New: Fetch price performance stats
        const [detailsResponse, logosResponse, performanceResponse] = await Promise.all([
            fetch(detailsUrl, { headers }),
            fetch(logosUrl, { headers }),
            fetch(performanceUrl, { headers }),

        ]);


        const detailsData = await detailsResponse.json();
        const logosData = await logosResponse.json();
        const performanceData = await performanceResponse.json();

        return {
            detailsData, logosData, performanceData
        }

    } catch (error) {
        console.error('Error fetching data for coin:', error);
        return null;
    }
}

export async function updatePortfolioWithCMC() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return;

    const { data: portfolioEntries, error: portfolioError } = await supabase
        .from('portfolio')
        .select('*')
        .eq('userId', user.id);

    const { data } = await supabase.from('subscription').select('budget').eq('userId', user.id).single()

    if (portfolioError) {
        console.error('Error fetching portfolio:', portfolioError);
        return;
    }

    for (const entry of portfolioEntries) {

        const { detailsData, logosData, performanceData } = await fetchLatestCoinData(entry.coinId);
        const detail = detailsData.data[entry.coinId];
        const performanceStats = performanceData.data[entry.coinId].quote.USD;
        const quoteUSD = detail.quote.USD;
        const athPrice = performanceStats.high;
        const atlPrice = performanceStats.low;
        const currentPrice = quoteUSD.price;



        const athRoi = (athPrice / atlPrice)
        const percentIncreaseFromAtl = ((currentPrice / atlPrice) - 1) * 100;
        const priceChangeIcon = quoteUSD.percent_change_24h >= 0 ? 'arrow-up' : 'arrow-down';
        const priceChangeColor = quoteUSD.percent_change_24h >= 0 ? 'green' : 'red';

        const totalHoldings = currentPrice * entry.shares;
        const trueBudgetPerCoin = totalHoldings / (currentPrice / atlPrice);
        const projectedRoi = trueBudgetPerCoin * 70;
        const additionalBudget = data.budget - trueBudgetPerCoin

        const { error: updateError } = await supabase
            .from('portfolio')
            .update({
                totalHoldings: totalHoldings,
                currentPrice: currentPrice,
                //self caulculation
                athRoi: athRoi,
                increaseFromATL: percentIncreaseFromAtl,
                totalHoldings: totalHoldings,
                trueBudgetPerCoin: trueBudgetPerCoin,
                additionalBudget: additionalBudget,
                projectedRoi: projectedRoi,
                priceChangeIcon: priceChangeIcon,
                priceChangeColor: priceChangeColor,
                allTimeHigh: athPrice,
                allTimeLow: atlPrice,
                priceChangePercentage: quoteUSD.percent_change_24h,
                tradingVolume: quoteUSD.volume_24h,
                marketCap: quoteUSD.market_cap,
                maxSupply: detail.max_supply === 'null' ? -1 : detail.max_supply,
                totalSupply: detail.total_supply,
                circulatingSupply: detail.circulating_supply,

            })
            .match({ id: entry.id });

        if (updateError) {
            console.error(`Error updating portfolio entry for coin ${entry.coinId}:`, updateError);
        }
    }
}

export async function fetchCMCGlobalMetrics() {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMCKEY,
        'Accept': 'application/json',
    };
    const globalMetricsUrl = 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest';


    try {
        const response = await fetch(globalMetricsUrl, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching CoinMarketCap data:', error.message);
        return null;
    }
}

export async function fetchTrendingTokens() {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMCKEY,
        'Accept': 'application/json',
    };

    const trendingTokenUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

    try {
        const response = await fetch(trendingTokenUrl, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Extract IDs from trending tokens
        const coinIds = data.data.map(token => token.id).join(',');

        // Fetch icons' URLs
        const logosUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinIds}`;
        const logosResponse = await fetch(logosUrl, { headers });
        if (!logosResponse.ok) {
            throw new Error(`HTTP error! status: ${logosResponse.status}`);
        }
        const logosData = await logosResponse.json();

        // Add icon URLs to each trending token
        const tokensWithIcons = data.data.map(token => {
            const tokenInfo = logosData.data[token.id];
            const iconUrl = tokenInfo.logo; // Assuming 'logo' is the correct field for the icon URL.
            return { ...token, iconUrl };
        });
    
        return tokensWithIcons;
    } catch (error) {
        console.error('Error fetching Trending Token data:', error);
        return null;
    }
}


export async function fetchLatestContent() {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMCKEY,
        'Accept': 'application/json',
    };

    const latestContentUrl = 'https://sandbox-api.coinmarketcap.com/v1/content/latest';

    try {
        const response = await fetch(latestContentUrl, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching Latest Content:', error.message);
        return null;
    }
}

export async function fetchCryptocurrencyCategory(categoryId) {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMCKEY,
        'Accept': 'application/json',
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
        console.error('Error fetching Cryptocurrency Category:', error.message);
        return null;
    }
}

export async function fetchCryptocurrencyCategories() {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.EXPO_PUBLIC_CMCKEY,
        'Accept': 'application/json',
    };

    const categoriesUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories';

    try {
        const response = await fetch(categoriesUrl, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching Cryptocurrency Categories:', error.message);
        return null;
    }
}
