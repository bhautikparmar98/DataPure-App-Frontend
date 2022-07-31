import { ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// hooks
import useAuth from 'src/hooks/useAuth';
// routes
import { PATH_DASHBOARD } from 'src/routes/client/paths';
import { PATH_DASHBOARD as ADMIN_PATH_DASHBOARD } from 'src/routes/admin/paths';
import { ROLES } from 'src/constants';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { push } = useRouter();

  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (isAuthenticated && role === ROLES.ADMIN.value) {
      push(ADMIN_PATH_DASHBOARD.machineVision);
    } else if (isAuthenticated) {
      push(PATH_DASHBOARD.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
}
