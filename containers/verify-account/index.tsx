import React, { useState } from 'react'
import userStore from '@/states/user/userStates'
import { Countries, Genders, Ids } from '@/utils/lists'
import { useRouter } from 'next/router'
import { UserTypes } from '@/utils/app_constants'

export default function VerifyAccountContainer() {
  const { email } = userStore(state => state)
  const [selectedUserType, setSelectedUserType] = useState('')
  const [visitorSelectedValidId, setVisitorSelectedValidId] = useState('')

  const handleUpdateUserType = (userTypeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const typeText = userTypeEvent?.target?.id as string
    setSelectedUserType(typeText)
  }
  const handleUpdateSelectedVisitorValidId = (validIdSelectEvent: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValidIdValue = validIdSelectEvent?.currentTarget?.value
    setVisitorSelectedValidId(selectedValidIdValue)
  }

  return (
    <section>
    <h1 className="sr-only">User details</h1>
    <div className="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-2">
        <div className="bg-gray-50 py-12 md:py-24">
        <div className="mx-auto max-w-lg space-y-8 px-4 lg:px-8">
            <div className="flex items-center gap-4">
            <span className="h-10 w-10 rounded-full bg-blue-700">
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
            </svg>
            </span>

            <h2 className="font-medium text-gray-900 capitalize">{selectedUserType}</h2>
            </div>

            <div>
            <p className="text-2xl font-medium tracking-tight text-gray-900">
                Please select user type :
            </p>
            <p className="mt-1 text-sm text-gray-600 mb-1">Select</p>
            <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                <div>
                    <input
                      className="peer sr-only"
                      id="student"
                      type="radio"
                      tabIndex={-1}
                      name="userType"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateUserType(event)}
                    />

                    <label
                        htmlFor="student"
                        className="cursor-pointer block w-full rounded-lg border border-gray-200 p-2 hover:border-black peer-checked:border-black peer-checked:bg-black peer-checked:text-white"
                        tabIndex={0}
                    >
                        <span className="text-sm font-medium"> Student </span>
                    </label>
                    </div>

                    <div>
                    <input
                        className="peer sr-only"
                        id="employee"
                        type="radio"
                        tabIndex={-1}
                        name="userType"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateUserType(event)}
                    />

                    <label
                        htmlFor="employee"
                        className="cursor-pointer block w-full rounded-lg border border-gray-200 p-2 hover:border-black peer-checked:border-black peer-checked:bg-black peer-checked:text-white"
                        tabIndex={0}
                    >
                        <span className="text-sm font-medium"> Employee </span>
                    </label>
                </div>

                <div>
                <input
                    className="peer sr-only"
                    id="visitor"
                    type="radio"
                    tabIndex={-1}
                    name="userType"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateUserType(event)}
                />

                <label
                    htmlFor="visitor"
                    className="cursor-pointer block w-full rounded-lg border border-gray-200 p-2 hover:border-black peer-checked:border-black peer-checked:bg-black peer-checked:text-white"
                    tabIndex={0}
                >
                    <span className="text-sm font-medium"> Visitor </span>
                </label>
                </div>
            </div>
            </div>

            <div>
            <div className="flow-root">
                {UserTypes.STUDENT === selectedUserType && (
                  <div className='w-1/2'>
                    <label
                      htmlFor="studentNumber"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Student No.
                    </label>
  
                    <input
                      type="text"
                      id="studentNumber"
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    />
                  </div>
                )}
                {UserTypes.EMPLOYEE === selectedUserType && (
                  <div className='w-1/2'>
                    <label
                      htmlFor="employeeNumber"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Employee No.
                    </label>
  
                    <input
                      type="text"
                      id="employeeNumber"
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    />
                  </div>
                )}
                {UserTypes.VISITOR === selectedUserType && (
                  <div className='w-full'>
                    <label
                      htmlFor="validIdNumber"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Select valid ID
                    </label>
                    
                    <select
                      id="validId"
                      className="mt-1 relative w-full rounded border-gray-200 focus:z-10 sm:text-sm"
                      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleUpdateSelectedVisitorValidId(event)}
                    >
                      {Ids.map((id: string, index: number) => {
                         return <option key={index} className='truncate'>{id}</option>
                      })
                    }
                    </select>

                    <input
                      type="text"
                      id="validIdNumber"
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                      placeholder={`${visitorSelectedValidId} No.`}
                    />
                  </div>
                )}
            </div>
            </div>
        </div>
        </div>

        <div className="bg-white py-12 md:py-24">
        <div className="mx-auto max-w-lg px-4 lg:px-8">
            <form className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-xs font-medium text-gray-700"
                >
                First Name
                </label>

                <input
                  type="text"
                  id="FirstName"
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
            </div>
            <div className="col-span-3">
                <label
                htmlFor="middleName"
                className="block text-xs font-medium text-gray-700"
                >
                Middle name
                </label>

                <input
                type="text"
                id="middleName"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
            </div>
            <div className="col-span-5">
                <label
                htmlFor="LastName"
                className="block text-xs font-medium text-gray-700"
                >
                Last Name
                </label>

                <input
                type="text"
                id="LastName"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
            </div>
            <div className="col-span-1">
                <label
                htmlFor="suffix"
                className="block text-xs font-medium text-gray-700"
                >
                Suffix
                </label>

                <input
                  type="text"
                  id="suffix"
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
            </div>
            <div className="col-span-4">
                <label htmlFor="Email" className="block text-xs font-medium text-gray-700">
                  Date of Birth
                </label>

                <input
                  type="date"
                  id="dob"
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
            </div>
            <div className="col-span-2">
                <label htmlFor="gender" className="block text-xs font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="Country"
                  className="mt-1 relative w-full rounded border-gray-200 focus:z-10 sm:text-sm"
                >
                 {
                  Genders.map((country: string, index: number) => {
                    return <option key={index}>{country}</option>
                  })
                 }
                </select>
            </div>
            <div className="col-span-6">
                <label htmlFor="Email" className="block text-xs font-medium text-gray-700">
                Email ( autofilled )
                </label>

                <input
                  type="email"
                  id="Email"
                  defaultValue={email}
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  disabled
                />
            </div>
            <fieldset className="col-span-6">
                <legend className="block text-sm font-medium text-gray-700">
                 Phone
                </legend>
                <div className="flex -space-x-px">
                <div className="w-24">
                  <label htmlFor="countryCode" className="sr-only"> Country Code: </label>

                  <select
                    id="countryCode"
                    className="relative w-full rounded-l-md border-gray-200 focus:z-10 sm:text-sm"
                    >
                    {
                        Countries.map((country: { name: string, countryCode: string }, index: number) => {
                            return <option key={index}>{country.countryCode}</option>
                        })
                    }
                  </select>
                </div>

                <div className="flex-1">
                  <label htmlFor="phoneNumber" className="sr-only"> Phone Number </label>

                  <input
                    type="text"
                    id="phoneNumber"
                    placeholder="Phone Number"
                    className="relative w-full rounded-r-md border-gray-200 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
                
            </fieldset>
            <fieldset className="col-span-6">
                <legend className="block text-sm font-medium text-gray-700">
                Address
                </legend>

                <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                <div>
                    <label htmlFor="houseNumberStreet" className="sr-only">House no. street</label>
                    <input
                      type='text' 
                      className='relative w-full rounded-t-md border-gray-200 focus:z-10 sm:text-sm'
                      name='houseNumberStreet'
                      id='houseNumberStreet'
                      placeholder='House #/ Bldg. # Street'
                    />
                </div>

                <div>
                    <label className="sr-only" htmlFor="barangayCity"> Barangay, City, Province </label>

                    <input
                      type="text"
                      id="barangayCity"
                      placeholder="Barangay, City, Province"
                      className="relative w-full rounded-b-md border-gray-200 focus:z-10 sm:text-sm"
                    />
                </div>
                </div>
            </fieldset>
            <fieldset className="col-span-6">
                <legend className="block text-sm font-medium text-gray-700">
                 Country and Postal Code
                </legend>

                <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                <div>
                    <label htmlFor="Country" className="sr-only">Country</label>
                    <select
                    id="Country"
                    className="relative w-full rounded-t-md border-gray-200 focus:z-10 sm:text-sm"
                    >
                    {
                        Countries.map((country:  { name: string, countryCode: string }, index: number) => {
                            return <option key={index}>{country.name}</option>
                        })
                    }
                    </select>
                </div>

                <div>
                    <label className="sr-only" htmlFor="PostalCode"> ZIP/Post Code </label>

                    <input
                    type="text"
                    id="PostalCode"
                    placeholder="ZIP/Post Code"
                    className="relative w-full rounded-b-md border-gray-200 focus:z-10 sm:text-sm"
                    />
                </div>
                </div>
            </fieldset>

            <div className="col-span-6">
                <button
                className="block w-full rounded-md bg-black p-2.5 text-sm text-white transition hover:shadow-lg"
                >
                Submit now
                </button>
            </div>
            </form>
        </div>
        </div>
    </div>
    </section>
  )
}
