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
