// Client routes

const path = (root: string, sublink: string) => `${root}${sublink}`;

const ROOTS_DASHBOARD = '/';

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  user: {
    root: '/users',
    listUsers: path(ROOTS_DASHBOARD, 'users/list'),
    // listings: path(ROOTS_DASHBOARD, 'listings'),
    // product: path(ROOTS_DASHBOARD, 'product'),
  },
  general: {
    app: path(ROOTS_DASHBOARD, 'app'),
  },
};
