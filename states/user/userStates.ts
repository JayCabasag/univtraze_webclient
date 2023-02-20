import { create } from 'zustand';
import { devOnlyDevtools as devtools } from '@/utils/devtools';
import { immer } from 'zustand/middleware/immer';

type UserStore = {
  uid: undefined | number;
  email: string,
  token: string,
  isAuthenticated: boolean,
  setUid: (newUid: number) => void,
  setEmail: (email: string) => void,
  setToken: (token: string) => void,
  removeUserDetails: () => void
};

const userStore = create<UserStore>()(devtools(
    (set) => ({
      uid: undefined,
      email: '',
      token: '',
      isAuthenticated: false,
      setUid: (id: number) => set({ uid: id }),
      setEmail: (email: string) => set({ email: email }),
      setToken: (token: string) => set({ token: token}),
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value}),
      removeUserDetails: () => set({ uid: undefined, email: '', token: '', isAuthenticated: false})
    }), {name: 'user-storage'}
  )
)

export default userStore



