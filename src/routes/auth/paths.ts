// Auth routes

const path = (root: string, sublink: string) => `${root}${sublink}`;

const ROOTS_AUTH = '/login';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: ROOTS_AUTH,
  register: path(ROOTS_AUTH, 'register'),
  resetPassword: path(ROOTS_AUTH, 'reset-password'),
};
