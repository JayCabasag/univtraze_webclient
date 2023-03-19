import { postEmergencyReport } from '@/api/report/postEmergencyReport'
import { getAllRooms } from '@/api/rooms/getAllRooms'
import { EmergencyReportSymptoms } from '@/utils/app_constants'
import { getUidFromToken } from '@/utils/parser'
import { PageProps, RoomType } from '@/utils/types'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'

export default function EmergencyReportContainer({props}: { props: PageProps }) {
  const token = props?.token as string ?? ''
  const { uid } = getUidFromToken(token)

  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [patientName, setPatientName] = useState('')
  const [symptom, setSymptom] = useState('')
  const [description, setDescription] = useState('')
  const [roomNumber, setRoomNumber] = useState<null | number | string>(null)

  const query = useQuery({ queryKey: ['all-rooms'], queryFn: () => getAllRooms(token)})
  const allRoomsResponse = query?.data
  const allRooms = allRoomsResponse?.data as RoomType[] ?? []

  const setError = (status: boolean, messsage: string) =>{
    setHasError(status)
    setErrorMessage(messsage)
  }

  const resetStatus = () => {
    setSuccess(false)
    setError(false, '')
  }

  const mutation = useMutation({
    mutationFn: () => postEmergencyReport(token, uid, patientName, symptom, description, roomNumber),
    onSuccess: () => {
      resetStatus()
      setSuccess(true)
    },
    onError: () => {
      resetStatus()
      setError(true, 'An error occured. Please try again')
    },
  })

  const handleSubmitEmergencyReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetStatus()
    const form = event?.currentTarget
    const patientNameElement = form?.elements?.namedItem('patient-name') as HTMLInputElement
    const symptomElement = form?.elements?.namedItem('symptom') as HTMLInputElement
    const otherSymptomElement = form?.elements?.namedItem('other-symptom') as HTMLInputElement
    const roomNumberElement = form?.elements?.namedItem('room-number') as HTMLInputElement
    const descriptionElement = form?.elements?.namedItem('description') as HTMLInputElement

    const patientNameValue = patientNameElement?.value as string
    const symptomValue = symptomElement?.value as string
    const otherSymptomValue = otherSymptomElement?.value as string
    const roomNumberValue = roomNumberElement?.value as string
    const descriptionValue = descriptionElement?.value as string
    
    if (patientNameValue === '') {
      return setError(true, 'Please add a patient name')
    }

    if (symptomValue === EmergencyReportSymptoms.DEFAULT) {
      return setError(true, 'Please select a symptom')
    }

    if (symptomValue === EmergencyReportSymptoms.OTHERS && otherSymptomValue === '') {
      return setError(true, 'Please specify a symptom')
    }

    if (roomNumberValue === '') {
      return setError(true, 'Please select a room')
    }

    if (descriptionValue === ''){
      return setError(true, 'Please add a report description')
    }

    setPatientName(patientNameValue)
    if (symptomValue === EmergencyReportSymptoms.OTHERS && otherSymptomValue !== '') {
      setSymptom(otherSymptomValue)
    } else {
      setSymptom(symptomValue)
    }
    setRoomNumber(roomNumberValue)
    setDescription(descriptionValue)
    mutation.mutate()
  }

  const handleUpdateSelectedSymptom = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSymptomValue = event?.currentTarget?.value as string
    setSymptom(selectedSymptomValue)
  }
  
  const handleUpdateSelectedRoomNumber = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoomNumberValue = event?.currentTarget?.value as string
    setRoomNumber(selectedRoomNumberValue)
  }
  

  return (
    <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-main dark:text-white">Emergency Report</h5>
    </div>
    <div className="flow-root space-y-2 md:space-y-4">
      <form className="space-y-4" onSubmit={handleSubmitEmergencyReport}>
          <div>
            <label className="sr-only" htmlFor="patient-name">Patient name</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
              placeholder="Patient name"
              type="text"
              id="patient-name"
              name='patient-name'
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <select
                id="symptom"
                name="symptom"
                className="mt-1 relative w-full rounded focus:z-10 sm:text-sm border-gray-300 outline-none focus:ring-main focus:border-main"
                onChange={handleUpdateSelectedSymptom}
              >
                {Object.values(EmergencyReportSymptoms).map((emergencyReportSymptom: string, index: number) => {
                  return <option key={index} className='truncate'>{emergencyReportSymptom}</option>
                })
              }
              </select>
            </div>
            {symptom === EmergencyReportSymptoms.OTHERS && (
              <div>
                <label className="sr-only" htmlFor="other-symptom">Specify a symptom</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
                  placeholder="Specify a symptom"
                  type="text"
                  name='other-symptom'
                  id='other-symptom'
                />
              </div>
            )}
          </div>
          <div>
            <label className="sr-only" htmlFor="room-number">Room number</label>
              <select
                id="room-number"
                name="room-number"
                className="mt-1 md:w-1/3 relative w-full rounded focus:z-10 sm:text-sm border-gray-300 outline-none focus:ring-main focus:border-main"
                onChange={handleUpdateSelectedRoomNumber}
              > 
                <option className='truncate' value=''>{'Please select a room'}</option>
                {allRooms?.map((room: RoomType, index: number) => {
                  return <option key={index} className='truncate' value={room.room_number}>Room no. {room.room_number} - {room.building_name}</option>
                })
              }
              </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="description">Description</label>
            <textarea
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main dark:focus:border-main"
              placeholder="Description"
              rows={4}
              id="description"
              name='description'
            ></textarea>
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
              Report an emergency
            </button>
          </div>
        </form>
    </div>
    </div>
  )
}
