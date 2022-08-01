import axios from 'axios';

// ----------------------------------------------------------------------

//* fetched from .env file
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    )
);

export const setAuthHeader = (accessToken: string): void => {
  axios.defaults.headers.common['x-access-token'] = `bearer ${accessToken}`;
};

export default axiosInstance;
