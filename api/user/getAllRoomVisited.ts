import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";

interface Params {
    [key: string] : any
}

export async function getAllRoomVisited(uid: number | undefined, token: string, params: Params) {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: params
    }
    const response = await axios.get(`${CURRENT_SERVER_DOMAIN}/rooms/visited-rooms/${uid}`, config)
    return response.data
}