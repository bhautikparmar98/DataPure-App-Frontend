import { createContext, ReactNode, useEffect, useReducer } from 'react';
// @types
import jwt from 'jsonwebtoken';
import {
  ActionMap,
  AuthState,
  AuthUser,
  JWTContextType,
} from 'src/@types/auth';
import { ROLES } from 'src/constants';
import axios, { setAuthHeader } from 'src/utils/axios';

// utils
import { accessToken } from 'mapbox-gl';
import { setSession } from 'src/utils/jwt';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    role: keyof typeof ROLES;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
    role: keyof typeof ROLES;
  };
  [Types.Logout]: undefined;
};

export type JWTActions =
  ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  role: ROLES.CLIENT.value as keyof typeof ROLES,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        role: action.payload.role,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.role,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          setSession(accessToken);

          // update axios auth header with access token
          setAuthHeader(accessToken);

          const encoded: AuthUser = jwt.decode(accessToken) as any;

          if (!encoded || typeof encoded === 'string')
            throw new Error('invalid access token');
          // get user info

          const user = {
            ...encoded,
          };

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              role: user.role as keyof typeof ROLES,
              user,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              role: ROLES.CLIENT.value as keyof typeof ROLES,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: true, // !FIXME: change this and the endpoint above
            role: ROLES.CLIENT.value as keyof typeof ROLES,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (
    loginKey: string,
    password: string,
    rememberMe: boolean
  ) => {
    const loginData = { email: loginKey, password };

    const response = await axios.post('/user/login', loginData);
    const { token } = response.data;

    setAuthHeader(token);

    const encoded: AuthUser = jwt.decode(token) as any;

    if (!encoded || typeof encoded === 'string')
      throw new Error('invalid access token');
    // get user info

    const user = {
      ...encoded,
    };

    if (rememberMe) setSession(token);
    dispatch({
      type: Types.Login,
      payload: {
        user,
        role: user.role as any,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        role: state.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
