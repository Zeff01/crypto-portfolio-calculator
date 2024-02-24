// utils/api.js
export const fetchCoinData = async (coinId) => {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;

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
    const url = `https://api.coingecko.com/api/v3/search?query=${query}`;
    const response = await fetch(url);
    console.log("response:", response.data)
    const data = await response.json();
    return data.coins; // Assuming the API returns a list of coins
};


// utils/api.js
export const fetchUsdToPhpRate = async () => {
    // Example API endpoint, replace with your actual API
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.rates.PHP; // Assuming the API returns a rates object with PHP
    } catch (error) {
        console.error('Failed to fetch exchange rate', error);
        return null; // Handle error appropriately
    }
};
