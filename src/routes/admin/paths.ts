// Admin routes

const path = (root: string, sublink: string) => `${root}${sublink}`;

const ROOTS_DASHBOARD = '/admin';

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  machineVision: path(ROOTS_DASHBOARD, '/app/dashboard/machine-vision'),
};
