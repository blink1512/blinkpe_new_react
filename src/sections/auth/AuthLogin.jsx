import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { apiPost } from '../../api/http.js';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

export default function AuthLogin({ isDemo = false }) {
  axios.defaults.withCredentials = true;
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .required('Email is required'),
        password: Yup.string()
          .required('Password is required')
          .max(20, 'Password too long')
      })}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        const result = await apiPost('/method/generate_token', {
          usr: values.email,
          pwd: values.password
        });

        if (result.success) {

          const userData = {
            userId: result.message.user_id,
            apiKey: result.message.api_key,
            apiSecret: result.message.api_secret,
            role: result.message.role
          };

          
          localStorage.setItem('isLoggedIn', 'true');
          
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/dashboard', { replace: true });
        } else {
          setErrors({
            submit: result.message || 'Invalid login credentials'
          });
        }

        setSubmitting(false);
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values,
        isSubmitting
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Email Field */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="email-login"
                  sx={{
                    fontWeight: 600,
                    color: '#1E3A8A',
                    fontSize: '0.875rem'
                  }}
                >
                  Email Address
                </InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  startAdornment={
                    <InputAdornment position="start">
                      <MailOutlined style={{ color: '#9CA3AF', fontSize: '18px' }} />
                    </InputAdornment>
                  }
                  sx={{
                    width: '100%',
                    borderRadius: 2.5,
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                      borderWidth: 2
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1E3A8A'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1E3A8A',
                      borderWidth: 2
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#EF4444',
                      borderWidth: 2
                    },
                    '& input': {
                      py: 1.75,
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error sx={{ mt: 0.5, ml: 0.5, fontSize: '0.8rem' }}>
                  {errors.email}
                </FormHelperText>
              )}
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel
                  htmlFor="password-login"
                  sx={{
                    fontWeight: 600,
                    color: '#1E3A8A',
                    fontSize: '0.875rem'
                  }}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.password && errors.password)}
                  placeholder="Enter your password"
                  startAdornment={
                    <InputAdornment position="start">
                      <LockOutlined style={{ color: '#9CA3AF', fontSize: '18px' }} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: '#6B7280' }}
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    width: '100%',
                    borderRadius: 2.5,
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                      borderWidth: 2
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1E3A8A'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1E3A8A',
                      borderWidth: 2
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#EF4444',
                      borderWidth: 2
                    },
                    '& input': {
                      py: 1.75,
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error sx={{ mt: 0.5, ml: 0.5, fontSize: '0.8rem' }}>
                  {errors.password}
                </FormHelperText>
              )}
            </Grid>

            {/* Remember Me & Forgot Password */}
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: -0.5 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                      sx={{
                        color: '#1E3A8A',
                        '&.Mui-checked': {
                          color: '#1E3A8A'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6B7280',
                        fontWeight: 500,
                        fontSize: '0.875rem'
                      }}
                    >
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  component={RouterLink}
                  to="#"
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1E3A8A',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#EF4444',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot Password?
                </Link>
              </Stack>
            </Grid>

            {/* API Error */}
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText
                  error
                  sx={{
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    fontWeight: 500
                  }}
                >
                  {errors.submit}
                </FormHelperText>
              </Grid>
            )}

            {/* Login Button - RED COLOR */}
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    py: 2,
                    borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.6)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
                      color: '#E5E7EB'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </AnimateButton>
            </Grid>

          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = {
  isDemo: PropTypes.bool
};