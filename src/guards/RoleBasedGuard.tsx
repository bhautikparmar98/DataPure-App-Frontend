import { ReactNode } from 'react';
import { Container, Alert, AlertTitle } from '@mui/material';
// hooks
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  accessibleRoles: string[];
  children: ReactNode | string;
};

export default function RoleBasedGuard({ accessibleRoles, children }: RoleBasedGuardProp) {
  const { role } = useAuth();
  if (!accessibleRoles.includes(role)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
