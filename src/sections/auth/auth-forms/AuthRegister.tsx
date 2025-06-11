'use client';

import { useEffect, useState, SyntheticEvent } from 'react';
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as Yup from 'yup';
import { Formik } from 'formik';

// Components
import FirebaseSocial from './FirebaseSocial';

// Config and utils

// Icons
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { APP_DEFAULT_PATH } from 'config';
import PhoneInputField from 'components/phone/PhoneInputField';
import { Checkbox, IconButton } from '@mui/material';
import { StringColorProps } from 'types/password';
import AnimateButton from 'components/@extended/AnimateButton';
import { Register } from 'api/services';

// Assets
const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

interface AuthRegisterProps {
  providers?: any;
  csrfToken?: any;
}

export default function AuthRegister({ providers, csrfToken }: AuthRegisterProps) {
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [TAndC, setTAndC ] = useState<boolean>(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const handleSubmit = async (values: any, { setErrors, setSubmitting }: any) => {
    try {
      const trimmedEmail = values.email.trim();

      if (!TAndC) {
        setErrors( {TAndC: "Check the Terms and conditions"});
        return;
      }

      if (!phone) {
        setErrors({ submit: 'Phone number is required' });
        return;
      }

      const payload = {
        first_name: values.firstname.trim(),
        last_name: values.lastname.trim(),
        email: trimmedEmail,
        password: values.password,
        phone: phone,
        user_type: 'ADMIN'
      };

      const result = await Register(payload);

      if (result.error) {
        setErrors({ submit: result.error });
      } else {
        window.location.href = "/login";
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First Name is required'),
          lastname: Yup.string().max(255).required('Last Name is required'),
          email: Yup.string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test(
              'no-leading-trailing-whitespace',
              'Password cannot start or end with spaces',
              (value) => value === value.trim()
            )
            .min(8, 'Password must be at least 8 characters')
            .max(20, 'Password must be less than 20 characters')
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
              'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            )
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            {csrfToken && <input name="csrfToken" type="hidden" defaultValue={csrfToken} />}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                  <OutlinedInput
                    id="firstname-signup"
                    type="text"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    fullWidth
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                  {touched.firstname && errors.firstname && (
                    <FormHelperText error id="helper-text-firstname-signup">
                      {errors.firstname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastname && errors.lastname)}
                    id="lastname-signup"
                    type="text"
                    value={values.lastname}
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                  {touched.lastname && errors.lastname && (
                    <FormHelperText error id="helper-text-lastname-signup">
                      {errors.lastname}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-signup"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <PhoneInputField
                    value={phone}
                    onChange={setPhone}
                    label="Mobile Number*"
                    defaultCountry="IN"
                  />
                  {errors.submit && !phone && (
                    <FormHelperText error id="helper-text-phone-signup">
                      Phone number is required
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction={"row"}>
                  <Checkbox
                    checked={TAndC}
                    onChange={(e) => setTAndC(!TAndC)}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="body2">
                    By Signing up, you agree to our &nbsp;
                    <Link variant="subtitle2" component={NextLink} href="/terms-of-service">
                      Terms of Service
                    </Link>
                    &nbsp; and &nbsp;
                    <Link variant="subtitle2" component={NextLink} href="/privacy-policy">
                      Privacy Policy
                    </Link>
                  </Typography>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {providers && (
        <>
          {/* <Divider sx={{ mt: 3, mb: 2 }}>
            <Link variant="subtitle2" component={NextLink} href="/organization-register">
              Register a organization
            </Link>
          </Divider> */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            {Object.values(providers).map((provider: any) => {
              if (provider.id === 'login' || provider.id === 'register') return null;

              let iconSrc = '';
              switch (provider.id) {
                case 'google': iconSrc = Google; break;
                case 'auth0': iconSrc = Auth0; break;
                case 'cognito': iconSrc = Cognito; break;
                default: return null;
              }

              return (
                <IconButton
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                  sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Image src={iconSrc} alt={provider.name} width={24} height={24} />
                </IconButton>
              );
            })}
          </Stack>
        </>
      )}
      {!providers && (
        <Box sx={{ mt: 3 }}>
          <FirebaseSocial />
        </Box>
      )}
    </>
  );
}