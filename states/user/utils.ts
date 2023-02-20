import Cookies from "js-cookie"
import userStore from "./userStates"

export const setUserStates = (uid: number, email: string, token: string, isAuthenticated: boolean) => {
    userStore.setState((state) => ({...state, uid, email, token, isAuthenticated}))
}

export const setAuthorizationCookie = (token: string) => {
    Cookies.set('token', token)
}