import { storage } from '@/config/firebase-config'
import userStore from '@/states/user/userStates'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { IMAGES, UserTypes } from '@/utils/app_constants'
import moment from 'moment'
import { PageProps } from '@/utils/types'
import { getUidFromToken } from '@/utils/parser'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'
import { updatePassword } from '@/api/user/updatePassword'
import { isPasswordValid } from '@/utils/helpers'
import { getUserDetails } from '@/api/user/getUserDetails'
import { updatePersonalInformation } from '@/api/user/updatePersonalInformation'

export default function UpdateProfileContainer({ props }: {props: PageProps}) {
  const token = props?.token as string ?? ''
  const { uid } = getUidFromToken(token)

  const payloadParams = { id: uid }
  const { data } = useQuery({ queryKey: ['user-details'], queryFn: () => getUserDetails(uid, token, payloadParams)})
  
  const router = useRouter()
  const params = router.query.params
  const isUpdateProfileInformationRoute =
    params?.[1] as string === 'profile-information' || params?.[1] as string === undefined
  const isUpdatePasswordRoute = params?.[1] as string === 'change-password'

  const { email, fullname, type, mobileNumber, birthday, profileUrl } = userStore(state => state)
  const firebaseStoragePath = `profiles/${uid}/`
  const [isEditable, setIsEditable] = useState(false)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>(IMAGES.DEFAULT_PROFILE_PHOTO)
  const [uploadProfilePhotoProgress, setUploadProfilePhotoProgress] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasSuccess, setHasSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [phoneNumber, setPhoneNumber] = useState(data?.data?.mobile_number as string ?? '')
  const [studentCourse, setStudentCourse] = useState(data?.data?.course as string ?? '')
  const [studentYearAndSection, setStudentYearAndSection] = useState(data?.data?.year_section as string ?? '')
  const [employeeDepartment, setEmployeeDepartment] = useState(data?.data?.department as string ?? '')
  const [employeePosition, setEmployeePosition] = useState(data?.data?.position as string ?? '')

  useEffect(() => {
    setProfilePhotoUrl(profileUrl)
  }, [ profileUrl])
  

  const handleTogglePasswordVisibility = (visibilityFor: string) => {
    if(visibilityFor === 'old-password') {
      return setShowOldPassword(prevState => !prevState)
    }
    if(visibilityFor === 'new-password') {
      return setShowNewPassword(prevState => !prevState)
    }
    if(visibilityFor === 'confirm-new-password') {
      return setShowConfirmPassword(prevState => !prevState)
    }
  }
  
  const setError = (status: boolean, messsage: string) =>{
    setHasError(status)
    setErrorMessage(messsage)
  }

  const setSuccess = (status: boolean, message: string) => {
    setHasSuccess(status)
    setSuccessMessage(message)
  }

  const resetStatus = () => {
    setHasSuccess(false)
    setError(false, '')
  }

  const updateProfileMutation = useMutation({
    mutationFn: () => updatePersonalInformation(uid,token,type, profilePhotoUrl, phoneNumber, studentCourse, studentYearAndSection, employeeDepartment, employeePosition),
    onSuccess: () => {
      resetStatus()
      setSuccess(true, 'Pesonal information updated.')
    },
    onError: () => {
      resetStatus()
      setError(true, 'Failed updating personal information. Please try again')
    }
  })


  const updatePasswordMutation = useMutation({
    mutationFn: () => updatePassword(uid, token, oldPassword, newPassword),
    onSuccess: (response) => {
      const isSuccess = response?.success === 1
      if (isSuccess) {
        return setSuccess(true, 'Password changed successfully.')
      } else {
        return setError(true, response?.message as string)
      }
    },
    onError: () => {
      setError(true, 'An error occured. Please try again')
    }
  })

  
  const handleChangeProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){
     let imageFile = event.target.files[0] as File
     const metadata = {
         contentType: 'image/jpeg'
     };

     const storageRef = ref(storage, firebaseStoragePath + imageFile?.name as string);
     const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);

     uploadTask.on('state_changed',
                 (snapshot) => {
                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                     setUploadProfilePhotoProgress(progress as number)
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
                      const profilePhotoUrlValue = downloadURL as string ?? IMAGES.DEFAULT_PROFILE_PHOTO
                      setProfilePhotoUrl( profilePhotoUrlValue)
                     });
                 }
             );
      } 
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpdatePassword = (oldPasswordValue: string, newPasswordValue: string, confirmNewPasswordValue: string) => {
    if(newPasswordValue !== confirmNewPasswordValue) {
      return setError(true, 'New password dont match with confirm password.')
    }
    if(!isPasswordValid(newPasswordValue)) {
      return setError(true, 'New Password is weak, make sure to add at least 8 characters, at least one lowercase letter, at least one uppercase letter, at least one digit, and at least one special character (@$!%*?&)!')
    }
    if(!isPasswordValid(confirmNewPasswordValue)) {
      return setError(true, 'Confirm Password is weak, make sure to add at least 8 characters, at least one lowercase letter, at least one uppercase letter, at least one digit, and at least one special character (@$!%*?&)!')
    }
    updatePasswordMutation.mutate()
  }

  const handleUpdatePersonalInformation = (
    mobileNumber: string,
    studentCourse: string,
    studentYearSection: string,
    employeeDepartment: string,
    employeePosition: string
  ) => {
    const isStudent = type.toLowerCase() === UserTypes.STUDENT
    const isEmployee = type.toLowerCase() === UserTypes.EMPLOYEE
    const isVisitor = type.toLowerCase() === UserTypes.VISITOR
    if(mobileNumber === '') {
      return setError(true, 'Make sure phone number is not empty')
    }
    if (isStudent) {
      if(studentCourse === '') {
        return setError(true, 'Make sure course is not empty')
      }
      if(studentYearSection === '') {
        return setError(true, 'Make sure year and section is not empty')
      }
      updateProfileMutation.mutate()
    }

    if (isEmployee) {
      if(employeeDepartment === '') {
        return setError(true, 'Make sure department is not empty')
      }
      if(employeePosition === '') {
        return setError(true, 'Make sure position is not empty')
      }
      updateProfileMutation.mutate()
    }

    if (isVisitor) {
      updateProfileMutation.mutate()
    }
  }

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetStatus()
    const form = event?.currentTarget as HTMLFormElement

    const mobileNumberElement = form?.elements?.namedItem('mobile-number') as HTMLInputElement
    const studentCourseElement = form?.elements?.namedItem('student-course') as HTMLInputElement
    const studentYearSectionElement = form?.elements?.namedItem('student-year-section') as HTMLInputElement
    const employeeDepartmentElement = form?.elements?.namedItem('employee-department') as HTMLInputElement
    const employeePositionElement = form?.elements?.namedItem('employee-position') as HTMLInputElement
    const passwordElement = form?.elements?.namedItem('password') as HTMLInputElement

    const oldPasswordElement = form?.elements?.namedItem('old-password') as HTMLInputElement
    const newPasswordElement = form?.elements?.namedItem('new-password') as HTMLInputElement
    const confirmNewPasswordElement = form?.elements?.namedItem('confirm-new-password') as HTMLInputElement

    const mobileNumberValue = mobileNumberElement?.value as string
    const studentCourseValue = studentCourseElement?.value as string
    const studentYearSectionValue = studentYearSectionElement?.value as string
    const employeeDepartmentValue = employeeDepartmentElement?.value as string
    const employeePositionValue = employeePositionElement?.value as string
    const passwordValue = passwordElement?.value as string

    const oldPasswordValue = oldPasswordElement?.value as string
    const newPasswordValue = newPasswordElement?.value as string
    const confirmNewPasswordValue = confirmNewPasswordElement?.value as string

    setPhoneNumber(mobileNumberValue)
    setStudentCourse(studentCourseValue)
    setStudentYearAndSection(studentYearSectionValue)
    setEmployeeDepartment(employeeDepartmentValue)
    setEmployeePosition(employeePositionValue)

    if(isUpdatePasswordRoute){
      setOldPassword(oldPasswordValue)
      setNewPassword(confirmNewPasswordValue)
      return handleUpdatePassword(oldPasswordValue, newPasswordValue, confirmNewPasswordValue)
    }
    if (isUpdateProfileInformationRoute) {
      return handleUpdatePersonalInformation(
        mobileNumberValue,
        studentCourseValue,
        studentYearSectionValue,
        employeeDepartmentValue,
        employeePositionValue
      )
    }

  }

  const handleToggleEdit = () => {
    setIsEditable(prevState => !prevState)
  }

  return (
    <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-main dark:text-white">Account information</h5>
            <button onClick={handleToggleEdit} className="text-sm font-medium text-main hover:underline dark:text-main">
                {isEditable ? 'Close edit' : 'Edit'}
            </button>
      </div>
      <div className="flow-root">
      <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
        <span className="font-medium">Warning!</span> You cannot change information that are based on your documents e.g name, address.
      </div>
      <div
        className='py-8 flex flex-col md:flex-row relative'
      >
        <div>
          <img
            src={profilePhotoUrl}
            className="w-32 h-32 rounded-full"
            alt="Avatar"
            onError={(current) => {
              current.currentTarget.src = IMAGES.DEFAULT_PROFILE_PHOTO
            }}
          />
        </div>
        <div
          className='flex flex-col mt-2 md:mt-0 pl-0 md:pl-6 justify-center'
        >
          <h5 className="text-xl font-semibold">{fullname}</h5>
          <h6 className="font-semibold text-main dark:text-primary-500 capitalize">
            {type}
          </h6>
        </div>
        <input
          className="hidden"
          type="file"
          id="backId"
          accept="image/*"
          onChange={handleChangeProfilePhoto}
          ref={fileInputRef}
        />
        <button
          className='md:absolute mt-6 md:mt-0 right-4 text-white bg-main hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-main dark:hover:bg-main dark:focus:ring-main'
          onClick={handleButtonClick}
          disabled={!isEditable}
        >
          Change profile { uploadProfilePhotoProgress > 0 && uploadProfilePhotoProgress < 100 && (
            `Uploading...${uploadProfilePhotoProgress.toFixed()}%` 
          )}
        </button>
        
      </div>
      <form onSubmit={handleSaveChanges}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
                <label
                  htmlFor="website" 
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of birth
                </label>
                <input
                  type="url" 
                  disabled
                  id="website"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                  placeholder="Date of birth" 
                  defaultValue={moment(birthday).format('MMM DD YYYY') ?? ''}
                  required 
                />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
              <input disabled type="email" id="email" defaultValue={email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main" placeholder="Email" required />
            </div>
        </div>
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
              <li className="mr-2" role="presentation">
                  <Link href='/home/update-profile/profile-information' >
                    <button
                      className={isUpdateProfileInformationRoute ? "inline-block p-4 border-b-2 border-main rounded-t-lg"  : "inline-block p-4 hover:border-b-2 hover:border-main rounded-t-lg" }
                      id="profile-tab" 
                      data-tabs-target="#profile" 
                      type="button"
                      role="tab"
                      aria-controls="profile" 
                      aria-selected="false"
                    >
                      Profile Information
                    </button>
                  </Link>
              </li>
              <li className="mr-2" role="presentation">
                <Link href='/home/update-profile/change-password' >
                  <button
                    className={isUpdatePasswordRoute ? "inline-block p-4 border-b-2 border-main rounded-t-lg"  : "inline-block p-4 hover:border-b-2 hover:border-main rounded-t-lg" }
                    id="dashboard-tab" 
                    data-tabs-target="#dashboard"
                    type="button"
                    role="tab"
                    aria-controls="dashboard"
                    aria-selected="false"
                  >
                    Change password
                  </button>
                </Link>
              </li>
          </ul>
      </div>
      <div id="tab1" className='mb-2'>
          {isUpdateProfileInformationRoute && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="profile" role="tabpanel" aria-labelledby="profile-tab">
              <div className="">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name='mobile-number'
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                    placeholder="Mobile number"
                    defaultValue={mobileNumber}
                    required
                    disabled={!isEditable}
                  />
                  {type.toLocaleLowerCase() === UserTypes.STUDENT && (
                    <>
                    <label
                      htmlFor="student-course"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Course
                    </label>
                    <input
                      type="text"
                      id="student-course"
                      name="student-course"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                      placeholder="Course"
                      defaultValue={data?.data?.course as string ?? ''}
                      required
                      disabled={!isEditable}
                    />
                    <label
                      htmlFor="student-year-section"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Year and section
                    </label>
                    <input
                      type="text"
                      id="student-year-section"
                      name='student-year-section'
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                      placeholder="Year and section"
                      defaultValue={data?.data?.year_section as string ?? ''}
                      required
                      disabled={!isEditable}
                    />
                    </>
                  )}
                  {type.toLocaleLowerCase() === UserTypes.EMPLOYEE && (
                    <>
                    <label
                      htmlFor="department"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      id="employee-department"
                      name='employee-department'
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                      placeholder="Department"
                      defaultValue={data?.data?.department as string ?? ''}
                      required
                      disabled={!isEditable}
                    />
                    <label
                      htmlFor="employe-position"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Position
                    </label>
                    <input
                      type="text"
                      id="employee-position"
                      name='employee-position'
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                      placeholder="Employee position"
                      defaultValue={data?.data?.position as string ?? ''}
                      required
                      disabled={!isEditable}
                    />
                    </>
                  )}
              </div>
            </div>
          )}
          {isUpdatePasswordRoute && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
              <label htmlFor="old-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password</label>
              <div className="relative mt-1">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  name='old-password'
                  id="old-password" 
                  className="text-gray-900 text-sm rounded-lg border border-gray-300 focus:ring-main focus:border-main w-full bg-gray-50 py-3 px-4 pr-12 shadow-sm"
                  placeholder="Old password"
                  disabled={!isEditable}
                />
                        <button
                            onClick={() => handleTogglePasswordVisibility('old-password')}
                            type='button'
                          >
                            <span className="absolute inset-y-0 right-4 inline-flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                {
                                  showOldPassword
                                  ? <>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </>
                                  : <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                }
                              </svg>
                            </span>
                        </button>
                </div>
                <label htmlFor="new-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">new password</label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name='new-password'
                    id="new-password" 
                    className="text-gray-900 text-sm rounded-lg border border-gray-300 focus:ring-main focus:border-main w-full bg-gray-50 py-3 px-4 pr-12 shadow-sm"
                    placeholder="Confirm password"
                    disabled={!isEditable}
                  />
                          <button
                              onClick={() => handleTogglePasswordVisibility('new-password')}
                              type='button'
                            >
                              <span className="absolute inset-y-0 right-4 inline-flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  {
                                    showNewPassword
                                    ? <>
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                      />
                                    </>
                                    : <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                  }
                                </svg>
                              </span>
                          </button>
                  </div>
                  <label htmlFor="confirm-new-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm new password</label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name='confirm-new-password'
                      id="confirm-new-password" 
                      className="text-gray-900 text-sm rounded-lg border border-gray-300 focus:ring-main focus:border-main w-full bg-gray-50 py-3 px-4 pr-12 shadow-sm"
                      placeholder="Old password"
                      disabled={!isEditable}
                    />
                            <button
                                onClick={() => handleTogglePasswordVisibility('confirm-new-password')}
                                type='button'
                              >
                                <span className="absolute inset-y-0 right-4 inline-flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    {
                                      showConfirmPassword
                                      ? <>
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                      </>
                                      : <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    }
                                  </svg>
                                </span>
                            </button>
                    </div>
            </div>
          )}
      </div>
          <div>
            {updatePasswordMutation.isLoading || updateProfileMutation.isLoading && (
              <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                <span className="font-medium">Please wait...</span> Updating...
              </div>
            )}
            {hasError && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">Error Occured!</span> {errorMessage}
              </div>
            )}
            {hasSuccess && (
               <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                <span className="font-medium">Success!</span> {successMessage}
              </div>
            )}
          </div>
       <div className='mb-6 flex justify-between gap-2'>
        <button
          type="submit"
          className="text-white bg-main hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-main dark:hover:bg-main dark:focus:ring-main"
          disabled={!isEditable}
        >
          Save changes
        </button>
        {/* <button type="submit" className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Deactivate account</button> */}
       </div>
    </form>
      </div>
    </div>
  )
}
