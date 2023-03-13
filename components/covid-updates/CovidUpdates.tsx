import { getAllCountryCovidUpdate } from '@/api/covidUpdates/getAllCountryCovidUpdate';
import { getAllDayCountryCovidUpdate } from '@/api/covidUpdates/getAllDayCountryCovidUpdate';
import { formattedCovidCasesList } from '@/utils/app_constants';
import { CovidCaseType } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';
import React, { ReactNode, useEffect, useState } from 'react';
import CovidChart from '../covid-chart/CovidChart';

export default function CovidUpdates() {
  const { isLoading: isLoadingCovidUpdate , isError: isErrorCovidUpdate, data: covidUpdateData } = useQuery({
    queryKey: ['country/covid-update'],
    queryFn: () => getAllCountryCovidUpdate('PH'),
  })

  const updatedAt = covidUpdateData?.updated as number ?? 0
  const activeCases = covidUpdateData?.active as number ?? 0
  const country = covidUpdateData?.country as string ?? ''
  const totalDeaths = covidUpdateData?.deaths as number ?? 0
  const totalRecovered =covidUpdateData?.recovered as number ?? 0

  const { isLoading: isLoadingAllDayCovidUpdate , isError: isErrorAllDayCovidUpdate, data: covidAllDayUpdateData } = useQuery({
    queryKey: ['country/all-day-covid-update'],
    queryFn: () => getAllDayCountryCovidUpdate('Philippines')
  })

  const allCases = covidAllDayUpdateData?.timeline?.cases as any ?? {}
  const allRecoveredCases = covidAllDayUpdateData?.timeline?.recovered as any ?? {}
  const allDeathsCases = covidAllDayUpdateData?.timeline?.deaths as any ?? {}
  const allCasesList = formattedCovidCasesList(allCases)
  const allRecoveredList = formattedCovidCasesList(allRecoveredCases)
  const allDeathsList = formattedCovidCasesList(allDeathsCases)

  console.log(covidAllDayUpdateData, covidAllDayUpdateData)
  
  return (
    <div className="w-full md:max-w-2xl p-2 md:p-4 bg-white rounded-lg flex flex-col gap-2 md:gap-4">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-main dark:text-white">Covid updates ({country})</h5>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-xs text-gray-500'>Last updated at: { moment(new Date(updatedAt)).toLocaleString() }</p>
      </div>
      <CovidChart allCasesList={allCasesList} allRecoveredList={allRecoveredList} allDeathCaseList={allDeathsList}/>
      <article className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow">
        <div>
          <strong className="block text-sm font-medium text-gray-500"> Active cases </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900"> {activeCases.toLocaleString()} </span>
          </p>
        </div>
      </article>

      <article className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow">
        <div>
          <strong className="block text-sm font-medium text-gray-500"> Total Deaths </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900"> {totalDeaths.toLocaleString()} </span>
          </p>
        </div>
      </article>

      <article className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow">
        <div>
          <strong className="block text-sm font-medium text-gray-500"> Total Recovered </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900"> {totalRecovered.toLocaleString()} </span>
          </p>
        </div>
      </article>
    </div>
  );
}

