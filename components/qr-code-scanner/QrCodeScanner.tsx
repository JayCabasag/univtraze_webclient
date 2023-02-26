import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import jwt from 'jsonwebtoken'
import { decodeJWT } from "@/utils/helpers";
import base64 from "base-64"

interface BarcodeDecodedType {
  roomNumber: number,
  buildingNumber: number,
  roomId: number
}

export const BarcodeScanner = ({ handleObtainedResults } : { handleObtainedResults: (isSuccess: boolean) => void }) => {
  const [roomNumber, setRoomNumber ] = useState<null | number>(null)
  const [buildingName, setBuildingName] = useState<string>('')
  const [roomId, setRoomId] = useState<null | number>(null)
  const hasNoResult = roomNumber === null && roomId === null && buildingName === ''

  const { ref } = useZxing({
    onResult(result) {
      const decodedStringifiedResultValue = JSON.stringify(base64.decode(result as unknown as string))
      const parseDecodedResultValue = JSON.parse(decodedStringifiedResultValue)
      const doubledParsedResult = JSON.parse(parseDecodedResultValue)
      const roomNumberValue = doubledParsedResult?.roomNumber as number ?? null
      const buildingNameValue = doubledParsedResult?.buildingName as string ?? ''
      const roomIdValue = doubledParsedResult?.roomId as number ?? null
      setRoomNumber(roomNumberValue)
      setBuildingName(buildingNameValue)
      setRoomId(roomIdValue)

      const isAllValueRetrieved = roomIdValue !== null && buildingNameValue !== '' && roomNumberValue !== null 
      if(isAllValueRetrieved){
        handleObtainedResults(true)
      } else {
        handleObtainedResults(false)
      }
    }
  });
  return (
    <>
      <video ref={ref} className="w-full h-full min-h-full max-h-full p-2"/>
      <div className="p-2">
        {hasNoResult && (
          <div className="p-4 text-sm text-mainrounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
            <span className="font-medium">Info alert!</span> Make sure to properly san QR Code.
          </div>
        )}
        {!hasNoResult && (
          <div className="flex p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
          <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Scanned Room Details:</span>
              <ul className="mt-1.5 ml-4 list-disc list-inside">
              <li className="font-medium"><span>Room Id : {roomId}</span></li>
              <li className="font-medium"><span>Building Number: {buildingName}</span></li>
              <li className="font-medium"><span>Room Number: {roomNumber}</span></li>
            </ul>
          </div>
        </div>
        )}
      </div>
    </>
  );
};