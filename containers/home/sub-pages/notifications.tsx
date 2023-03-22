import { getAllNotifications } from '@/api/user/getAllNotifications';
import { updateUserNotificationStatus } from '@/api/user/updateNotificationStatus';
import LoadingSub from '@/components/loading/loading-sub';
import { genericGetRequest } from '@/services/genericGetRequest';
import notificationsStore from '@/states/notifications/notificationStates';
import userStore from '@/states/user/userStates';
import { IMAGES } from '@/utils/app_constants'
import { getUidFromToken } from '@/utils/parser';
import { NotificationType, PageProps } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment'
import React, { useEffect, useState } from 'react'
interface Params {
  [key: string]: any;
}

export default function NotificationsContainer({ props } : { props : PageProps}) {
  const token = props?.token as string ?? ''
  const { uid } = getUidFromToken(token)
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const params: Params = { "start-at": 1}
  const { notifications: notificationsList, setTotalUnviewedNotifications } = notificationsStore(state => state)
  const hasNotifications = notificationsList?.length > 0

  useQuery({ 
    queryKey: ['user/update-notifications-status'], 
    queryFn: () => updateUserNotificationStatus(uid, token ),
    onSuccess: (response) => {
      setTotalUnviewedNotifications(0)
    }
  })
  
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
            {!isLoadingNotifications &&  !hasNotifications && (
                    <div className='w-full'>
                        <p className='font-medium text-center text-main'>No Notifications...</p>
                    </div>
            )}
            {!isLoadingNotifications && hasNotifications &&  notificationsList.map((notificationList: NotificationType, index: number) => {
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
