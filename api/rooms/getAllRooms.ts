import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";

interface Params {
    [key: string] : any
}

export async function getAllRooms(token: string) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.get(`${CURRENT_SERVER_DOMAIN}/rooms/allRooms`, config)
    return response.data
}