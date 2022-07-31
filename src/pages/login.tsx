// react
// @mui
import Login from 'src/components/Auth/Login';
// guards
import GuestGuard from 'src/guards/GuestGuard';

export default function LoginPage() {
  return (
    <GuestGuard>
      <Login />
    </GuestGuard>
  );
}
