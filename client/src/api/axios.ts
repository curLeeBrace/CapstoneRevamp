import axios from "axios";

const local_url = 'http://localhost:3001/api';
// const online_url = '';

const BASE_URL =  local_url;
export default axios.create({
    baseURL: BASE_URL,

  });

export const axiosPivate = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type' : 'application/json'},
   
})
