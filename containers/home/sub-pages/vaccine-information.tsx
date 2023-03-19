import { getVaccineData } from '@/api/user/getVaccineData'
import { addVaccineInformation } from '@/api/user/postVaccineInformation'
import { updateVaccineInformation } from '@/api/user/updateVaccineInformation'
import { queryClient } from '@/pages/_app'
import { CovidVaccines } from '@/utils/enums'
import { getUidFromToken } from '@/utils/parser'
import { PageProps } from '@/utils/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

type UserVaccinationData = {
  id: number;
  user_id: number;
  firstdose_vaxname: string;
  firstdose_date: string; // ISO 8601 date format
  seconddose_vaxname: string;
  seconddose_date: string; // ISO 8601 date format
  booster_vaxname: string;
  booster_date: string; // ISO 8601 date format
  createdAt: string; // ISO 8601 date format
  updatedAt: string; // ISO 8601 date format
};

export default function VaccineInformationContainer({ props }: {props: PageProps}) {
  const token = props?.token as string ?? ''
  const { uid } = getUidFromToken(token)

  const query = useQuery({ queryKey: ['user/vaccine-info'], queryFn: () => getVaccineData(uid, token) })
  const hasNoVaccineRecord = query?.data?.message as string === 'No Vaccine record found'
  const isSuccessGettingVaccineRecord = query?.data?.success === 1 && !hasNoVaccineRecord
  const vaccineUserData = query?.data?.results as UserVaccinationData

  const firstDoseValue = isSuccessGettingVaccineRecord ? vaccineUserData?.firstdose_vaxname as string : 'None'
  const secondDoseValue = isSuccessGettingVaccineRecord ? vaccineUserData?.seconddose_vaxname as string : 'None'
  const boosterDoseValue = isSuccessGettingVaccineRecord ? vaccineUserData?.booster_vaxname as string : 'None'

  const [firstDoseVaxName, setFirstDoseVaxName] = useState('None')
  const [firstDoseDate, setFirstDoseDate] = useState('')
  const [secondDoseVaxName, setSecondDoseVaxName] = useState('None')
  const [secondDoseDate, setSecondDoseDate] = useState('')
  const [boosterDoseVaxName, setBoosterDoseVaxName] = useState('None')
  const [boosterDoseDate, setBoosterDoseDate] = useState('')  

  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  
  const setError = (status: boolean, messsage: string) =>{
    setHasError(status)
    setErrorMessage(messsage)
  }

  const resetStatus = () => {
    setSuccess(false)
    setError(false, '')
  }


  const [isEditable, setIsEditable] = useState(false)

  const handleToggleEditable = () => {
    setIsEditable(prevState => !prevState)
  }

  const updateVaccineMutation = useMutation({
    mutationFn: () => updateVaccineInformation(
      uid,
      token,
      firstDoseVaxName,
      firstDoseDate,
      secondDoseVaxName,
      secondDoseDate,
      boosterDoseVaxName,
      boosterDoseDate
    ),
    onSuccess: (response) => {
      resetStatus()
      setSuccess(true)

      queryClient.invalidateQueries(({ queryKey: ['user/nav-all-notifications', 'user/vaccine-info'] }))
    },
    onError: (response) => {
      console.log(response)
    }
  })

  const addVaccineMutation = useMutation({
    mutationFn: () => addVaccineInformation(
      uid,
      token,
      firstDoseVaxName,
      firstDoseDate,
      secondDoseVaxName,
      secondDoseDate,
      boosterDoseVaxName,
      boosterDoseDate
    ),
    onSuccess: (response) => {
      resetStatus()
      setSuccess(true)

      queryClient.invalidateQueries(({ queryKey: ['user/nav-all-notifications', 'user/vaccine-info'] }))
    },
    onError: (response) => {
      console.log(response)
    }
  })

  const handleSubmitVaccineInformation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetStatus()
    const form = event?.currentTarget

    const firstDoseNameElement = form?.elements?.namedItem('first-dose-vaxname') as HTMLInputElement
    const firstDoseDateElement = form?.elements?.namedItem('first-dose-date') as HTMLInputElement
    const secondDoseNameElement = form?.elements?.namedItem('second-dose-vaxname') as HTMLInputElement
    const secondDoseDateElement = form?.elements?.namedItem('second-dose-date') as HTMLInputElement
    const boosterDoseNameElement = form?.elements?.namedItem('booster-dose-vaxname') as HTMLInputElement
    const boosterDoseDateElement = form?.elements?.namedItem('booster-dose-date') as HTMLInputElement

    const firstDoseNameValue = firstDoseNameElement?.value as string
    const firstDoseDateValue = firstDoseDateElement?.value as string
    const secondDoseNameValue = secondDoseNameElement?.value as string
    const secondDoseDateValue = secondDoseDateElement?.value as string
    const boosterDoseNameValue = boosterDoseNameElement?.value as string
    const boosterDoseDateValue = boosterDoseDateElement?.value as string

    setFirstDoseVaxName(firstDoseNameValue)
    setFirstDoseDate(firstDoseDateValue)
    setSecondDoseVaxName(secondDoseNameValue)
    setSecondDoseDate(secondDoseDateValue)
    setBoosterDoseVaxName(boosterDoseNameValue)
    setBoosterDoseDate(boosterDoseDateValue)

    hasNoVaccineRecord ? addVaccineMutation.mutate() : updateVaccineMutation.mutate()
    hasNoVaccineRecord ? 'Add vacine mutation' : 'Update vaccine mutation'
  }

  return (
        <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-main dark:text-white">Vaccine information</h5>
                <button
                  className="text-sm font-medium text-main hover:underline dark:text-blue-500"
                  onClick={handleToggleEditable}
                >
                    { isEditable ? 'Close edit' : 'Edit'}
                </button>
          </div>
          <div className="flow-root">
            <form onSubmit={handleSubmitVaccineInformation}>
              <div>
              <label className="block text-xs font-medium text-gray-700">Vaccine name (First dose)</label>
                {firstDoseValue !== CovidVaccines.NONE  && !isEditable ? (
                  <input
                    type="selected-first-dose"
                    id="selected-first-dose"
                    name="selected-first-dose"
                    className="md:w-1/2 mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                    disabled
                    defaultValue={firstDoseValue}
                  />
                ) : (
                  <select
                    id="first-dose-vaxname"
                    name="first-dose-vaxname"
                    className="mt-1 md:w-1/2 relative w-full rounded focus:z-10 sm:text-sm border-gray-300 outline-none focus:ring-main focus:border-main"
                    disabled={!isEditable}
                    defaultValue={firstDoseValue}
                  > 
                    {Object.values(CovidVaccines).map((covidVaccineName: string, index: number) => {
                      return <option className='truncate' value={covidVaccineName} key={index}>{covidVaccineName}</option>
                    })}
                  </select>
                )}
            </div>
            <div>
              <label htmlFor="first-dose-date" className="block text-xs font-medium text-gray-700">
                First dose date  (First dose)
              </label>
               <input
                type="date"
                id="first-dose-date"
                name="first-dose-date"
                className="mt-1 max-w-max rounded-md border-gray-200 shadow-sm sm:text-sm"
                disabled={!isEditable}
                defaultValue={isSuccessGettingVaccineRecord ? moment(vaccineUserData?.firstdose_date as string ?? moment()).format('yyyy-MM-DD') : moment().format('yyyy-MM-DD')}
              />
            </div>
            <div>
              <label htmlFor='second-dose-vaccine' className="block text-xs font-medium text-gray-700">Vaccine name (Second dose)</label>
              {secondDoseValue !== CovidVaccines.NONE  && !isEditable ? (
                  <input
                    type="selected-first-dose"
                    id="selected-first-dose"
                    name="selected-first-dose"
                    className="md:w-1/2 mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                    disabled
                    defaultValue={secondDoseValue}
                  />
                ) : (
                <select
                  id="second-dose-vaxname"
                  name="second-dose-vaxname"
                  className="mt-1 md:w-1/2 relative w-full rounded focus:z-10 sm:text-sm border-gray-300 outline-none focus:ring-main focus:border-main"
                  disabled={!isEditable}
                  defaultValue={secondDoseValue}
                > 
                  {Object.values(CovidVaccines).map((covidVaccineName: string, index: number) => {
                    return <option className='truncate' value={covidVaccineName} key={index}>{covidVaccineName}</option>
                  })}
                </select>
                )}
            </div>
            <div>
              <label htmlFor="second-dose-date" className="block text-xs font-medium text-gray-700">
                Second dose date (Second dose)
              </label>
              <input
                type="date"
                id="second-dose-date"
                name="second-dose-date"
                className="mt-1 max-w-max rounded-md border-gray-200 shadow-sm sm:text-sm"
                disabled={!isEditable}
                defaultValue={isSuccessGettingVaccineRecord ? moment(vaccineUserData?.seconddose_date as string ?? moment()).format('yyyy-MM-DD') : moment().format('yyyy-MM-DD')}
              />
            </div>
            <div>
              <label  className="block text-xs font-medium text-gray-700">Vaccine name (Booster dose)</label>
                {boosterDoseValue !== CovidVaccines.NONE  && !isEditable ? (
                  <input
                    type="selected-first-dose"
                    id="selected-first-dose"
                    name="selected-first-dose"
                    className="md:w-1/2 mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                    disabled
                    defaultValue={boosterDoseValue}
                  />
                ) : (
                <select
                  id="booster-dose-vaxname"
                  name="booster-dose-vaxname"
                  className="mt-1 md:w-1/2 relative w-full rounded focus:z-10 sm:text-sm border-gray-300 outline-none focus:ring-main focus:border-main"
                  disabled={!isEditable}
                  defaultValue={boosterDoseValue}
                > 
                  {Object.values(CovidVaccines).map((covidVaccineName: string, index: number) => {
                    return <option className='truncate' value={covidVaccineName} key={index}>{covidVaccineName}</option>
                  })}
                </select>
                )}
            </div>
            <div>
              <label htmlFor="booster-dose-date" className="block text-xs font-medium text-gray-700">
                Booster dose date (Booster dose)
              </label>
              <input
                type="date"
                id="booster-dose-date"
                name="booster-dose-date"
                className="mt-1 max-w-max rounded-md border-gray-200 shadow-sm sm:text-sm"
                disabled={!isEditable}
                defaultValue={isSuccessGettingVaccineRecord ? moment(vaccineUserData?.booster_date as string ?? moment()).format('yyyy-MM-DD') : moment().format('yyyy-MM-DD')}
              />
            </div>
            <div className='mt-2'>
              {updateVaccineMutation.isLoading  || addVaccineMutation.isLoading && (
                <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                  <span className="font-medium">Please wait...</span> Finalizing your update...
                </div>
              )}
              {hasError && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  <span className="font-medium">Error Occured!</span> {errorMessage}
                </div>
              )}
              {success && (
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                  <span className="font-medium">Success!</span> Updated vaccine information
                </div>
              )}
            </div>
            <div className="mt-4">
            <button
              type="submit"
              disabled={!isEditable}
              className="text-white bg-main hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-main dark:hover:bg-main dark:focus:ring-main"
            >
              Update now
            </button>
            </div>
            </form>
          </div>
        </div>
      )
    }
    