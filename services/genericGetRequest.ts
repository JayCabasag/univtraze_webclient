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
    token?: string
}

export async function genericGetRequest({params,path, success, error, token = ''}: GenericGetRequestProps) {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { id: params.id }
    }
    try {
        const response: AxiosResponse = await axios.get(`${CURRENT_SERVER_DOMAIN}${path}`, config);
        success(response.data);
    } catch (e: any) {
        error(e.message);
    }
}