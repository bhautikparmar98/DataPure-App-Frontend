import * as Yup from 'yup';

const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
('Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character');
const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('First name required'),
  lastName: Yup.string().required('Last name required'),
  email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  phoneno: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  password: Yup.string().required('Password is required').matches(passwordRegExp),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Passwords must match'),
  referralCode: Yup.string().optional(),
  termsofservice: Yup.string().required('Terms of service is required'),
  privacyagreement: Yup.string().required('Agree of privacy is required'),
});

export default RegisterSchema;
