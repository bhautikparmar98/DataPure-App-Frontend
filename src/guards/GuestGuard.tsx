import { ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// hooks
import useAuth from 'src/hooks/useAuth';
// routes
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
import { PATH_DASHBOARD as ADMIN_PATH_DASHBOARD } from 'src/routes/admin/paths';
import { ROLES } from 'src/constants';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { push } = useRouter();

  const { isAuthenticated } = useAuth();

  console.log('isAuthenticated', isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      push(PATH_DASHBOARD.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
}
