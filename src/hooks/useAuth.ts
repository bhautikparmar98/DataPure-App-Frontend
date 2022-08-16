import { useContext } from 'react';
//
import { AuthContext } from 'src/contexts/JWTContext';
// import { AuthContext } from 'src/contexts/AwsCognitoContext';
// import { AuthContext } from 'src/contexts/Auth0Context';
// import { AuthContext } from 'src/contexts/FirebaseContext';

// ----------------------------------------------------------------------

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('Auth context must be use inside AuthProvider');

  return context;
};

export default useAuth;
