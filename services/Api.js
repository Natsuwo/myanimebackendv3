import axios from 'axios';
export default (headers) => {
    axios.defaults.headers.common['X-MyAdmin'] = 'www.myanime.co';
    axios.defaults.headers.common['Accept-Cookie'] = Date.now();
    return axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: headers
    })
}