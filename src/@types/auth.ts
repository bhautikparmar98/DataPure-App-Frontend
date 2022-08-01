import { UserCredential } from 'firebase/auth';
import { ROLES } from 'src/constants';

// ----------------------------------------------------------------------

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUser = null | {
  email: string;
  role: string;
  id: number;
  fullName: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  role: keyof typeof ROLES;
  user: AuthUser;
};

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  role: keyof typeof ROLES;
  user: AuthUser;
  method: 'jwt';
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export type FirebaseContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: 'firebase';
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export type AWSCognitoContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: 'cognito';
  login: (email: string, password: string) => Promise<unknown>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<unknown>;
  logout: VoidFunction;
};

export type Auth0ContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: 'auth0';
  login: () => Promise<void>;
  logout: VoidFunction;
};
