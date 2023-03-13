import { genericGetRequest } from "@/services/genericGetRequest"
import { IMAGES } from "@/utils/app_constants"
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
            const profileUrl = response?.data?.profile_url as string ?? IMAGES.DEFAULT_PROFILE_PHOTO
            const birthday = response?.data?.birthday as string ?? ''
            const mobileNumber = response?.data?.mobile_number as string ?? ''
            userStore.setState((state) => ({...state, fullname, profileUrl, birthday, mobileNumber }))
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