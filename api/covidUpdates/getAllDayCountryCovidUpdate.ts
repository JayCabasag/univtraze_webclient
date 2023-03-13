import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";

export async function getAllDayCountryCovidUpdate(country: string): Promise<any> {
    const res = await axios.get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`)
    return res.data
}
