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
    const detailsUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${coinIds}`;
    const logosUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${coinIds}`;

    const [detailsResponse, logosResponse] = await Promise.all([
        fetch(detailsUrl, { headers }),
        fetch(logosUrl, { headers })
    ]);

    const detailsData = await detailsResponse.json();
    const logosData = await logosResponse.json();

    // Compile Detailed Results including Logos
    const detailedResults = searchData.data.map(coin => {
        const detail = detailsData.data[coin.id];
        const logoInfo = logosData.data[coin.id];
        const quoteUSD = detail.quote.USD;

        return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            logo: logoInfo.logo, // Now directly using the logo URL from the info endpoint
            marketCapRank: detail.cmc_rank,
            currentPrice: quoteUSD.price,
            tradingVolume: quoteUSD.volume_24h,
            marketCap: quoteUSD.market_cap,
            circulatingSupply: detail.circulating_supply,
            totalSupply: detail.total_supply,
            maxSupply: detail.max_supply,
            // Excluding allTimeHigh and allTimeLow as they require additional data
        };
    });
    console.log("detailedResults:", detailedResults)

    return detailedResults;
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
                return null; // Return null for failed fetches to handle them later
            })
    );

    try {
        // Execute all fetch requests in parallel
        const coinDatas = await Promise.all(coinDataPromises);

        for (let i = 0; i < portfolioEntries.length; i++) {
            const entry = portfolioEntries[i];
            const coinData = coinDatas[i]; // The corresponding fetched data for this entry
            console.log("coinData:", coinData)

            // Perform your calculations here
            const athRoi = ((coinData.market_data.ath.usd ?? 0) / (coinData.market_data.atl.usd ?? 1) - 1) * 100;
            const percentIncreaseFromAtl = ((coinData.market_data.current_price.usd ?? 0) / (coinData.market_data.atl.usd ?? 1) - 1) * 100;
            const totalHoldingsUsd = coinData.market_data.current_price.usd * entry.shares;
            const trueBudgetPerCoinUsd = totalHoldingsUsd / entry.shares; // Assuming 'shares' is available in your entry
            const projectedRoiUsd = trueBudgetPerCoinUsd * 70; // Adjust multiplier as needed
            const additionalBudgetUsd = Math.max(entry.budget - trueBudgetPerCoinUsd, 0); // Assuming 'budget' is in your entry
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
                    totalHoldings: totalHoldingsUsd,
                    trueBudgetPerCoin: trueBudgetPerCoinUsd,
                    additionalBudget: additionalBudgetUsd,
                    projectedRoi: projectedRoiUsd,
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
                .match({ id: entry.id }); // Ensure matching the correct entry

            if (updateResponse.error) {
                console.error(`Error updating portfolio entry for coin ${entry.coinId}:`, updateResponse.error);
            }
        }
    } catch (error) {
        // Handle or log errors from the batch operation
        console.error('Error updating portfolio with CoinGecko data:', error);
    }
}

