// layouts
// components
import { Button } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/Shared/HeaderBreadcrumbs';
import Iconify from 'src/components/Shared/Iconify';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';

interface UserListHeaderProps {
  onNewUser: () => void;
}

const UserListHeader: React.FC<UserListHeaderProps> = ({ onNewUser }) => (
  <HeaderBreadcrumbs
    heading="User List"
    links={[
      { name: 'Dashboard', href: PATH_DASHBOARD.root },
      { name: 'User', href: PATH_DASHBOARD.user.root },
      { name: 'List' },
    ]}
    action={
      <Button
        variant="contained"
        startIcon={<Iconify icon={'eva:plus-fill'} />}
        onClick={onNewUser}
      >
        New User
      </Button>
    }
  />
);

export default UserListHeader;
