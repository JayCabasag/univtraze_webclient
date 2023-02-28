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
  setUid: (newUid: number) => void,
  setEmail: (email: string) => void,
  setToken: (token: string) => void,
  setType: (value: string) => void,
  setIsLoading: (value: boolean) => void,
  setFullname: (value: string) => void,
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
      setUid: (id: number) => set({ uid: id }),
      setEmail: (email: string) => set({ email: email }),
      setToken: (token: string) => set({ token: token }),
      setType: (value: string) => set({ type: value }),
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value}),
      setIsLoading: (value: boolean) => set({ isLoading: value}),
      setFullname: (value: string) => set({ fullname: value }),
      removeUserDetails: () => set({ uid: undefined, email: '', token: '', type: '', isAuthenticated: false, isLoading: false})
    }), {name: 'user-storage'}
  )
)

export default userStore



