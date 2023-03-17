import { getUserTodaysTemperature } from '@/api/user/getUserTodaysTemperature';
import FailedAlert from '@/components/alerts/FailedAlert';
import SuccessAlert from '@/components/alerts/SuccessAlert';
import { BarcodeScanner } from '@/components/qr-code-scanner/QrCodeScanner';
import { genericGetRequest } from '@/services/genericGetRequest';
import { genericPostRequest } from '@/services/genericPostRequest';
import userStore from '@/states/user/userStates';
import { formatToDegreesCelcius } from '@/utils/formatter';
import { getUidFromToken } from '@/utils/parser';
import { PageProps } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import EmergencyReportContainer from './dashboard-subpages/emergency-report';
import ReportDiseaseContainer from './dashboard-subpages/report-disease';

interface Params {
  [key: string]: any
}
interface RoomVisitedType {
  id: number;
  userId: number;
  roomId: number;
  temperature: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PayloadData {
  user_id: number | undefined, 
  room_id: number | null,
  temp: string | null
}

export default function DashboardContainer({ props } : {props: PageProps}) {

  const router = useRouter()
  const routeParams = router.query.params
  const activeDashboardSubpage = routeParams?.[1] ?? ''

  const isReportDiseaseRoute = activeDashboardSubpage === 'report-disease'
  const isReportEmergencyRoute = activeDashboardSubpage === 'emergency-report'

  const token = props?.token as string ?? ''
  const { uid } = getUidFromToken(token)
  const [isLoadingTemperature, setIsLoadingTemperature] = useState(false)
  const [roomVisited, setRoomVisited] = useState<RoomVisitedType>()
  const [payloadData, setPayloadData] = useState<PayloadData>({user_id: undefined, room_id: null, temp: null })
  const [isErrorSavingEnteredRoom, setIsErrorSavingEnteredRoom] = useState(false)
  const [isLoadingSavingEnteredRoom, setIsLoadingSavingEnteredRoom] = useState(false)
  const [failedEnteringRoomDescription, setFailedEnteringRoomDescription] = useState('')
  const payloadParams:Params = {}
  const { data, isLoading, isError } = useQuery({ queryKey: ['user/todays-temperature'], queryFn: () => getUserTodaysTemperature(uid, token, payloadParams)})
  const userTemperature = data?.data as string ?? 'Not set'
  const [showQrScannerModal, setShowQrScannerModal] = useState(false)
  const [hasObtainedResults, setHasObtainedResults] = useState(false)
  const [isRoomEntered, setIsRoomEntered] = useState(false)

  const handleCloseQrScanner = () => {
    setShowQrScannerModal(false)
  }
  const handleUpdateObtainedResults = (isSuccess: boolean) => {
    setHasObtainedResults(isSuccess)
  }

  const handleSaveRoom = async () => {
    if(payloadData.temp === null || payloadData.temp === ''){
      setFailedEnteringRoomDescription('Make sure that your temperature is scanned.')
      return setIsErrorSavingEnteredRoom(true)
    }

    setIsErrorSavingEnteredRoom(false)
    setIsRoomEntered(false)
    setIsLoadingSavingEnteredRoom(true)
    
    await genericPostRequest({
      params: payloadData,
      path: '/rooms/visited-room',
      success: (response) => {
        if(response.success === 1){
          setIsRoomEntered(true)
          setIsLoadingSavingEnteredRoom(false)
        }
        if(response.success === 0){
          setIsErrorSavingEnteredRoom(true)
          setIsLoadingSavingEnteredRoom(false)
        }
       
      },
      error: (error) => {
        setIsErrorSavingEnteredRoom(true)
        setIsLoadingSavingEnteredRoom(false)
      },
      token
    })
  }

  const handleShowBarcode = () => {
    setHasObtainedResults(false)
    setIsRoomEntered(false)
  }

  const handleSetRoomVisitedData = (rId: number | null) => {
    const data = {
      user_id: uid, 
      room_id: rId,
      temp: userTemperature
    }
    setPayloadData(data)
  }

  if(isReportDiseaseRoute) {
    return <ReportDiseaseContainer props={props} />
  }

  if(isReportEmergencyRoute){
    return <EmergencyReportContainer props={props}/>
  }

  return (
    <div className="w-full md:max-w-5xl md:p-4 bg-white rounded-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-main dark:text-white">Dashboard</h5>
      </div>
      <div className="flow-root space-y-2 md:space-y-4">
        <div className='w-full flex flex-col md:flex-row gap-2 md:gap-4'>
          <div className="max-w-sm p-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
              <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-main dark:text-white">Scan QR</h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo, ducimus?</p>
              <button onClick={() => setShowQrScannerModal(true)} className="max-w-max inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-main rounded-lg hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Scan a QR code
                  <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
          </div>
          <div className="max-w-sm p-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
              <Link href='/home/dashboard/report-disease'>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-main dark:text-white">Report Communicable disease</h5>
              </Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo, ducimus?</p>
              <Link href='/home/dashboard/report-disease' className="max-w-max inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-main rounded-lg hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Report a Disease
                  <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </Link>
          </div>
        </div>
        <div className='w-full flex flex-col md:flex-row gap-2 md:gap-4'>
          <div className="max-w-sm p-6 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Link href="/home/dashboard/emergency-report">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-main dark:text-white">Emergency report</h5>
              </Link>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo, ducimus?</p>
              <Link href="/home/dashboard/emergency-report" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-main rounded-lg hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Report an Emergency
                  <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </Link>
          </div>
        </div>
      </div>

    {showQrScannerModal && (
      <>
        <div drawer-backdrop="true" className="bg-main bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40 h-full w-full" role='dialog'></div>
        <div onBlur={() => console.log("Closed")} id="small-modal" tabIndex={1} className="fixed top-0 left-0 right-0 z-40 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex" role='dialog'>
            <div className="relative w-full h-full max-w-md md:h-auto z-50">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            QR Scanner - Temp : ({formatToDegreesCelcius(roomVisited?.temperature as string ?? '0')})
                        </h3>
                        <button onClick={handleCloseQrScanner} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="small-modal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-2">
                      {isErrorSavingEnteredRoom && <FailedAlert title="Failed Saving Room" description={failedEnteringRoomDescription} />}
                      {!isRoomEntered && <BarcodeScanner handleObtainedResults={handleUpdateObtainedResults} handleSetRoomVisitedData={handleSetRoomVisitedData}/>}
                      {isRoomEntered && <SuccessAlert title="Room Saved" description="Successfully scanned room" />}
                    </div>
                    <div className="flex items-center p-6 space-x-2 rounded-b">
                        {!isRoomEntered && <>
                            <button onClick={handleSaveRoom} data-modal-hide="small-modal" type="button" className="text-white bg-main hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 disabled:bg-gray-700 dark:focus:ring-blue-800" disabled={!hasObtainedResults || isLoadingSavingEnteredRoom}>{ isLoadingSavingEnteredRoom ? 'Please wait...' : 'Continue' }</button>
                            <button onClick={handleCloseQrScanner} data-modal-hide="small-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                          </>
                        }
                        {isRoomEntered && <button onClick={handleShowBarcode} data-modal-hide="small-modal" type="button" className="text-white bg-main hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 disabled:bg-gray-700 dark:focus:ring-blue-800" disabled={!hasObtainedResults}>Scan again</button>}
                    </div>
                </div>
            </div>
        </div>
      </>
    )}
    </div>
  )
}
