import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { genericGetRequest } from '@/services/genericGetRequest'
import userStore from '@/states/user/userStates'
import { MAX_INITIAL_LOAD } from '@/utils/app_constants'
import LoadingSub from '@/components/loading/loading-sub'

interface TemperatureHistoryType {
    building_name: string;
    createdAt: string;
    id: number;
    room_id: number;
    room_name: string;
    room_number: string;
    temperature: null | number;
    updatedAt: string;
    user_id: number;
  };
export default function TemperatureHistoryContainer() {
    const { token, uid } = userStore((state) => state)
    const [temperatureHistoryList, setTemperatureHistoryList] = useState<TemperatureHistoryType[]>([])
    const [showAllTempHistory, setShowAllTempHistory] = useState(false)
    const [isLoadingTemperatureHistory, setIsLoadingTemperatureHistory] = useState(false)

    useEffect(() => {
        const getAllTemperatureHistory = async (uid: number | undefined, token: string) => {
            setIsLoadingTemperatureHistory(true)
            if(!uid){
                return []
            }
            await genericGetRequest({
                params: {},
                path: `/rooms/temperature-history/${uid}`,
                success: (response) => {
                    const isSuccess = response.success === 1
                    if(isSuccess){
                        const tempHistoryList = response.data as TemperatureHistoryType[]
                        setTemperatureHistoryList(tempHistoryList)
                    }
                    setIsLoadingTemperatureHistory(false)
                },
                error: (response) => {
                    setIsLoadingTemperatureHistory(false)
                    return response
                },
                token
            })
        }
        getAllTemperatureHistory(uid, token)
    }, [uid, token])

    const handleShowAllTempHistory = () => {
        setShowAllTempHistory(true)
    }
    return (
        <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-main dark:text-white">Temperature history</h5>
                <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500" onClick={handleShowAllTempHistory}>
                    View all
                </button>
          </div>
          <div className="flow-root">
                <ul role="list" className="">
                {isLoadingTemperatureHistory && (
                    <LoadingSub />
                )}
                {!isLoadingTemperatureHistory && temperatureHistoryList.map((temperatureHistory:  TemperatureHistoryType, index: number) => {
                    if(!showAllTempHistory && index > MAX_INITIAL_LOAD){
                        return <></>
                    } 
                    return <li className="py-3 sm:py-4" key={index}>
                          <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                              <svg fill="none" stroke="currentColor" className='h-6 w-6' strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                              </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                     {temperatureHistory.building_name}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                      Room # :  {temperatureHistory.room_number} - Temp. : { temperatureHistory.temperature ?? 'Not set'}
                                  </p>
                              </div>
                              <div className="inline-flex items-center text-sm font-thin text-gray-900 dark:text-white">
                                  {moment(temperatureHistory.createdAt).format('MMM dd, yyyy')}
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