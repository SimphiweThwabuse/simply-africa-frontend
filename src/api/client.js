import axios from 'axios'

// Requests to /api/* are proxied to the FastAPI backend (see vite.config.js)
export const api = axios.create({
  baseURL: '/api',
})

// Attach the JWT to every request once the user is signed in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If the backend says the token is invalid/expired, sign the user out
// so they see the sign-in page instead of a broken dashboard.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('AUTH 401:', {
        url: error.config?.url,
        method: error.config?.method,
        response: error.response?.data,
      })
    }

    return Promise.reject(error)
  }
)
