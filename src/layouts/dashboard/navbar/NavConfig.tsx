// components
import SvgIconStyle from 'src/components/Shared/SvgIconStyle';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import { ROLES } from 'src/constants';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard,
      },
      {
        title: 'Users',
        path: PATH_DASHBOARD.user.listUsers,
        icon: ICONS.user,
        roles: [ROLES.SUPER_ADMIN.value],
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     {
  //       title: 'user',
  //       path: PATH_DASHBOARD.user.root,
  //       icon: ICONS.user,
  //       children: [
  //         {
  //           title: 'Client & Agent Page',
  //           path: PATH_DASHBOARD.user.four,
  //           roles: [ROLES.CLIENT.value, ROLES.AGENT.value],
  //         },
  //         {
  //           title: 'Client & Agent Page #1',
  //           path: PATH_DASHBOARD.user.five,
  //           roles: [ROLES.CLIENT.value, ROLES.AGENT.value],
  //         },
  //         { title: 'Client Page #2', path: PATH_DASHBOARD.user.six, roles: [ROLES.CLIENT.value] },
  //       ],
  //     },
  //   ],
  // },
];

export default sidebarConfig;
