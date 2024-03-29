import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { genericGetRequest } from '@/services/genericGetRequest'
import userStore from '@/states/user/userStates'
import { MAX_INITIAL_LOAD } from '@/utils/app_constants'
import LoadingSub from '@/components/loading/loading-sub'
import { useQuery } from '@tanstack/react-query'
import { getAllTemperatureHistory } from '@/api/user/getAllTemperatureHistory'
import { PageProps } from '@/utils/types'
import { getUidFromToken } from '@/utils/parser'

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
}


export default function TemperatureHistoryContainer({ props }: {props: PageProps}) {
    const token = props?.token as string ?? ''
    const { uid } = getUidFromToken(token)  

    const [showAllTempHistory, setShowAllTempHistory] = useState(false)
    const [isLoadingTemperatureHistory, setIsLoadingTemperatureHistory] = useState(false)

    const { data, isLoading, isError } = useQuery({ queryKey: ['user/all-temperature-history'], queryFn: () => getAllTemperatureHistory(uid, token)})
    const temperatureHistoryList = data?.data as TemperatureHistoryType[] ?? []
    const hasTemperatureHistory = temperatureHistoryList.length > 0

    const handleShowAllTempHistory = () => {
        setShowAllTempHistory(true)
    }

    return (
        <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-main dark:text-white">Temperature history</h5>
                <button className="text-sm font-medium text-main hover:underline dark:text-main" onClick={handleShowAllTempHistory}>
                    View all
                </button>
          </div>
          <div className="flow-root">
                <ul role="list" className="">
                {isLoadingTemperatureHistory && (
                    <LoadingSub />
                )}
                {!isLoadingTemperatureHistory &&  !hasTemperatureHistory && (
                    <div className='w-full'>
                        <p className='font-medium text-center text-main'>No temperature history...</p>
                    </div>
                )}
                {!isLoadingTemperatureHistory && temperatureHistoryList?.map((temperatureHistory:  TemperatureHistoryType, index: number) => {
                    if(!showAllTempHistory && index > MAX_INITIAL_LOAD){
                        return <></>
                    } 
                    return <li className="py-3 sm:py-4" key={index}>
                          <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                              <svg fill="none" stroke="currentColor" className='h-6 w-6' strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                              </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                     Temp. : { temperatureHistory.temperature ?? 'Not set'}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                  {temperatureHistory.building_name} - Room # :  {temperatureHistory.room_number}
                                  </p>
                              </div>
                              <div className="inline-flex items-center text-sm font-thin text-gray-900 dark:text-white">
                                  {moment(temperatureHistory.createdAt).format('MMM DD, yyyy HH:mm a')}
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