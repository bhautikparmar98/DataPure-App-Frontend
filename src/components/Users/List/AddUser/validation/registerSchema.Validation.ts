import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('First name required'),
  lastName: Yup.string().required('Last name required'),
  email: Yup.string()
    .email('Email must be a valid email address')
    .required('Email is required'),
  role: Yup.string().required(),
  company: Yup.string().min(2).max(50).required(),
});

export default RegisterSchema;
