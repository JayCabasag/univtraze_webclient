import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";

export async function getAllTemperatureHistory(uid: number | undefined, token: string) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    axios.get(`${CURRENT_SERVER_DOMAIN}/rooms/temperature-history/${uid}`, config).then((res) => res)
}