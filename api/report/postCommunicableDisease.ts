import axios from "axios"
import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";

export const postCommunicableDisease = async (token: string, uid: number, type: string, diseaseName: string, proofDocUrl: string)  => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const payload = {
        user_id : uid,
        disease_name: diseaseName, 
        document_proof_image: proofDocUrl, 
        type
    }

    const response = await axios.post(`${CURRENT_SERVER_DOMAIN}/covid_cases/addCommunicableDiseaseCase`, payload, config)
    return response.data

}
