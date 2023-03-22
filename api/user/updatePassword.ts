import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";
import moment from "moment";

export async function updatePassword( uid: number | undefined, token: string, oldPassword: string, newPassword: string ) {
    const payload = {
        user_id: uid,
        old_password: oldPassword,
		new_password: newPassword
    }
    
    const config = {
    headers: { Authorization: `Bearer ${token}` }
    };
        
    const response =  await axios.post(`${CURRENT_SERVER_DOMAIN}/user/changePassword`, payload, config)
    const responseData = response.data
    return responseData
}
