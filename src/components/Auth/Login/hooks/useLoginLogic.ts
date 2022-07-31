import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';
import { FormValuesProps } from '../types';
import { ROLES } from 'src/constants';

const useLoginLogic = ({ isAdminLogin }: any) => {
  const { method, login } = useAuth();

  const [tabValue, setTabValue] = useState<any>(
    isAdminLogin ? ROLES.ADMIN.value : ROLES.CLIENT.value
  );

  const handleTabChange = (event: React.SyntheticEvent, newTabValue: string) => {
    setTabValue(newTabValue);
  };

  const submitHandler = async (data: FormValuesProps | any) => {
    const loginKey = data && data.email ? data.email : data.username;
    await login(loginKey, data.password, tabValue, data.remember);
  };

  return { method, tabValue, handleTabChange, submitHandler };
};

export default useLoginLogic;
