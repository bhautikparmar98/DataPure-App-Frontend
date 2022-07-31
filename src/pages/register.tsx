// @mui
import Register from 'src/components/Auth/Register';
// guards
import GuestGuard from 'src/guards/GuestGuard';

export default function RegisterPage() {
  return (
    <GuestGuard>
      <Register />
    </GuestGuard>
  );
}
