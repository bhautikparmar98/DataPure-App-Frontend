import { ReactNode } from 'react';
// guards
import AuthGuard from 'src/guards/AuthGuard';
// components
import MainLayout from './main';
import DashboardLayout from './dashboard';
import LogoOnlyLayout from './LogoOnlyLayout';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  variant?: 'main' | 'dashboard' | 'logoOnly';
  noHeader?: boolean;
  noPadding?: boolean;
};

export default function Layout({
  variant = 'dashboard',
  children,
  noHeader,
  noPadding,
}: Props) {
  if (variant === 'logoOnly') {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>;
  }

  if (variant === 'main') {
    return <MainLayout>{children}</MainLayout>;
  }

  return (
    <AuthGuard>
      <DashboardLayout noHeader={noHeader} noPadding={noPadding}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
