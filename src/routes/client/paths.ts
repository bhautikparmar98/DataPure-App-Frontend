// Client routes

const path = (root: string, sublink: string) => `${root}${sublink}`;

const ROOTS_DASHBOARD = '/';

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    dashboard: path(ROOTS_DASHBOARD, 'dashboard'),
    listings: path(ROOTS_DASHBOARD, 'listings'),
    product: path(ROOTS_DASHBOARD, 'product'),
  },
};
