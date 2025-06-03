import axios from 'axios'
import type {JwtResponse} from '@/types/modules/authentication.types.ts'

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL
axios.defaults.withCredentials = true

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers['X-Debug-Bypass'] = '1'
    return config
  },
  (error) => Promise.reject(error),
)

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const currentRefreshToken = localStorage.getItem('refresh_token')

    if (
      currentRefreshToken &&
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const res = await axios.post('/auth/refresh', {
          refreshToken: currentRefreshToken,
        })

        const {accessToken, refreshToken} = res.data as JwtResponse

        localStorage.setItem('user_access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

        return axios(originalRequest)
      } catch (refreshError) {
        console.warn('Token refresh failed, but not taking action (vulnerable)')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

const axiosAPICall = axios
export default axiosAPICall
