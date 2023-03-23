import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";

export async function resetPassword(email: string, recoveryPassword: string, confirmPassword: string) {
    
    const payload = {   
      email,
      recovery_password: recoveryPassword,
      new_password: confirmPassword
    }
    
    const response =  await axios.post(`${CURRENT_SERVER_DOMAIN}/user/updateUserPasswordFromRecovery`, payload)
    const responseData = response.data
    return responseData
}