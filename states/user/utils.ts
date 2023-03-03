import { genericGetRequest } from "@/services/genericGetRequest"
import Cookies from "js-cookie"
import userStore from "./userStates"

export const getUserDetails = async (uid: number, type: string, token: string) => {
    if(type === '' || token === '') return
    await genericGetRequest({
        params: { id: uid },
        path: `/user/${uid}`,
        success: (response) => {
            const firstname = response?.data?.firstname as string ?? '' 
            const lastname = response?.data?.lastname as string ?? ''
            const fullname = `${firstname} ${lastname}` 
            userStore.setState((state) => ({...state, fullname }))
        },
        error: (response) => {
            console.error(response)
        },
        token
    })
}

export const setUserStates = (uid: number, email: string, token: string, isAuthenticated: boolean, type?: string) => {
    userStore.setState((state) => ({...state,type, uid, email, token, isAuthenticated, isLoading: false}))
    getUserDetails(uid, type ?? '', token ?? '')
}

export const setAuthorizationCookie = (token: string) => {
    const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Set expiration time to 7 days from now
    Cookies.set('token', token, { expires: expirationDate })
  }