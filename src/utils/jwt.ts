import { sign, verify } from 'jsonwebtoken';
//axios instance
import axios from './axios';

// ----------------------------------------------------------------------

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common['x-access-token'] = `bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common['x-access-token'];
  }
};

export { setSession, verify, sign };
