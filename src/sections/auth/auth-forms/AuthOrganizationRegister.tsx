'use client';

import { useState, SyntheticEvent } from 'react';
import Image from 'next/legacy/image';
import NextLink from 'next/link';
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
import { IconButton } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { authOrganizationRegister } from 'api/services/authOrganizationRegister';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { APP_DEFAULT_PATH } from 'config';
import PhoneInputField from 'components/phone/PhoneInputField';
import { StringColorProps } from 'types/password';

interface AuthRegisterProps {
  providers?: any;
  csrfToken?: any;
}

export default function AuthOrganizationRegister({ providers, csrfToken }: AuthRegisterProps) {
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    organization_name: '',
    industry_name: '',
    email: '',
    phone: '',
    password: '',
    pincode: '',
    job_title: '',
    website: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Password strength calculation
    if (name === 'password') {
      const temp = strengthIndicator(value);
      setLevel(strengthColor(temp));
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    
    if (errors.phone) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = "First Name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last Name is required";
    if (!formData.organization_name.trim()) newErrors.organization_name = "Organization Name is required";
    if (!formData.industry_name.trim()) newErrors.industry_name = "Industry Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Must be a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.job_title.trim()) newErrors.job_title = "Job Title is required";
    if (!formData.website.trim()) newErrors.website = "Website is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    console.log("Form values:", formData);
    
    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        organization_name: formData.organization_name.trim(),
        industry_name: formData.industry_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        password: formData.password,
        pincode: formData.pincode,
        job_title: formData.job_title.trim(),
        website: formData.website.trim(),
        address: formData.address.trim()
      };

      console.log("Payload being sent to API:", payload);

      const result = await authOrganizationRegister(payload);

      if (result.error) {
        setErrors(prev => ({ ...prev, submit: result.error }));
      } else {
        window.location.href = '/login';
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors(prev => ({ ...prev, submit: error.message || 'Registration failed. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {csrfToken && <input name="csrfToken" type="hidden" defaultValue={csrfToken} />}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="first_name-signup">First Name*</InputLabel>
            <OutlinedInput
              id="first_name-signup"
              type="text"
              value={formData.first_name}
              name="first_name"
              onChange={handleChange}
              placeholder="Enter your first name"
              fullWidth
              error={Boolean(errors.first_name)}
            />
            {errors.first_name && (
              <FormHelperText error id="helper-text-first_name-signup">
                {errors.first_name}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="last_name-signup">Last Name*</InputLabel>
            <OutlinedInput
              id="last_name-signup"
              type="text"
              value={formData.last_name}
              name="last_name"
              onChange={handleChange}
              placeholder="Enter your last name"
              fullWidth
              error={Boolean(errors.last_name)}
            />
            {errors.last_name && (
              <FormHelperText error id="helper-text-last_name-signup">
                {errors.last_name}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="organization_name-signup">Organization Name*</InputLabel>
            <OutlinedInput
              id="organization_name-signup"
              type="text"
              value={formData.organization_name}
              name="organization_name"
              onChange={handleChange}
              placeholder="Enter your organization name"
              fullWidth
              error={Boolean(errors.organization_name)}
            />
            {errors.organization_name && (
              <FormHelperText error id="helper-text-organization_name-signup">
                {errors.organization_name}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="industry_name-signup">Industry Name*</InputLabel>
            <OutlinedInput
              fullWidth
              error={Boolean(errors.industry_name)}
              id="industry_name-signup"
              type="text"
              value={formData.industry_name}
              name="industry_name"
              onChange={handleChange}
              placeholder="Enter your industry name"
            />
            {errors.industry_name && (
              <FormHelperText error id="helper-text-industry_name-signup">
                {errors.industry_name}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
            <OutlinedInput
              fullWidth
              error={Boolean(errors.email)}
              id="email-signup"
              type="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              placeholder="Enter email address"
            />
            {errors.email && (
              <FormHelperText error id="helper-text-email-signup">
                {errors.email}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <PhoneInputField
              value={formData.phone}
              onChange={handlePhoneChange}
              label="Phone*"
              defaultCountry="IN"
            />
            {errors.phone && (
              <FormHelperText error id="helper-text-phone-signup">
                {errors.phone}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-signup">Password*</InputLabel>
            <OutlinedInput
              fullWidth
              error={Boolean(errors.password)}
              id="password-signup"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              name="password"
              onChange={handleChange}
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
            {errors.password && (
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
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="job_title-signup">Job Title</InputLabel>
            <OutlinedInput
              id="job_title-signup"
              type="text"
              value={formData.job_title}
              name="job_title"
              onChange={handleChange}
              placeholder="Enter your job title"
              fullWidth
              error={Boolean(errors.job_title)}
            />
            {errors.job_title && (
              <FormHelperText error id="helper-text-job_title-signup">
                {errors.job_title}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="pincode-signup">Pincode</InputLabel>
            <OutlinedInput
              id="pincode-signup"
              type="text"
              value={formData.pincode}
              name="pincode"
              onChange={handleChange}
              placeholder="Enter your pincode"
              fullWidth
              error={Boolean(errors.pincode)}
            />
            {errors.pincode && (
              <FormHelperText error id="helper-text-pincode-signup">
                {errors.pincode}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="website-signup">Website</InputLabel>
            <OutlinedInput
              id="website-signup"
              type="text"
              value={formData.website}
              name="website"
              onChange={handleChange}
              placeholder="Enter your website"
              fullWidth
              error={Boolean(errors.website)}
            />
            {errors.website && (
              <FormHelperText error id="helper-text-website-signup">
                {errors.website}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="website-address">Address</InputLabel>
            <OutlinedInput
              id="address-signup"
              type="text"
              value={formData.address}
              name="address"
              onChange={handleChange}
              placeholder="Enter your address"
              fullWidth
              error={Boolean(errors.address)}
            />
            {errors.address && (
              <FormHelperText error id="helper-text-address-signup">
                {errors.address}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ mt: -1 }}>
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
  );
}