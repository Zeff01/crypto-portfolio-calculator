import axios from "axios";
import { API_URL } from "../constants/environment";


class CoinQuery {
    constructor(){}

    async getExchangeRate() {
        const res = await axios.get(`${API_URL}/api/cmc/exchangerate`)
        return res
    }

    async searchWithDetails(symbol, abort) {
        const res = await axios.get(`${API_URL}/api/cmc/searchwithdetails/${symbol}`, {
            signal: abort.signal
        })
        return res
    }

    async getGlobalMetrics() {
        const res = await axios.get(`${API_URL}/api/cmc/globalmetrics`)
        return res
    }

    async getTrending() {
        const res = await axios.get(`${API_URL}/api/cmc/trending`)
        return res
    }

    async getGainersAndLosers() {
        const res = await axios.get(`${API_URL}/api/cmc/gainersandlosers`)
        return res
    }

    async getCategory(id) {
        const res = await axios.get(`${API_URL}/api/cmc/category/${id}`)
        return res
    }

    async getCategories() {
        const res = await axios.get(`${API_URL}/api/cmc/category`)
        return res
    }
    
}

export const CoinFetch = new CoinQuery()
