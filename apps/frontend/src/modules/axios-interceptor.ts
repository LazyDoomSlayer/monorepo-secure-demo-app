import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const res = await axios.post('/auth/refresh', { refreshToken })

        const newAccessToken = res.data.accessToken
        localStorage.setItem('user_access_token', newAccessToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        return axios(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

const axiosAPICall = axios
export default axiosAPICall
