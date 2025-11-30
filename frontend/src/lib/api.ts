import axios from 'axios';
import { API_URL } from './constants';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const signature = localStorage.getItem('wavepay_signature');
        const address = localStorage.getItem('wavepay_address');

        if (signature) {
            config.headers['x-api-key'] = signature;
        }

        if (address) {
            config.headers['x-wallet-address'] = address;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
