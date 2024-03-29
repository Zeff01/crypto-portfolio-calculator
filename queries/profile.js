import axios from "axios";
import { API_URL } from "../constants/environment";


class ProfileQuery {
    constructor(){}

    async getBudget(id, jwt) {
        const res = await axios.get(`${API_URL}/api/profile/budget/${id}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async getTrueBudget(id, jwt, coinId) {
        const res = await axios.get(`${API_URL}/api/profile/truebudget/${id}/${coinId}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async getPortfolioData(id, jwt,) {
        const res = await axios.get(`${API_URL}/api/profile/data/${id}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }
    //                                                the coinId becomes a string because it will be retrieved from the params
    async getPortfolioCoinData(id, jwt, coinId) {
        const res = await axios.get(`${API_URL}/api/profile/data/${id}/${coinId}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })        
        return res
    }

    async getUserInfo(id, jwt,) {
        const res = await axios.get(`${API_URL}/api/profile/userinfo/${id}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async getPaymentStatus(id, jwt,) {
        const res = await axios.get(`${API_URL}/api/profile/paymentstatus/${id}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    // TODO: update the  type of body
    async addCoin(id, jwt, body) {
        const res = await axios.post(`${API_URL}/api/profile/addCoin/${id}`, 
        body,
        {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async updateBudget(id, jwt, {newBudget}) {
        const res = await axios.patch(`${API_URL}/api/profile/updatebudget/${id}`, 
        {newBudget},
        {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async updatePortfolio(id, jwt) {
        const res = await axios.patch(`${API_URL}/api/profile/portfolio/${id}`, 
        {},
        {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async deleteCoin(id, jwt, itemId) {
        const res = await axios.delete(`${API_URL}/api/profile/delete/${id}/${itemId}`, {
            headers: {Authorization: `Bearer ${jwt}`}
        })
        return res
    }

    async updateSingleCoin(id, jwt, shares, data) {
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
