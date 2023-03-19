import { postCommunicableDisease } from '@/api/report/postCommunicableDisease'
import { storage } from '@/config/firebase-config'
import userStore from '@/states/user/userStates'
import { CommunicableDiseaseTypes, IMAGES } from '@/utils/app_constants'
import { getUidFromToken } from '@/utils/parser'
import { PageProps } from '@/utils/types'
import { useMutation } from '@tanstack/react-query'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { ChangeEventHandler, useRef, useState } from 'react'


export default function ReportDiseaseContainer({ props }: {props: PageProps}) {
  const token = props?.token as string ?? ''
  const { uid } = getUidFromToken(token)
  const { fullname, type } = userStore(state => state)
  
  const [diseaseName, setDiseaseName] = useState('')
  const [docPhotoUrl, setDocPhotoUrl] = useState('')
  const [uploadingProgress, setUploadingProgress] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const firebaseStoragePath = `report-disease/${uid}/`
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectProofPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                      setUploadingProgress(progress as number)
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
                       setDocPhotoUrl( profilePhotoUrlValue)
                      });
                  }
              );
       } 
  }

  const setError = (status: boolean, messsage: string) =>{
    setHasError(status)
    setErrorMessage(messsage)
  }

  const resetStatus = () => {
    setSuccess(false)
    setError(false, '')
  }

  const mutation = useMutation({
    mutationFn: () => postCommunicableDisease(token, uid, type, diseaseName, docPhotoUrl),
    onSuccess: () => {
      resetStatus()
      setSuccess(true)
    },
    onError: () => {
      resetStatus()
      setError(true, 'An error has occured. Please try again')
    }
  })
  

  const handlePostCommunicableDisease = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetStatus()

    const form = event.currentTarget;
    const diseaseNameElement = form.elements.namedItem("disease-name") as HTMLInputElement;
    const otherDiseaseNameElement = form.elements.namedItem("other-disease-name") as HTMLInputElement;
    
    const diseaseName = diseaseNameElement?.value as string;
    const otherDiseaseName = otherDiseaseNameElement?.value as string;

    if(diseaseName === CommunicableDiseaseTypes.DEFAULT_VALUE) {
      return setError(true, 'Please select a disease name')
    }

    if(diseaseName === CommunicableDiseaseTypes.OTHERS && otherDiseaseName === '') {
      return setError(true, 'Please specify a disease name')
    }

    if(diseaseName === CommunicableDiseaseTypes.OTHERS && otherDiseaseName !== '') {
      setDiseaseName(otherDiseaseName)
    }

    if(docPhotoUrl === '') {
      return setError(true, 'Please add a document proof')
    }

    mutation.mutate()
  }

  const handleUpdateSelectedDiseaseName = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDiseaseValue = event?.currentTarget?.value as string
    setDiseaseName(selectedDiseaseValue)
  }

  return (
    <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-main dark:text-white">Report a disease</h5>
    </div>
    <div className="flow-root space-y-2 md:space-y-4">
        <form className="space-y-4" onSubmit={handlePostCommunicableDisease}>
          <div>
            <label className="sr-only" htmlFor="name">Name</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
              placeholder="Name"
              type="text"
              defaultValue={fullname}
              id="name"
              disabled
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <select
                id="disease-name"
                name="disease-name"
                className="mt-1 relative w-full rounded focus:z-10 sm:text-sm border-gray-300 outline-none focus:ring-main focus:border-main"
                onChange={handleUpdateSelectedDiseaseName}
              >
                {Object.values(CommunicableDiseaseTypes).map((communicableDiseaseType: string, index: number) => {
                  return <option key={index} className='truncate'>{communicableDiseaseType}</option>
                })
              }
              </select>
            </div>
            {diseaseName === CommunicableDiseaseTypes.OTHERS && (
              <div>
                <label className="sr-only" htmlFor="other-disease-name">Name of disease</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                  placeholder="Name of disease"
                  type="text"
                  name='other-disease-name'
                  id='other-disease-name'
                />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center w-full mt-6">
                <legend className="block text-sm font-bold text-main pb-2">Document proof { uploadingProgress > 0 && uploadingProgress < 100 && `( uploading...${uploadingProgress.toFixed(0)}% )` }</legend>
                <label htmlFor="dropzone-file-front-id-photo" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 overflow-hidden">
                        { docPhotoUrl !== '' ?
                          <img 
                            src={docPhotoUrl}
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
                    <input id="dropzone-file-front-id-photo" type="file" className="hidden" accept="image/jpeg,image/png,image/gif" name='frontIdPhoto' onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSelectProofPhoto(event)}/>
                </label>
            </div>
          <div>
            {mutation.isLoading && (
              <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                <span className="font-medium">Please wait...</span> Finalizing your report...
              </div>
            )}
            {hasError && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">Error Occured!</span> {errorMessage}
              </div>
            )}
            {success && (
               <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                <span className="font-medium">Success!</span> Reported disease successfully.
              </div>
            )}
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="text-white bg-main hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-main dark:hover:bg-main dark:focus:ring-main"
            >
              Report communicable disease
            </button>
          </div>
        </form>
    </div>
    </div>
  )
}
