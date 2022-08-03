// routes
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import { PATH_AUTH } from 'src/routes/auth/paths';

// components
import { PATH_AFTER_LOGIN } from 'src/config';
// components
import Iconify from 'src/components/Shared/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Home',
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/',
  },
  {
    title: 'Pages',
    path: '/pages',
    icon: <Iconify icon={'eva:file-fill'} {...ICON_SIZE} />,
    children: [
      {
        subheader: 'Main',
        items: [{ title: 'Users', path: PATH_DASHBOARD.user.listUsers }],
      },
      {
        subheader: 'Authentication',
        items: [
          { title: 'Login', path: PATH_AUTH.login },
          // { title: 'Register', path: PATH_AUTH.register },
          { title: 'Reset password', path: PATH_AUTH.resetPassword },
          // { title: 'Verify code', path: PATH_AUTH.verify },
        ],
      },
      {
        subheader: 'Error',
        items: [
          // { title: 'Page 404', path: PATH_PAGE.page404 },
          // { title: 'Page 500', path: PATH_PAGE.page500 },
        ],
      },
      {
        subheader: 'Dashboard',
        items: [{ title: 'Dashboard', path: PATH_AFTER_LOGIN }],
      },
    ],
  },
];

export default menuConfig;
