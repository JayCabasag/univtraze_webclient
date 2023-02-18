import Cookies from "js-cookie"

export const logoutUser = () => {
    try {
        localStorage.clear()
        Cookies.remove("token")
        return {status: 'success'}
    } catch (error) {
        return {status: 'failed'}
    }
}