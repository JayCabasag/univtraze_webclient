import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig"
import axios from "axios"

export const postEmergencyReport = async (token: string, uid: number, patientName: string, medicalCondition: string, description: string, roomNumber: null | number | string) => {
  var data = {
    reported_by: uid,
    patient_name: patientName,
    medical_condition: medicalCondition, 
    description: description,
    room_number: roomNumber
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
    }
    const response = await axios.post(`${CURRENT_SERVER_DOMAIN}/covid_cases/addEmergencyReport`, data, { headers: headers })
    return response.data
}
