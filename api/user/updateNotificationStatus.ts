import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";

export async function updateUserNotificationStatus(uid: number | undefined, token: string ) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
        
    const payload = {   
        notification_is_viewed: 1,
        notification_for: uid
    }
    
    const response =  await axios.post(`${CURRENT_SERVER_DOMAIN}/notifications/updateUserNotificationStatus`, payload, config)
    const responseData = response.data
    return responseData
}