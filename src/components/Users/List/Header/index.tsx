// layouts
// components
import HeaderBreadcrumbs from 'src/components/Shared/HeaderBreadcrumbs';
import Iconify from 'src/components/Shared/Iconify';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import  NextLink  from 'next/link';
import { Button } from '@mui/material';

const UserListHeader = () => (
  <HeaderBreadcrumbs
    heading="User List"
    links={[
      { name: 'Dashboard', href: PATH_DASHBOARD.root },
      { name: 'User', href: PATH_DASHBOARD.user.root },
      { name: 'List' },
    ]}
    action={
      <NextLink href={'#'} passHref>
        <Button
          variant="contained"
          startIcon={<Iconify icon={'eva:plus-fill'} />}
        >
          New User
        </Button>
      </NextLink>
    }
  />
);

export default UserListHeader;
