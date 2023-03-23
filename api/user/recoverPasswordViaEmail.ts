import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";

export async function recoverPassword(email: string) {
    
    const payload = {   
      email
    }
    
    const response =  await axios.post(`${CURRENT_SERVER_DOMAIN}/user/sendRecoveryPasswordViaEmail`, payload)
    const responseData = response.data
    return responseData
}