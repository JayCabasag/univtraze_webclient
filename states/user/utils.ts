import Cookies from "js-cookie"
import userStore from "./userStates"

export const setUserStates = (uid: number, email: string, token: string, isAuthenticated: boolean) => {
    userStore.setState((state) => ({...state, uid, email, token, isAuthenticated}))
}

export const setAuthorizationCookie = (token: string) => {
    const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Set expiration time to 7 days from now
    Cookies.set('token', token, { expires: expirationDate })
  }