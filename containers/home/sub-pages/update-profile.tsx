import { storage } from '@/config/firebase-config'
import userStore from '@/states/user/userStates'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useRef, useState } from 'react'
import { IMAGES } from '@/utils/app_constants'
import moment from 'moment'
import { PageProps } from '@/utils/types'
import { getUidFromToken } from '@/utils/parser'

export default function UpdateProfileContainer({ props }: {props: PageProps}) {
  const token = props.token as string
  const { uid } = getUidFromToken(token)

  const { email, fullname, type, mobileNumber, birthday } = userStore(state => state)
  const firebaseStoragePath = `profiles/${uid}/`
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>(IMAGES.DEFAULT_PROFILE_PHOTO)
  const [uploadProfilePhotoProgress, setUploadProfilePhotoProgress] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  return (
    <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-main dark:text-white">Account information</h5>
            <button className="text-sm font-medium text-main hover:underline dark:text-main">
                Edit
            </button>
      </div>
      <div className="flow-root">
      <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
        <span className="font-medium">Warning!</span> You cannot changes information that are based on your documents e.g name, address.
      </div>
      <div
        className='p-4 py-8 flex flex-col md:flex-row relative'
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
          <h6 className="font-semibold text-main dark:text-primary-500">
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
        >
          Change profile
        </button>
        
      </div>
      <form>
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
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                  placeholder="Mobile number"
                  defaultValue={mobileNumber}
                  required
                />
            </div>
        </div>
        <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input type="email" id="email" defaultValue={email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main" placeholder="Email" required />
        </div> 
        <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main" placeholder="•••••••••" required />
        </div> 
        <div className="mb-6">
            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
            <input type="password" id="confirm_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main" placeholder="•••••••••" required />
        </div> 
       <div className='mb-6 flex justify-between gap-2'>
        <button type="submit" className="text-white bg-main hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-main dark:hover:bg-main dark:focus:ring-main">Save changes</button>
        <button type="submit" className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Deactivate account</button>
       </div>
    </form>
      </div>
    </div>
  )
}
