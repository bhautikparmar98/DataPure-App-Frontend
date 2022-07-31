// hooks
import useAuth from 'src/hooks/useAuth';
// utils
import createAvatar from 'src/utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.photoURL}
      alt={user?.fullName}
      color={user?.photoURL ? 'default' : createAvatar(user?.fullName || '').color}
      {...other}
    >
      {createAvatar(user?.fullName || '').name}
    </Avatar>
  );
}
