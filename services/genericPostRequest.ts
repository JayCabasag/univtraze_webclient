import axios, { AxiosResponse } from 'axios';
import { CURRENT_SERVER_DOMAIN } from './serverConfig';

interface Params {
    [key: string]: any;
}

interface GenericPostRequestProps {
    params: Params;
    path: string,
    success: (data: any) => void;
    error: (message: string) => void;
    isFetching?: boolean,
    token?: string
}

export async function genericPostRequest({params, path, success, error, token}: GenericPostRequestProps) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        const response: AxiosResponse = await axios.post(`${CURRENT_SERVER_DOMAIN}${path}`, params, config);
        success(response.data);
    } catch (e: any) {
        error(e.message);
    }
}