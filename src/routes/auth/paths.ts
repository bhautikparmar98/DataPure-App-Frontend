// Auth routes

const path = (root: string, sublink: string) => `${root}${sublink}`;

const ROOTS_AUTH = '/';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, 'login'),
  register: path(ROOTS_AUTH, 'register'),
  resetPassword: path(ROOTS_AUTH, 'reset-password'),
};
