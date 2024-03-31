import axios from "axios";
import { API_URL } from "../constants/environment";


class ProfileQuery {
    constructor(){}

    async getBudget(id, jwt) {
        console.log('fetching budget...')
        const res = await axios.get(`${API_URL}/api/profile/budget/${id}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async getTrueBudget(id, jwt, coinId) {
        console.log('fetching true...')
        const res = await axios.get(`${API_URL}/api/profile/truebudget/${id}/${coinId}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async getPortfolioData(id, jwt,) {
        console.log('fetching portfolio data...')
        const res = await axios.get(`${API_URL}/api/profile/data/${id}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }
    //                                                the coinId becomes a string because it will be retrieved from the params
    async getPortfolioCoinData(id, jwt, coinId) {
        console.log('fetching portfolio coin data...')
        const res = await axios.get(`${API_URL}/api/profile/data/${id}/${coinId}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })        
        return res
    }

    async getUserInfo(id, jwt,) {
        console.log('fetching user info...')
        const res = await axios.get(`${API_URL}/api/profile/userinfo/${id}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async getPaymentStatus(id, jwt,) {
        console.log('fetching payment status...')
        const res = await axios.get(`${API_URL}/api/profile/paymentstatus/${id}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    // TODO: update the  type of body
    async addCoin(id, jwt, body) {        
        console.log('adding coin...')
        const res = await axios.post(`${API_URL}/api/profile/addCoin/${id}`, 
        body,
        {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async updateBudget(id, jwt, {newBudget}) {
        console.log('updating budget...')
        const res = await axios.patch(`${API_URL}/api/profile/updatebudget/${id}`, 
        {newBudget},
        {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async updatePortfolio(id, jwt) {
        console.log('updating portfolio...')
        const res = await axios.patch(`${API_URL}/api/profile/portfolio/${id}`, 
        {},
        {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async deleteCoin(id, jwt, itemId) {
        console.log('deleting coin...')
        const res = await axios.delete(`${API_URL}/api/profile/delete/${id}/${itemId}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async updateSingleCoin(id, jwt, shares, data) {
        console.log('updating single coin...')
        const res = await axios.put(`${API_URL}/api/profile/portfolio/${id}`, 
        {
            shares,
            data
        },
        {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }




}

export const ProfileFetch = new ProfileQuery()
