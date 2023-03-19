import { create } from 'zustand';
import { devOnlyDevtools as devtools } from '@/utils/devtools';
import { NotificationType } from '@/utils/types';
import { getAllNotifications } from '@/api/user/getAllNotifications';

type NotificationsStore = {
  notifications: NotificationType[],
  totalUnviewedNotifications: number,
  setNotifications: (notificationsList: NotificationType[]) => void,
  setTotalUnviewedNotifications: (value: number) => void
}

const notificationsStore = create<NotificationsStore>()(devtools(
  (set) => ({
    notifications: [],
    totalUnviewedNotifications: 0,
    setNotifications: (notificationsList: NotificationType[]) => set({ notifications: notificationsList}),
    setTotalUnviewedNotifications: (value: number) => set({ totalUnviewedNotifications: value })
  }
  ), {name: 'notifications-storage'}
))

export default notificationsStore;

