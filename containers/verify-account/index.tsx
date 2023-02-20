import React, { useState } from 'react'
import userStore from '@/states/user/userStates'
import { Countries, Genders, Ids } from '@/utils/lists'
import { useRouter } from 'next/router'
import moment from 'moment'
import { UserTypes } from '@/utils/app_constants'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '@/config/firebase-config'
import { getTotalYearsFromNow } from '@/utils/helpers'

interface UserDetailsType {
  uid: number | undefined,
  type: string,
  email: string,
  firstname: string
  middlename: string
  lastname: string
  suffix: string
  dateOfBirth: string
  gender: string
  mobileNumber: string
  addressLineOne: string
  addressLineTwo: string
  backIdPhotoUrl: string
  frontIdPhotoUrl: string
  studentId?: string
  course?: string
  yearAndSection?: string
  employeeDepartment?: string
  employeeId?: string
  visitorSelectedValidId?: string
  visitorValidIdNumber?: string
}


export default function VerifyAccountContainer() {
  const { email, uid } = userStore(state => state)
  const firebaseStoragePath = `ids/${uid}/`
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedUserType, setSelectedUserType] = useState('')
  const [visitorSelectedValidId, setVisitorSelectedValidId] = useState('')
  const [userDetails, setUserDetails] = useState<UserDetailsType>(
    {uid, type: '', email , firstname: '', middlename: '', lastname: '', suffix: '', dateOfBirth: '', gender: '', mobileNumber: '', addressLineOne: '', addressLineTwo: '', backIdPhotoUrl: '', frontIdPhotoUrl:'',studentId: '', course: '', yearAndSection: '', employeeDepartment: '', employeeId: '', visitorSelectedValidId: '', visitorValidIdNumber: ''})
  const [uploadFrontIdPhotoProgress, setUploadFrontIdPhotoProgress] = useState(0)
  const [uploadBackIdPhotoProgress, setUploadBackIdPhotoProgress] = useState(0)
  const [hasSelectedAnId, sethasSelectedAnId] = useState(false)

  const handleUpdateUserType = (userTypeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const typeText = userTypeEvent?.target?.id as string
    setSelectedUserType(typeText)
    setUserDetails(prevState => {
      return {...prevState, type: typeText }
    })
  }

  const handleUpdateStudentNumber = (event:  React.ChangeEvent<HTMLInputElement>) => {
    const studentNumberValue = event?.currentTarget?.value
    setUserDetails(prevState => {
      return {...prevState, studentId: studentNumberValue }
    })
  }

  const handleUpdateStudentYearAndSection = (event:  React.ChangeEvent<HTMLInputElement>) => {
    const studentYearAndSectionValue = event?.currentTarget?.value
    setUserDetails(prevState => {
      return {...prevState, yearAndSection: studentYearAndSectionValue }
    })
  }

  const handleUpdateStudentCourse = (event:  React.ChangeEvent<HTMLInputElement>) => {
    const studentCourseValue = event?.currentTarget?.value
    setUserDetails(prevState => {
      return {...prevState, course: studentCourseValue }
    })
  }


  const handleUpdateEmployeeNumber = (event:  React.ChangeEvent<HTMLInputElement>) => {
    const employeeNumberValue = event?.currentTarget?.value
    setUserDetails(prevState => {
      return {...prevState, employeeId: employeeNumberValue}
    })
  }

  const handleUpdateEmployeeDepartment = (event:  React.ChangeEvent<HTMLInputElement>) => {
    const employeeDepartmentValue = event?.currentTarget?.value
    setUserDetails(prevState => {
      return {...prevState, employeeDepartment: employeeDepartmentValue}
    })
  }

  const handleUpdateSelectedVisitorValidId = (validIdSelectEvent: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValidIdValue = validIdSelectEvent?.currentTarget?.value
    if(selectedValidIdValue === 'Select'){
      setVisitorSelectedValidId(selectedValidIdValue)
      sethasSelectedAnId(false)
    }
    if(selectedValidIdValue !== 'Select'){
      setVisitorSelectedValidId(selectedValidIdValue)
      sethasSelectedAnId(true)
      setUserDetails(prevState => {
        return { ...prevState, visitorSelectedValidId: selectedValidIdValue}
      })
    }
  }

  const handleUpdateSelectedVisitorValidIdNumber = (event:  React.ChangeEvent<HTMLInputElement>) => {
    const validIdNumberValue = event?.currentTarget?.value
    setUserDetails(prevState => {
      return {...prevState, visitorValidIdNumber: validIdNumberValue}
    })
  }

  const setEncounteredError = (errorMessageText: string) => {
    setError(true)
    setErrorMessage(errorMessageText)
  }

  const pickFrontIdPhotoFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){
     let imageFile = event.target.files[0] as File
     const metadata = {
         contentType: 'image/jpeg'
     };

     const storageRef = ref(storage,  firebaseStoragePath + imageFile?.name as string);
     const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);

     uploadTask.on('state_changed',
                 (snapshot) => {
                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                     setUploadFrontIdPhotoProgress(progress as number)
                     switch (snapshot.state) {
                     case 'paused':
                         break;
                     case 'running':
                         break;
                     }
                 }, 
                 (error) => {
                     switch (error.code) {
                     case 'storage/unauthorized':
                         break;
                     case 'storage/canceled':
                         break;
                     case 'storage/unknown':
                         break;
                     }
                 }, 
                 () => {
                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                      console.log(downloadURL)
                      setUserDetails(prevState => {
                        return {...prevState, frontIdPhotoUrl: downloadURL as string}
                      })
                     });
                 }
             );
      } 
  }

  const pickBackIdPhotoFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){
     let imageFile = event.target.files[0] as File
     const metadata = {
         contentType: 'image/jpeg'
     };

     const storageRef = ref(storage,  firebaseStoragePath + imageFile?.name as string);
     const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);

     uploadTask.on('state_changed',
                 (snapshot) => {
                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                     setUploadBackIdPhotoProgress(progress as number)
                     switch (snapshot.state) {
                     case 'paused':
                         break;
                     case 'running':
                         break;
                     }
                 }, 
                 (error) => {
                     switch (error.code) {
                     case 'storage/unauthorized':
                         break;
                     case 'storage/canceled':
                         break;
                     case 'storage/unknown':
                         break;
                     }
                 }, 
                 () => {
                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                      console.log(downloadURL)
                      setUserDetails(prevState => {
                        return {...prevState, backIdPhotoUrl: downloadURL as string}
                      })
                     });
                 }
             );
      } 
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries());
    const firstname = data?.['firstName'] as string
    const middlename = data?.['middleName'] as string
    const lastname = data?.['lastName'] as string
    const suffix = data?.['suffix'] as string
    const dateOfBirth = data?.['dateOfBirth'] as string
    const gender = data?.['gender'] as string
    const countryCode = data?.['countryCode'] as string
    const mobileNumber = data?.['mobileNumber'] as string
    const addressLineOne = data?.['houseNumberStreet'] as string
    const addressLineTwo = data?.['barangayCity'] as string
    const addressCountry = data?.['country'] as string
    const addressPostalCode = data?.['postalCode'] as string

    if(userDetails.type === ''){
      return setEncounteredError('Please select a user type')
    }

    if(selectedUserType === UserTypes.STUDENT && userDetails.studentId === ''){
      return setEncounteredError('Add your student number')
    }
    if(selectedUserType === UserTypes.STUDENT && userDetails.course === ''){
      return setEncounteredError('Add your course')
    }
    if(selectedUserType === UserTypes.STUDENT && userDetails.yearAndSection === ''){
      return setEncounteredError('Add year and section')
    }

    if(selectedUserType === UserTypes.EMPLOYEE && userDetails.employeeId === ''){
      return setEncounteredError('Add your Employee Id')
    }

    if(selectedUserType === UserTypes.EMPLOYEE && userDetails.employeeDepartment === ''){
      return setEncounteredError('Add your faculty/Department')
    }
    console.log(userDetails.visitorSelectedValidId)
    if(selectedUserType === UserTypes.VISITOR && userDetails.visitorSelectedValidId === ''){
      return setEncounteredError('Please select a valid Id')
    }
    if(selectedUserType === UserTypes.VISITOR && userDetails.visitorValidIdNumber === ''){
      return setEncounteredError(`Add your ${visitorSelectedValidId} Number`)
    }

    if(userDetails.frontIdPhotoUrl === ''){
      return setEncounteredError('Add front ID photo')
    }
    if(userDetails.backIdPhotoUrl === ''){
      return setEncounteredError('Add back ID photo')
    }

    if(firstname === ''){
      return setEncounteredError('Provide your first name')
    }
    if(middlename === ''){
      return setEncounteredError('Provide your middle name')
    }
    if(lastname === ''){
      return setEncounteredError('Provide your last name')
    }
    if(dateOfBirth === ''){
      return setEncounteredError('Provide your date of birth')
    }
    if(gender === ''){
      return setEncounteredError('Provide your gender')
    }
    if(mobileNumber === ''){
      return setEncounteredError('Provide your mobile number')
    }
    if(dateOfBirth === ''){
      return setEncounteredError('Provide your Date of Birth')
    }
    
    const totalYearsOld = getTotalYearsFromNow(dateOfBirth) as number
    if(totalYearsOld <= 11){
      return setEncounteredError('User should be atleast 12 years of age.')
    }

    if(addressLineOne === ''){
      return setEncounteredError('Provide your House No./Lot No./Building No. street')
    }
    if(addressLineTwo === ''){
      return setEncounteredError('Provide your barangay, City/Municipality, Province')
    }
    if(addressCountry === ''){
      return setEncounteredError('Please select country')
    }
    if(addressPostalCode === ''){
      return setEncounteredError('Provide Postal/Zip Code')
    }
   

    if(selectedUserType === UserTypes.STUDENT){
      setUserDetails(prevState => {
        return {
          ...prevState,
          firstname,
          middlename,
          lastname,
          suffix,
          dateOfBirth,
          gender,
          mobileNumber: `${countryCode}${mobileNumber}`,
          addressLineOne,
          addressLineTwo,
          studentId: userDetails.studentId,
          studentCourse: userDetails.course,
          studentYearAndSection: userDetails.yearAndSection
        }
      })
    }
    if(selectedUserType === UserTypes.EMPLOYEE){
      setUserDetails(prevState => {
        return {
          ...prevState,
          firstname,
          middlename,
          lastname,
          suffix,
          dateOfBirth,
          gender,
          mobileNumber: `${countryCode}${mobileNumber}`,
          addressLineOne,
          addressLineTwo,
          employeeDepartment: userDetails.employeeDepartment,
          employeeId: userDetails.employeeId
        }
      })
    }
    if(selectedUserType === UserTypes.VISITOR){
      setUserDetails(prevState => {
        return {
          ...prevState,
          firstname,
          middlename,
          lastname,
          suffix,
          dateOfBirth,
          gender,
          mobileNumber: `${countryCode}${mobileNumber}`,
          addressLineOne,
          addressLineTwo,
          visitorSelectedValidId: userDetails.visitorSelectedValidId,
          visitorValidIdNumber: userDetails.visitorValidIdNumber
        }
      })
    }

    console.log(userDetails)
    setError(false)
    setErrorMessage('')
  }


  console.log(userDetails)

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
            <p className="text-xl font-medium tracking-tight text-gray-900 mb-2">
                Please select user type :
            </p>
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
                  <>
                    <div className='w-full'>
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
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateStudentNumber(event)}
                      />
                    </div>
                    <div className='w-full'>
                      <fieldset className='w-full flex gap-4'>
                        <div className='flex-1'>
                          <label
                            htmlFor="course"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Course
                          </label>
        
                          <input
                            type="text"
                            id="course"
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateStudentCourse(event)}
                          />
                        </div>
                        <div className='flex-1'>
                          <label
                            htmlFor="studentNumber"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Year and Section
                          </label>
        
                          <input
                            type="text"
                            id="yearAndSection"
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateStudentYearAndSection(event)}
                          />
                        </div>
                      </fieldset>
                    </div>
                  </>
                )}
                {UserTypes.EMPLOYEE === selectedUserType && (
                  <>
                    <div className='w-full'>
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
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateEmployeeNumber(event)}
                      />
                    </div>
                    <div className='w-full'>
                      <label
                        htmlFor="employeeNumber"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Faculty / Department
                      </label>
    
                      <input
                        type="text"
                        id="employeeDepartment"
                        className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateEmployeeDepartment(event)}
                      />
                    </div>
                  </>
                )}
                {UserTypes.VISITOR === selectedUserType && (
                  <div className='w-full'>
                    <label
                      htmlFor="validIdNumber"
                      className="block text-xs font-bold text-main"
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
                    <label
                        htmlFor="employeeNumber"
                        className="block text-xs font-medium text-gray-700"
                      >
                        {`${visitorSelectedValidId} No.`}
                      </label>
                    <input
                      type="text"
                      id="validIdNumber"
                      className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                      disabled={!hasSelectedAnId}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpdateSelectedVisitorValidIdNumber(event)}
                    />
                  </div>
                )}
                
            <div className="flex flex-col items-center justify-center w-full mt-6">
                <legend className="block text-xs font-bold text-main">FRONT ID { uploadFrontIdPhotoProgress > 0 && uploadFrontIdPhotoProgress < 100 && `( uploading...${uploadFrontIdPhotoProgress.toFixed(0)}% )` }</legend>
                <label htmlFor="dropzone-file-front-id-photo" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 overflow-hidden">
                        { userDetails.frontIdPhotoUrl !== '' ?
                         <img 
                            src={userDetails.frontIdPhotoUrl}
                            alt='back-id'
                            height={120}
                            width={260}
                          />
                         :
                         <>
                          <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                         </>
                        }
                    </div>
                    <input id="dropzone-file-front-id-photo" type="file" className="hidden" accept="image/jpeg,image/png,image/gif" name='frontIdPhoto' onChange={(event: React.ChangeEvent<HTMLInputElement>) => pickFrontIdPhotoFile(event)}/>
                </label>
            </div> 

            <div className="flex items-center justify-center w-full mt-6 flex-col">
                <legend className="block text-xs font-bold text-main">BACK ID { uploadBackIdPhotoProgress > 0 && uploadBackIdPhotoProgress < 100 && `( uploading...${uploadBackIdPhotoProgress.toFixed(0)}% )` } </legend>
                <label htmlFor="dropzone-file-back-id-photo" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 overflow-hidden">
                        { userDetails.backIdPhotoUrl !== '' ?
                          <img 
                            src={userDetails.backIdPhotoUrl}
                            alt='back-id'
                            height={120}
                            width={260}
                          />
                         :
                         <>
                          <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                         </>
                        }
                    </div>
                    <input id="dropzone-file-back-id-photo" type="file" className="hidden" accept="image/jpeg,image/png" name='backIdPhoto' onChange={(event: React.ChangeEvent<HTMLInputElement>) => pickBackIdPhotoFile(event)}/>
                </label>
            </div> 

            </div>
            </div>
        </div>
        </div>

        <div className="bg-white py-12 md:py-24">
        <div className="mx-auto max-w-lg px-4 lg:px-8">
            <form className="grid grid-cols-6 gap-4" onSubmit={handleSubmit}>
            <div className="col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-xs font-medium text-gray-700"
                >
                First Name
                </label>

                <input
                  type="text"
                  id="firstName"
                  name='firstName'
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
                name='middleName'
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
            </div>
            <div className="col-span-5">
                <label
                htmlFor="lastName"
                className="block text-xs font-medium text-gray-700"
                >
                Last Name
                </label>

                <input
                type="text"
                id="lastName"
                name='lastName'
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
                  name='suffix'
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
            </div>
            <div className="col-span-4">
                <label htmlFor="dateOfBirth" className="block text-xs font-medium text-gray-700">
                  Date of Birth
                </label>

                <input
                  type="date"
                  id="dateOfBirth"
                  name='dateOfBirth'
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                />
            </div>
            <div className="col-span-2">
                <label htmlFor="gender" className="block text-xs font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name='gender'
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
                <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                Email ( autofilled )
                </label>

                <input
                  type="email"
                  id="email"
                  name='email'
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
                    name='countryCode'
                    >
                    {
                        Countries.map((country: { name: string, countryCode: string }, index: number) => {
                            return <option key={index}>{country.countryCode}</option>
                        })
                    }
                  </select>
                </div>

                <div className="flex-1">
                  <label htmlFor="mobileNumber" className="sr-only"> Phone Number </label>

                  <input
                    type="text"
                    id="mobileNumber"
                    placeholder="Phone Number"
                    name='mobileNumber'
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
                      name='barangayCity'
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
                    name='country'
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
                    <label className="sr-only" htmlFor="postalCode"> ZIP/Post Code </label>

                    <input
                    type="text"
                    id="postalCode"
                    placeholder="ZIP/Post Code"
                    name='postalCode'
                    className="relative w-full rounded-b-md border-gray-200 focus:z-10 sm:text-sm"
                    />
                </div>
                </div>
            </fieldset>
            {error && (
              <div className="col-span-6">
                <p className='text-red-500'>{errorMessage}</p>
              </div>
            )}
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
