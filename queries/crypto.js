import axios from "axios";
import { API_URL } from "../constants/environment";


class CoinQuery {
    constructor(){}

    async getExchangeRate() {
        console.log('fetching exchange rate...')
        const res = await axios.get(`${API_URL}/api/cmc/exchangerate`)
        return res
    }

    async searchWithDetails(symbol, abort) {
        console.log('searching coin...')    
        const res = await axios.get(`${API_URL}/api/cmc/searchwithdetails/${symbol}`, {
            signal: abort.signal
        })
        return res
    }

    async getGlobalMetrics() {
        console.log('fetching global metrics...')    
        const res = await axios.get(`${API_URL}/api/cmc/globalmetrics`)
        return res
    }

    async getTrending() {
        console.log('fetching trending coins...')    
        const res = await axios.get(`${API_URL}/api/cmc/trending`)
        return res
    }

    async getGainersAndLosers() {
        console.log('fetching gainers and losers coins...')    
        const res = await axios.get(`${API_URL}/api/cmc/gainersandlosers`)
        return res
    }


    async getCategory(id) {
        console.log('fetching single category...')    
        const res = await axios.get(`${API_URL}/api/cmc/category/${id}`)
        return res
    }

    async getCategories() {
        console.log('fetching categories...')    
        const res = await axios.get(`${API_URL}/api/cmc/category`)
        return res
    }
    
}

export const CoinFetch = new CoinQuery()
