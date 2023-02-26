import { formattedCovidCasesList } from '@/utils/app_constants';
import { CovidCaseType } from '@/utils/types';
import axios from 'axios';
import moment from 'moment';
import React, { ReactNode, useEffect, useState } from 'react';
import CovidChart from '../covid-chart/CovidChart';

export default function CovidUpdates() {
  const [updatedAt, setUpdatedAt] = useState<number>(0)
  const [activeCases, setActiveCases] = useState(0)
  const [country, setCountry] = useState('Philippines')
  const [totalDeaths, setTotalDeaths] = useState(0)
  const [totalRecovered, setTotalRecovered] = useState(0)
  const [allCovidCases, setAllCovidCases] = useState<any>([])
  const [allRecoveredCase, setAllRecoveredCase] = useState<any>([])
  const [allDeathCase, setAllDeathCase] = useState<any>([])

  useEffect(() => {
    const handleGetCovidData = async () => {
        const res = await axios.get('https://disease.sh/v3/covid-19/countries/PH?strict=true')
        const updatedDateTime = res?.data?.updated as number ?? 0
        const activeCases = res?.data?.active as number ?? 0
        const country = res?.data?.country as string ?? ''
        const deaths = res?.data?.deaths as number ?? 0
        const totalRecovered = res?.data?.recovered as number ?? 0
        setUpdatedAt(updatedDateTime)
        setActiveCases(activeCases)
        setCountry(country)
        setTotalDeaths(deaths)
        setTotalRecovered(totalRecovered)
    } 
    handleGetCovidData()
    const handleGetAllDayCovidResponse = async () => {
      const res = await axios.get("https://disease.sh/v3/covid-19/historical/Philippines?lastdays=all")
      const allCases = res?.data?.timeline?.cases as any ?? {}
      const allRecoveredCases = res?.data?.timeline?.recovered as any ?? {}
      const allDeathsCases = res?.data?.timeline?.deaths as any ?? {}
      const allCasesList = formattedCovidCasesList(allCases)
      const allRecoveredList = formattedCovidCasesList(allRecoveredCases)
      const allDeathsList = formattedCovidCasesList(allDeathsCases)

      setAllRecoveredCase(allRecoveredList)
      setAllDeathCase(allDeathsList)
      setAllCovidCases(allCasesList)
    }
    handleGetAllDayCovidResponse()
  }, [updatedAt, activeCases, country, totalDeaths, totalRecovered])
  
  return (
    <div className="w-full md:max-w-2xl p-4 bg-white rounded-lg flex flex-col gap-2 md:gap-4">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-main dark:text-white">Covid updates ({country})</h5>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-xs text-gray-500'>Last updated at: { moment(new Date(updatedAt)).toLocaleString() }</p>
      </div>
      <CovidChart allCasesList={allCovidCases} allRecoveredList={allRecoveredCase} allDeathCaseList={allDeathCase}/>
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

