import axios, { AxiosInstance } from 'axios';
const instance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:4000',
});
export default instance;
