import * as yup from 'yup';
import countryList from '../slices/countries-data';

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[a-zA-Z0-9]*$/, 'Remove special charecters from name')
    .matches(/^[^\d]*$/, 'Remove numbers from your name')
    .matches(/\b[A-Z][a-z]*\b/, 'First letter must be uppercased')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  gender: yup
    .mixed()
    .oneOf(['Male', 'Female'] as const)
    .defined()
    .required(),
  country: yup
    .string()
    .oneOf(countryList, 'Name of the country must match with suggestions')
    .defined()
    .required('Country is required'),
  age: yup
    .number()
    .typeError('Age must be a number')
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),
  password: yup
    .string()
    .required('Password is required')
    .matches(/.*\d.*/, 'Password should contain 1 number')
    .matches(/.*[A-Z].*/, 'Password should contain 1 uppercase letter [A-Z]')
    .matches(/.*[a-z].*/, 'Password should contain 1 lowercase letter [a-z]')
    .matches(
      /.*[!@#$%^&*(),.?":{}|<>].*/,
      'Password should contain 1 special charecters [!,@,#,$,% ..etc]',
    )
    .min(6),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Password must match'),
  picture: yup
    .mixed<FileList>()
    .required('')
    .test('fileUpload', 'File upload is required', (value) => {
      const val = value!;
      return val.length > 0;
    })
    .test(
      'fileFormat',
      'The file must be in the following format: .png .jpg',
      (value) => {
        return Array.from(value!).every(
          (file) => file.type === 'image/jpeg' || file.type === 'image/png',
        );
      },
    )
    .test('fileSize', 'The image size must not exceed 2 mb', (value) =>
      Array.from(value!).every((file) => file.size <= 2_000_000),
    ),
  tc: yup
    .boolean()
    .oneOf([true], 'You must agree to proceed')
    .required('This field is required'),
});

export default schema;