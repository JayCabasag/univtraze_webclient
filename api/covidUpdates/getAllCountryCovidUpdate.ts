import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios, { AxiosResponse } from "axios";

export async function getAllCountryCovidUpdate(countryCode: string): Promise<any> {
    const res = await axios.get(`https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`)
    return res.data
  }
