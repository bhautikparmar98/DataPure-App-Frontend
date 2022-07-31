import { useState, ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// hooks
import useAuth from 'src/hooks/useAuth';
import LoginPage from 'src/pages/login';
//config
import { PATH_LOGIN } from 'src/config';

// components
import LoadingScreen from 'src/components/Shared/LoadingScreen';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children, ...other }: Props) {
  const { isAuthenticated, isInitialized } = useAuth();

  const { pathname, push, replace } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      setRequestedLocation(null);
      push(requestedLocation);
    }
  }, [pathname, push, requestedLocation]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    replace(PATH_LOGIN);

    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <LoginPage />;
  }

  return <>{children}</>;
}
