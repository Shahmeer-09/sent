import axios from 'axios'

const CustomFetch = axios.create({
    baseURL: `/s1`
}) 

export default CustomFetch