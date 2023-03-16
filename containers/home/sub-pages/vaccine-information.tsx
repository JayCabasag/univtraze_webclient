import { getUidFromToken } from '@/utils/parser'
import { PageProps } from '@/utils/types'
import React from 'react'

export default function VaccineInformationContainer({ props }: {props: PageProps}) {
  const token = props?.token as string ?? ''
  const { uid } = getUidFromToken(token)

    return (
        <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-main dark:text-white">Vaccine information</h5>
                <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    Edit
                </button>
          </div>
          <div className="flow-root">
            Coming soon...
          </div>
        </div>
      )
    }
    