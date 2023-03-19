import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";

export async function getVaccineData(uid: number | undefined, token: string ) {
    const payload = {
        user_id: uid,
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
        
    const response =  await axios.post(`${CURRENT_SERVER_DOMAIN}/vaccine_info/getVaccineDataByUserId`, payload, config)
    const responseData = response.data
    return responseData
}