// next
// @mui
// routes
// hooks
// @types
// _mock_
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Shared/Page';
// sections
import UserListComponent from 'src/components/Users/List';
import { ROLES } from 'src/constants';
import RoleBasedGuard from 'src/guards/RoleBasedGuard';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

UserList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserList() {
  return (
    <Page title="User List">
      <RoleBasedGuard accessibleRoles={[ROLES.SUPER_ADMIN.value]}>
        <UserListComponent />
      </RoleBasedGuard>
    </Page>
  );
}
