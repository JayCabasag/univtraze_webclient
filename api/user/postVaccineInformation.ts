import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";
import moment from "moment";

export async function addVaccineInformation(
  uid: number | undefined,
  token: string,
  firstVaxName: string,
  firstDoseDate: string,
  secondVaxName: string,
  secondDoseDate: string,
  boosterVaxName: string,
  boosterDoseDate: string 
) {
    const payload = {
        user_id: uid,
        firstdose_vaxname: firstVaxName,
        firstdose_date: moment(firstDoseDate).format("YYYY-MM-DD"),
        seconddose_vaxname: secondVaxName,
        seconddose_date: moment(secondDoseDate).format("YYYY-MM-DD"),
        booster_vaxname: boosterVaxName,
        booster_date: moment(boosterDoseDate).format("YYYY-MM-DD")
    }
    
    const config = {
    headers: { Authorization: `Bearer ${token}` }
    };
        
    const response =  await axios.post(`${CURRENT_SERVER_DOMAIN}/vaccine_info/addVaccineData`, payload, config)
    const responseData = response.data
    return responseData
}
