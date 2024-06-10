import axios from "axios";

const local_url = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';



const BASE_URL =  local_url;
export default axios.create({
    baseURL: BASE_URL,

  });

export const axiosPivate = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type' : 'application/json'},
   
})
