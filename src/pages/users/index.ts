import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/dashboard/paths';
// routes

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.user.root) {
      push(PATH_DASHBOARD.user.listUsers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

