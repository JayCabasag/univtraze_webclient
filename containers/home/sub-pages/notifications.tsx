import LoadingSub from '@/components/loading/loading-sub';
import { genericGetRequest } from '@/services/genericGetRequest';
import userStore from '@/states/user/userStates';
import { IMAGES } from '@/utils/app_constants'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
interface NotificationType {
    createdAt: string;
    id: number;
    notification_description: string;
    notification_for: number;
    notification_is_viewed: number;
    notification_source: string;
    notification_title: string;
    notification_type: string;
    updatedAt: string;
}

export default function NotificationsContainer() {

  const { token, uid } = userStore((state) => state)
  const [notificationsList, setNotificationsList] = useState<NotificationType[]>([])
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  useEffect(() => {
    const getAllTemperatureHistory = async (uid: number | undefined, token: string) => {
    setIsLoadingNotifications(true)
    if(!uid){
      return []
    }
    await genericGetRequest({
      params: { "start-at": 1},
      path: `/notifications/user-notifications/${uid}`,
      success: (response) => {
        const isSuccess = response.success === 1
        if(isSuccess){
          const notifList = response.results as NotificationType[]
          console.log(response.data)
          setNotificationsList(notifList)
        }
        setIsLoadingNotifications(false)
      },
      error: (response) => {
          setIsLoadingNotifications(false)
          return response
      },
      token
    })
    }
    getAllTemperatureHistory(uid, token)
  }, [uid, token])

  const handleShowAllTempHistory = () => {
    setShowAllNotifications(true)
  }

  return (
    <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-main dark:text-white">Notifications</h5>
            <button onClick={handleShowAllTempHistory} className="text-sm font-medium text-main hover:underline dark:text-main">
                View all
            </button>
      </div>
      <div className="flow-root">
            <ul role="list" className="">
            {isLoadingNotifications && (
                    <LoadingSub />
                )}
            {!isLoadingNotifications &&  notificationsList.map((notificationList: NotificationType, index: number) => {
                return <li className="py-3 sm:py-4" key={index}>
                      <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                          <svg fill="none" stroke="currentColor" className='h-6 w-6' strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                          </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                  {notificationList.notification_title}
                              </p>
                              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                  {notificationList.notification_description}
                              </p>
                          </div>
                          <div className="inline-flex items-center text-sm font-thin text-gray-900 dark:text-white">
                              {moment(notificationList.createdAt).format('MMM DD, yyyy HH:mm a')}
                          </div>
                      </div>
                  </li>
              })
            }
            </ul>
      </div>
    </div>
  )
}
