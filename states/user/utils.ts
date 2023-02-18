import userStore from "./userStates"

export const setUserStates = (uid: number, email: string, token: string) => {
    userStore.setState((state) => ({...state, uid, email, token}))
}