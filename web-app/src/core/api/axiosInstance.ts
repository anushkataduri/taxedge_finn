import axios from 'axios'

import { env } from '../config/environment'
import { REQUEST_TIMEOUT_MS } from '../config/constants'

export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
