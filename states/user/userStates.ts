import { create } from 'zustand';
import { devOnlyDevtools as devtools } from '@/utils/devtools';
import { immer } from 'zustand/middleware/immer';

type UserStore = {
  uid: undefined | number;
  email: string,
  token: string,
  type: string,
  isAuthenticated: boolean,
  isLoading: boolean,
  setUid: (newUid: number) => void,
  setEmail: (email: string) => void,
  setToken: (token: string) => void,
  setType: (value: string) => void,
  setIsLoading: (value: boolean) => void,
  removeUserDetails: () => void
};

const userStore = create<UserStore>()(devtools(
    (set) => ({
      uid: undefined,
      email: '',
      token: '',
      type: '',
      isAuthenticated: false,
      isLoading: true,
      setUid: (id: number) => set({ uid: id }),
      setEmail: (email: string) => set({ email: email }),
      setToken: (token: string) => set({ token: token }),
      setType: (value: string) => set({ type: value }),
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value}),
      setIsLoading: (value: boolean) => set({ isLoading: value}),
      removeUserDetails: () => set({ uid: undefined, email: '', token: '', type: '', isAuthenticated: false, isLoading: false})
    }), {name: 'user-storage'}
  )
)

export default userStore



