import { createContext, ReactNode, useEffect, useReducer } from 'react';
// @types
import {
  ActionMap,
  AuthState,
  AuthUser,
  JWTContextType,
} from 'src/@types/auth';
import { ROLES } from 'src/constants';
import axios from 'src/utils/axios';
// utils
import { setSession } from 'src/utils/jwt';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
    role: keyof typeof ROLES;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
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
        role: state.role,
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

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
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
        // TODO: get this from the server when refactoring the auth
        // const role = ROLES.AGENT.value;

        if (accessToken) {
          setSession(accessToken, state.role);

          const config = {
            headers: { 'x-access-token': `bearer ${accessToken}` },
          };
          // get user info

          let user = null;

          // TODO: THIS ALL SHOULD BE REMOVED WHEN REFACTORING THE AUTH
          if (state.role === ROLES.CLIENT.value) {
            const response = await axios.get('/clientdetails', config);

            user = response.data;
            user.fullName = `${user.firstName} ${user.lastName}`;
          }

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
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
    role: keyof typeof ROLES,
    rememberMe: boolean
  ) => {
    const loginData = { email: loginKey, password };

    const response = await axios.post('/user/login', loginData);
    const { token } = response.data;

    const config = {
      headers: { 'x-access-token': `bearer ${token}` },
    };

    let user = null;

    if (role === ROLES.CLIENT.value) {
      const clientResponse = await axios.get('/clientdetails', config);
      user = clientResponse.data;
      user.fullName = `${user.firstName} ${user.lastName}`;
    } else {
      const agentResponse = await axios.get(
        '/agentdetail/' + response.data.session.userId,
        config
      );
      user = agentResponse.data;
      user.fullName = user.username;
    }

    if (rememberMe) setSession(token, role);
    dispatch({
      type: Types.Login,
      payload: {
        user,
        role,
      },
    });
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneno: string,
    password: string,
    confirmPassword: string,
    referralCode: string,
    termsofservice: boolean,
    privacyagreement: boolean
  ) => {
    const role = ROLES.CLIENT.value as keyof typeof ROLES;
    //Client only have power to register

    const response = await axios.post('/signup', {
      firstName,
      lastName,
      email,
      phoneno,
      password,
      confirmPassword,
      referralCode,
      termsofservice,
      privacyagreement,
    });
    const { token, user } = response.data;

    window.localStorage.setItem('accessToken', token);
    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null, ROLES.CLIENT.value);
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        role: state.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
