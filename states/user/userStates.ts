import { create } from 'zustand';
import { devOnlyDevtools as devtools } from '@/utils/devtools';

type UserStore = {
  uid: undefined | number;
  email: string,
  token: string,
  type: string,
  isAuthenticated: boolean,
  isLoading: boolean,
  fullname: string,
  profileUrl: string,
  birthday: string,
  mobileNumber: string,
  setUid: (newUid: number) => void,
  setEmail: (email: string) => void,
  setToken: (token: string) => void,
  setType: (value: string) => void,
  setIsLoading: (value: boolean) => void,
  setFullname: (value: string) => void,
  setProfileUrl: (value: string) => void,
  setBirthday: (value: string) => void,
  setMobileNumber: (value: string) =>void,
  removeUserDetails: () => void,
};

const userStore = create<UserStore>()(devtools(
    (set) => ({
      uid: undefined,
      email: '',
      token: '',
      type: '',
      isAuthenticated: false,
      isLoading: false,
      fullname: '',
      profileUrl: '',
      birthday: '',
      mobileNumber: '',
      setUid: (id: number) => set({ uid: id }),
      setEmail: (email: string) => set({ email: email }),
      setToken: (token: string) => set({ token: token }),
      setType: (value: string) => set({ type: value }),
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value}),
      setIsLoading: (value: boolean) => set({ isLoading: value}),
      setFullname: (value: string) => set({ fullname: value }),
      setProfileUrl: (value: string) => set({ profileUrl: value }),
      setBirthday: (value: string) => set({ birthday: value }),
      setMobileNumber: (value: string) => set({ mobileNumber: value }),
      removeUserDetails: () => set({ 
        uid: undefined,
        email: '',
        token: '',
        type: '',
        fullname: '',
        isAuthenticated: false,
        isLoading: false,
        profileUrl: '',
        birthday: '',
        mobileNumber: ''
      })
    }), {name: 'user-storage'}
  )
)

export default userStore



