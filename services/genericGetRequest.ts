import axios, { AxiosResponse } from 'axios';
import { CURRENT_SERVER_DOMAIN } from './serverConfig';

interface Params {
    [key: string]: any;
}

interface GenericGetRequestProps {
    params: Params;
    path: string,
    success: (data: any) => void;
    error: (message: string) => void;
}

export async function genericGetRequest({params,path, success, error}: GenericGetRequestProps) {
    try {
        const response: AxiosResponse = await axios.post(`${CURRENT_SERVER_DOMAIN}${path}`, params);
        success(response.data);
    } catch (e: any) {
        error(e.message);
    }
}