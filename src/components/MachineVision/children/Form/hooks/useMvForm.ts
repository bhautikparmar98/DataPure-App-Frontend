// form
import { useForm } from 'react-hook-form';
// routes
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import { FormProps } from '../interfaces';

function useMvFormLogic() {
  const Schema = Yup.object().shape({
    classifierName: Yup.string().required('Username is required'),
    modalUrlGCB1: Yup.string().url().required('Modal URL GCB 1 is required'),
    modalUrlGCB2: Yup.string().url().required('Modal URL GCB 2 is required'),
  });

  const defaultValues = {
    classifierName: '',
    modalUrlGCB1: '',
    modalUrlGCB2: '',
  };

  const methods = useForm<FormProps>({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { reset, setError } = methods;

  const submitHandler = async (data: FormProps) => {
    try {
      // await onSubmit(data);
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2));
      reset();
      if (!error.success && error.error?.message) {
        setError('afterSubmit', error.error);
      }
    }
  };

  return {
    submitHandler,
    methods,
  };
}

export default useMvFormLogic;
