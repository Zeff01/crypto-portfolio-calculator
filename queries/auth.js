import axios from "axios"
import { API_URL } from "../constants/environment";


class AuthQuery {
    constructor(){}

    async login({email,password}) {
        console.log('logging in...')
        const res = await axios.post(`${API_URL}/api/auth/login`, {email,password})
        return res
    }

    async signup({email,password,username,firstName,lastName}) {
        console.log('signing up...')
        const res = await axios.post(`${API_URL}/api/auth/signup`, {
            email,password,username,firstName,lastName
        })
        return res
    }

    async signout() {
        console.log('logging out...')
        const res = await axios.get(`${API_URL}/api/auth/signout`)
        return res
    }

    async refresh(session) {
        console.log('refreshing session...')
        const res = await  axios.post(`${API_URL}/api/auth/refresh`, {session})
        return res
    }

}

export const AuthFetch = new  AuthQuery()