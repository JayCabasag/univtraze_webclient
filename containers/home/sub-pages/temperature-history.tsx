import React from 'react'
import moment from 'moment'

export default function TemperatureHistoryContainer() {
    return (
        <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-main dark:text-white">Temperature history</h5>
                <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    View all
                </button>
          </div>
          <div className="flow-root">
                <ul role="list" className="">
                {[1,2, 3, 4, 5, 6, 7].map((index: number) => {
                    return <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                              <svg fill="none" stroke="currentColor" className='h-6 w-6' stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                              </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                      Temperature
                                  </p>
                                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                      Room number
                                  </p>
                              </div>
                              <div className="inline-flex items-center text-sm font-thin text-gray-900 dark:text-white">
                                  {moment().format('MMM dd, yyyy')}
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
    