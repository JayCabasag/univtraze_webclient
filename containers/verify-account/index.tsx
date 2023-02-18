import { genericPostRequest } from '@/services/genericPostRequest'
import { IMAGES, UserTypeList } from '@/utils/app_constants'
import { decodeJWT } from '@/utils/helpers'
import { logoutUser } from '@/utils/methods'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { UserTypes } from '@/utils/app_constants'
import { storage } from '@/config/firebase-config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import userStore from '@/states/user/userStates'
import Image from 'next/image'

interface Props {
  isAuthorize: boolean,
  redirectUrl: string,
  response: any
}


interface UserDetailsType {
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
  professorDepartment: string
  professorEmployeeId: string 
}

export default function VerifyAccountContainer() {
  //Data
  const router = useRouter()
  const { role } = router.query
  const roleValue = role as string ?? ''  
  const hasRole = roleValue !== ''
  const { removeUserDetails, email } = userStore(state => state)
  const uid = userStore((state) => state.uid)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showFrontId, setShowFrontId] = useState(false)
  const [showBackId, setShowBackId] = useState(false)
  const [uploadFrontIdPhotoProgress, setUploadFrontIdPhotoProgress] = useState(0)
  const [uploadBackIdPhotoProgress, setUploadBackIdPhotoProgress] = useState(0)
  const [userDetails, setUserDetails] = useState<UserDetailsType>({firstname: '', middlename: '', lastname: '', suffix: '', dateOfBirth: '', gender: '', mobileNumber: '', addressLineOne: '', addressLineTwo: '', backIdPhotoUrl: '', frontIdPhotoUrl:'',  professorDepartment: '', professorEmployeeId: ''})

  const firebaseStoragePath = `ids/${uid}/`

  //Methods
  const previewImage = (action: string) => {
    if(action === 'front-id'){
      setShowFrontId(prevState => !prevState)
    }
    if(action === 'back-id'){
      setShowBackId(prevState => !prevState)
    }
  }

  const handleLogoutUser = () => {
    const { status } = logoutUser()
    if(status === 'success'){
      removeUserDetails()
      return router.replace('/')
    }
    alert('Unable to logout')
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

     const storageRef = ref(storage,  firebaseStoragePath + imageFile.name);
     const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);

     uploadTask.on('state_changed',
                 (snapshot) => {
                     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                     // A full list of error codes is available at
                     // https://firebase.google.com/docs/storage/web/handle-errors
                     switch (error.code) {
                     case 'storage/unauthorized':
                         // User doesn't have permission to access the object
                         break;
                     case 'storage/canceled':
                         // User canceled the upload
                         break;

                     // ...

                     case 'storage/unknown':
                         // Unknown error occurred, inspect error.serverResponse
                         break;
                     }
                 }, 
                 () => {
                     // Upload completed successfully, now we can get the download URL
                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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

     const storageRef = ref(storage,  firebaseStoragePath + imageFile.name);
     const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);

     uploadTask.on('state_changed',
                 (snapshot) => {
                     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                     // A full list of error codes is available at
                     // https://firebase.google.com/docs/storage/web/handle-errors
                     switch (error.code) {
                     case 'storage/unauthorized':
                         // User doesn't have permission to access the object
                         break;
                     case 'storage/canceled':
                         // User canceled the upload
                         break;

                     // ...

                     case 'storage/unknown':
                         // Unknown error occurred, inspect error.serverResponse
                         break;
                     }
                 }, 
                 () => {
                     // Upload completed successfully, now we can get the download URL
                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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
    const mobileNumber = data?.['mobileNumber'] as string
    const addressLineOne = data?.['addressLineOne'] as string
    const addressLineTwo = data?.['addressLineTwo'] as string
    const studentId = data?.['studentId'] as string
    const studentCourse = data?.['course'] as string
    const studentYearAndSection = data?.['yearAndSection'] as string
    const professorDepartment = data?.['professorDepartment'] as string
    const professorEmployeeId = data?.['professorEmployeeId'] as string

    if(firstname === ''){
      return setEncounteredError('Please add your firstname')
    }
    if(middlename === ''){
      return setEncounteredError('Please add your middlename')
    }
    if(lastname === ''){
      return setEncounteredError('Please add your lastname')
    }
    if(gender === ''){
      return setEncounteredError('Please add your gender')
    }
    if(mobileNumber === ''){
      return setEncounteredError('Please add your mobile number')
    }
    if(dateOfBirth === ''){
      return setEncounteredError('Please add your Date of Birth')
    }
    if(addressLineOne === ''){
      return setEncounteredError('Please add your House No./Lot No./Building No. street, barangay')
    }
    if(addressLineTwo === ''){
      return setEncounteredError('City/Municipality, Province')
    }
    if(userDetails?.["frontIdPhotoUrl"] as string === ''){
      return setEncounteredError('Add back ID photo')
    }
    if(userDetails?.["backIdPhotoUrl"] as string === ''){
      return setEncounteredError('Add back ID photo')
    }

    if(roleValue === UserTypes.STUDENT && studentId === ''){
      return setEncounteredError('Add back Student Id')
    }
    if(roleValue === UserTypes.STUDENT && studentCourse === ''){
      return setEncounteredError('Add course')
    }
    if(roleValue === UserTypes.STUDENT && studentYearAndSection === ''){
      return setEncounteredError('Add year and section')
    }

    if(roleValue === UserTypes.PROFESSOR && professorDepartment === ''){
      return setEncounteredError('Add your faculty/Department')
    }
    if(roleValue === UserTypes.PROFESSOR && professorEmployeeId === ''){
      return setEncounteredError('Add your Employee Id')
    }

    if(roleValue === UserTypes.STUDENT){
      setUserDetails(prevState => {
        return {
          ...prevState,
          firstname,
          middlename,
          lastname,
          suffix,
          dateOfBirth,
          gender,
          addressLineOne,
          addressLineTwo,
          studentId,
          studentCourse,
          studentYearAndSection
        }
      })
    }
    if(roleValue === UserTypes.PROFESSOR){
      setUserDetails(prevState => {
        return {
          ...prevState,
          firstname,
          middlename,
          lastname,
          suffix,
          dateOfBirth,
          gender,
          addressLineOne,
          addressLineTwo,
          professorDepartment,
          professorEmployeeId
        }
      })
    }
    if(roleValue === UserTypes.VISITOR){
      setUserDetails(prevState => {
        return {
          ...prevState,
          firstname,
          middlename,
          lastname,
          suffix,
          dateOfBirth,
          gender,
          addressLineOne,
          addressLineTwo
        }
      })
    }

    setError(false)
    setErrorMessage('')
  }

  //Templates
  return (
    <div className="bg-gray-100 h-auto p-6 flex flex-col">
      <div className='flex w-full justify-end  py-3 md:p-6'>
        <button 
          className="text-slate-500 font-bold py-2 px-4 rounded flex items-center justify-center text-sm gap-2"
          onClick={handleLogoutUser}
        >
        <Image src={IMAGES.LOGOUT} height={24} width={24} alt={'logout'}/>
        Logout
      </button>
      </div>
      <div className="flex items-center justify-center h-full w-full">
        {!hasRole && (
          <div className="w-full max-w-sm h-auto pt-24">
          <h1 className="text-lg md:text-2xl text-left font-bold mb-4 text-slate-600">Let&apos;s get started</h1>
            <form className="bg-white px-8 pt-6 pb-8 mb-4 md:w-auto w-full">
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2 text-sm" htmlFor="role">
                  I&apos;m a
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline capitalize text-slate-500 border-slate-300"
                  id="role"
                  name="role"
                >
                  <option value="">Select your role</option>
                  {UserTypeList.map((type, index) => {
                    return <option value={type} key={index} className='capitalize'>{type}</option>
                  })}
                </select>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-green-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-white"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
        {hasRole && (
          <div className="w-full max-w-2xl flex flex-col md:mt-8">
             <div className="mb-4">
              <h1 
                className="text-lg md:text-2xl text-left font-bold mb-4 text-slate-600"
              >
                Please your provide additional information
              </h1>
             </div>
            <div>
              <form 
                className="bg-white rounded px-0 pt-0 pb-0 flex flex-col md:flex-row gap-4 w-full" 
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                    <div className='w-full md:w-1/2'>
                      <div className="mb-4">
                        <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="firstName">
                          First Name:
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="middleName">
                          Middle Name:
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                          id="middleName"
                          name="middleName"
                          type="text"
                          
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="lastName">
                          Last Name:
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                        />
                      </div>
                      <div className="mb-4 flex flex-row justify-between gap-4">
                        <div className='w-16'>
                          <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="suffix">
                            Suffix:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                            id="suffix"
                            name="suffix"
                            type="text"
                          />
                        </div>
                        <div className='w-full'>
                          <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="dateOfBirth">
                            Date of Birth:
                          </label>
                          <input
                            className="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full text-slate-500 border-slate-300"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            required
                          />
                        </div>
                        <div className='w-full'>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="gender">
                          Gender:
                        </label>
                        <select
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                          id="gender"
                          name="gender"
                        >
                          <option value="">Select your gender</option>
                          <option value="rather-not-say">Rather not say</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="mobileNumber">
                          Mobile Number:
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                          id="mobileNumber"
                          name="mobileNumber"
                          type="text"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="addressLineOne">
                          House No./ Bldg. No. Street, Barangay:
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                          id="address"
                          name="addressLineOne"
                          type="text"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="addressLineTwo">
                          City/Municipality, Province
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                          id="addressLineTwo"
                          name="addressLineTwo"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div className='w-full md:w-1/2'>
                    {roleValue === UserTypes.STUDENT && (
                       <>
                        <div className="mb-4">
                          <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="course">
                            Student Id:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                            id="studentId"
                            name="studentId"
                            type="text"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="course">
                            Course:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                            id="course"
                            name="course"
                            type="text"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="yearAndSection">
                            Year & Section:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                            id="yearAndSection"
                            name="yearAndSection"
                            type="text"
                            required
                          />
                        </div>
                       </>
                    )}

                    {roleValue === UserTypes.PROFESSOR && (
                       <>
                        <div className="mb-4">
                          <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="professor-department">
                            Department/Faculty:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                            id="professor-department"
                            name="professorDepartment"
                            type="text"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="professor-employee-id">
                            Employee Id:
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300"
                            id="professor-employee-id"
                            name="professorEmployeeId"
                            type="text"
                            required
                          />
                        </div>
                       </>
                    )}
                    <div className="mb-4">
                      <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="frontId">
                        Front ID (
                          {roleValue === UserTypes.STUDENT && ('Student ID')}
                          {roleValue === UserTypes.PROFESSOR && ('Employee ID')}
                          {roleValue === UserTypes.VISITOR && ('Any Valid ID')}
                        ) :
                      </label>
                    <div className='flex gap-2'>
                      <input className="block py-1 px-3 bg-white rounded-lg appearance-none focus:outline-none focus:shadow-outline border-slate-300 text-slate-500"
                        type="file" 
                        id="frontId" 
                        accept="image/*"
                        onChange={pickFrontIdPhotoFile}
                      />
                        <button 
                          type='button' 
                          onClick={() => previewImage('front-id')}
                          className="block px-4 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600" 
                        >
                          Preview
                        </button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="backId">
                          Back ID (
                          {roleValue === UserTypes.STUDENT && ('Student ID')}
                          {roleValue === UserTypes.PROFESSOR && ('Employee ID')}
                          {roleValue === UserTypes.VISITOR && ('Any Valid ID')}
                        ) :
                        </label>
                      <div className='flex gap-2'>
                        <input className="py-1 px-3 bg-white rounded-lg appearance-none focus:outline-none focus:shadow-outline border-slate-300 text-slate-500"
                          type="file" 
                          id="backId" 
                          accept="image/*"
                          onChange={pickBackIdPhotoFile}
                        />
                        <button 
                          type='button' 
                          onClick={() => previewImage('back-id')}
                          className="py-0 px-4 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600" 
                        >
                        Preview
                        </button>
                      </div>
                    </div>
                    {error && (
                      <div className="flex flex-col gap-2 mt-2 bg-red-100 text-red-600 p-2 rounded-md">
                        <p className="font-bold">{errorMessage}</p>
                      </div>
                    )}
                    <div className="mb-4 w-full flex mt-2">
                      <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline justify-self-end"
                        type='submit'
                      >
                        Submit
                      </button>
                    </div>
                  </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const cookieToken = req.headers.cookie as string;
  if (!cookieToken){
     res.writeHead(302, {
      Location: '/'
     })
     res.end()
     return {
      props: {
        isAuthorize: true,
        redirectUrl: '/home',
        response: {}
      }
    }
  }
  const token = cookieToken.substring(6)
  const decodedJWT = decodeJWT(token)
  const uid = decodedJWT.result.id as string
  let props = {isAuthorize: false, redirectUrl: '/', response: {}}

  await genericPostRequest({
    params: {id: uid},
    path: '/user/getUserDetailsById',
    success: (response) => {
      const isSuccess = response.success === 1
      if (isSuccess){
        return {
          props: {
            isAuthorize: true,
            redirectUrl: '/verify-account',
            response: response
          }
        } 
      }
      res.writeHead(302, {
        Location: '/'
      })
      res.end()
      return {
        props: {
          isAuthorize: false,
          redirectUrl: '/',
          response: response
        }
      } 
    },
    error: (errorResponse) => {
      return {
        props: {
          isAuthorize: false,
          redirectUrl: '/',
          response: errorResponse
        }
      }
    },
    token
  })

  return {
    props: props
  }
}