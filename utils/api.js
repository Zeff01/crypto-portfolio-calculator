import { supabase } from "../services/supabase";

// utils/api.js
export const fetchCoinData = async (coinId) => {
    const url = `${process.env.COIN_GECKO_URL}/coins/${coinId}`;

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


export const fetchSearchResults = async (query) => {
    const url = `${process.env.COIN_GECKO_URL}/search?query=${query}`;


    const response = await fetch(url);
    const data = await response.json();
    return data.coins;
};


export const fetchUsdToPhpRate = async () => {

    // const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    const apiUrl = process.env.EXCHANGERATE_API_URL
    try {
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
        'X-CMC_PRO_API_KEY': process.env.CMCKEY,
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
    const performanceUrl = `https://sandbox-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest?id=${coinIds}&time_period=all_time`;

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



        const athRoi = ((athPrice / atlPrice) - 1) * 100;
        const percentIncreaseFromAtl = ((currentPrice / atlPrice) - 1) * 100;
        const priceChangeIcon = quoteUSD.percent_change_24h >= 0 ? 'arrow-up' : 'arrow-down';
        const priceChangeColor = quoteUSD.percent_change_24h >= 0 ? 'green' : 'red';

        return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            logo: logoInfo.logo,
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

// Helper function to fetch latest coin data from CMC
async function fetchLatestCoinData(coinId) {
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.CMCKEY,
        'Accept': 'application/json',
    };
    try {
        const detailsUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinId}`;
        const logosUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinId}`;
        const performanceUrl = `https://sandbox-api.coinmarketcap.com/v2/cryptocurrency/price-performance-stats/latest?id=${coinId}&time_period=all_time`;

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

// Main function to update portfolio with the latest data from CMC
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



        const athRoi = ((athPrice / atlPrice) - 1) * 100;
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




export async function updatePortfolioWithCoinGeckoData() {
    const { data: portfolioEntries, error: portfolioError } = await supabase
        .from('portfolio')
        .select('*');

    if (portfolioError) {
        console.error('Error fetching portfolio:', portfolioError);
        return;
    }



    // Prepare all fetch requests for CoinGecko data in parallel
    const coinDataPromises = portfolioEntries.map(entry =>
        fetch(`https://api.coingecko.com/api/v3/coins/${entry.coinId}`)
            .then(response => response.json())
            .catch(error => {
                console.error(`Error fetching data for coin ${entry.coinId}:`, error);
                return null;
            })
    );

    try {
        // Execute all fetch requests in parallel
        const coinDatas = await Promise.all(coinDataPromises);

        for (let i = 0; i < portfolioEntries.length; i++) {
            const entry = portfolioEntries[i];
            const coinData = coinDatas[i]; // The corresponding fetched data for this entry

            // Perform your calculations here
            const athRoi = ((coinData.market_data.ath.usd ?? 0) / (coinData.market_data.atl.usd ?? 1) - 1) * 100;
            const percentIncreaseFromAtl = ((coinData.market_data.current_price.usd ?? 0) / (coinData.market_data.atl.usd ?? 1) - 1) * 100;
            const totalHoldings = coinData.market_data.current_price.usd * entry.shares;
            const trueBudgetPerCoin = totalHoldings / entry.shares; // Assuming 'shares' is available in your entry
            const projectedRoi = trueBudgetPerCoin * 70; // Adjust multiplier as needed
            const additionalBudget = Math.max(entry.budget - trueBudgetPerCoin, 0); // Assuming 'budget' is in your entry
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

