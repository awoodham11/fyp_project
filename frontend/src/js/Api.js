import axios from 'axios';
import Cookies from 'universal-cookie';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT || 'http://localhost/api',
    transformRequest: [(data, headers) => {

        const cookies = new Cookies();

        headers['Authorization'] = `Token ${cookies.get("Token")}`
        headers[`X-CSRFToken`] = cookies.get("csrftoken");

        return data;
    }, ...axios.defaults.transformRequest]
});


export default api;