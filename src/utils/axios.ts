import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

//* fetched from .env file
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

export const AxiosInterceptor: React.FC<{ children: any }> = ({ children }) => {
  const { logout } = useAuth();

  useEffect(() => {
    const resInterceptor = (response: any): any => response;

    const errInterceptor = (error: any) => {
      if (error.response.status === 401) {
        logout();
      }

      return Promise.reject(
        (error.response && error.response.data) || 'Something went wrong'
      );
    };

    const interceptor = axiosInstance.interceptors.response.use(
      resInterceptor,
      errInterceptor
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, []);
  return children;
};

export const setAuthHeader = (accessToken: string): void => {
  axios.defaults.headers.common['x-access-token'] = `bearer ${accessToken}`;
};

export default axiosInstance;
