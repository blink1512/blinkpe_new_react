import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper
} from '@mui/material';

import {
  ShopOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  EditOutlined,
  UserOutlined
} from '@ant-design/icons';
import {API_URLS } from '../../api/apiUrl.js'
import { apiGet } from '../../api/http';
import { useMerchant } from '../../context/MerchantContext';

export default function ViewProfile() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [copiedField, setCopiedField] = useState('');
  const { role} = useMerchant();
  let url =''
    if(role=='user'){
      url=API_URLS.merchant.profile.getProfile
    }
  
    if(role=='admin'){
      url=API_URLS.admin.profile.getProfile
    }

  const [profile, setProfile] = useState({
    company_name: '',
    company_email: '',
    name: '',
    contact_detail: '',
    website: '',
    gstin: '',
    pancard: '',
    webhook: '',
    status: ''
  });

  const getProfile = async () => {
    try {
      const res = await apiGet(url);
      if (res?.success) {
        setProfile(res.data?.message || {});
      } else {
        console.error(res?.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
console.log(profile,'uuyy')
  useEffect(() => {
    getProfile();
  }, []);

  const getValue = (value) => value || 'Not Provided';

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setSnackbar({ open: true, message: 'Copied to clipboard!' });
    setTimeout(() => {
      setCopiedField('');
      setSnackbar({ open: false, message: '' });
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const InfoCard = ({ icon: Icon, label, value, copyable, isChip, chipColor }) => {
    const displayValue = getValue(value);
    const canCopy = copyable && displayValue !== 'Not Provided';
    const isCopied = copiedField === label;

    return (
      <Card
        elevation={0}
        sx={{
          height: '100%',
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 2.5,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(98, 54, 141, 0.12)',
            borderColor: '#62368D',
            '& .copy-button': {
              opacity: 1,
              transform: 'scale(1)'
            },
            '& .icon-box': {
              transform: 'scale(1.05)',
              background: 'linear-gradient(135deg, #62368D 0%, #E94560 100%)',
              '& .anticon': {
                color: '#fff'
              }
            }
          }
        }}
      >
        <CardContent sx={{ p: 2.5, height: '100%' }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            {/* Icon and Label */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                className="icon-box"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #F3E8FF 0%, #FFE8F0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  '& .anticon': {
                    fontSize: 18,
                    color: '#62368D',
                    transition: 'color 0.3s ease'
                  }
                }}
              >
                <Icon />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: '#757575',
                    fontSize: '0.65rem',
                    display: 'block'
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </Stack>

            {/* Value */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 'auto !important' }}
            >
              {isChip ? (
                <Chip
                  icon={value === 'PENDING' ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
                  label={displayValue}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 36,
                    borderRadius: 2,
                    ...(chipColor === 'success'
                      ? {
                          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                          color: '#2e7d32',
                          border: '1px solid #a5d6a7'
                        }
                      : {
                          background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
                          color: '#f57c00',
                          border: '1px solid #ffd54f'
                        })
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      color: displayValue === 'Not Provided' ? '#bdbdbd' : '#424242',
                      fontStyle: displayValue === 'Not Provided' ? 'italic' : 'normal',
                      wordBreak: 'break-word',
                      flex: 1,
                      lineHeight: 1.4
                    }}
                  >
                    {displayValue}
                  </Typography>

                  {canCopy && (
                    <Tooltip title={isCopied ? 'Copied!' : 'Copy'} arrow>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(displayValue, label)}
                        className="copy-button"
                        sx={{
                          opacity: 0,
                          transform: 'scale(0.8)',
                          transition: 'all 0.2s ease',
                          color: isCopied ? '#4caf50' : '#62368D',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #F3E8FF 0%, #FFE8F0 100%)'
                          }
                        }}
                      >
                        {isCopied ? <CheckCircleOutlined /> : <CopyOutlined />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f8f9fa',
        p: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Grid container spacing={4}>
          {/* Header Card */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #62368D 0%, #7b4397 50%, #E94560 100%)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative' }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  spacing={3}
                >
                  {/* Left Section */}
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar
                      sx={{
                        width: { xs: 64, md: 80 },
                        height: { xs: 64, md: 80 },
                        bgcolor: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(10px)',
                        border: '3px solid rgba(255,255,255,0.3)',
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        fontWeight: 700,
                        color: '#fff',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                      }}
                    >
                      {profile.company_name?.charAt(0) || 'C'}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: '#fff',
                          fontSize: { xs: '1.75rem', md: '2.5rem' },
                          mb: 1,
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                      >
                        {profile.company_name || 'Company Profile'}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          fontWeight: 500
                        }}
                      >
                        Manage your company information and settings
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Right Section */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      icon={<CheckCircleOutlined />}
                      label={profile.status || 'N/A'}
                      sx={{
                        bgcolor: '#2e7d32',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        height: 40,
                        px: 1,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                        '& .anticon': {
                          color: '#fff'
                        }
                      }}
                    />

                    <IconButton
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        border: '2px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                          transform: 'scale(1.1)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      <EditOutlined />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Company Information Section */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(180deg, #62368D 0%, #E94560 100%)',
                  borderRadius: 2
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#212121',
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                Company Information
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={4}>
                <InfoCard icon={ShopOutlined} label="Company Name" value={profile.company_name} />
              </Grid>

              <Grid item xs={12} sm={6} lg={4}>
                <InfoCard
                  icon={MailOutlined}
                  label="Company Email"
                  value={profile.company_email}
                  copyable
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={4}>
                <InfoCard
                  icon={PhoneOutlined}
                  label="Contact Number"
                  value={profile.contact_detail}
                  copyable
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={4}>
                <InfoCard icon={GlobalOutlined} label="Website" value={profile.website} copyable />
              </Grid>

              <Grid item xs={12} sm={6} lg={4}>
                <InfoCard icon={FileTextOutlined} label="GSTIN" value={profile.gstin} copyable />
              </Grid>

              <Grid item xs={12} sm={6} lg={4}>
                <InfoCard
                  icon={CreditCardOutlined}
                  label="PAN Status"
                  value={profile.pancard}
                  isChip
                  chipColor={profile.pancard === 'PENDING' ? 'warning' : 'success'}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Integration Section */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(180deg, #62368D 0%, #E94560 100%)',
                  borderRadius: 2
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#212121',
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                Integration & API
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <InfoCard icon={ApiOutlined} label="Webhook URL" value={profile.webhook} copyable />
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoCard icon={UserOutlined} label="Contact Person" value={profile.name} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}