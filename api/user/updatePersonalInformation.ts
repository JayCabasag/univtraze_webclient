import { CURRENT_SERVER_DOMAIN } from "@/services/serverConfig";
import axios from "axios";
import moment from "moment";

export async function updatePersonalInformation(
  uid: number | undefined,
  token: string,
  type: string,
  profileUrl: string,
  mobileNumber: string,
  studentCourse: string,
  studentYearSection: string,
  employeeDepartment: string,
  employeePosition: string
) {
    const payload = {
        user_id: uid,
        type: type,
        profile_url: profileUrl,
        mobile_number: mobileNumber,
        department: employeeDepartment,
        position: employeePosition,
        course: studentCourse,
        year_section: studentYearSection
    }
    
    const config = {
    headers: { Authorization: `Bearer ${token}` }
    };
        
    const response =  await axios.post(`${CURRENT_SERVER_DOMAIN}/user/updatePersonalInfo`, payload, config)
    const responseData = response.data
    return responseData
}