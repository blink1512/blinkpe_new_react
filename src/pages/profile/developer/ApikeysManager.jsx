import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';

import {
  KeyOutlined,
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { apiGet, apiPost } from '../../../api/http';
import { useMerchant } from '../../../context/MerchantContext';
import { API_URLS } from '../../../api/apiUrl';

export default function APIKeysManager() {
  const [keys, setKeys] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openKeysDialog, setOpenKeysDialog] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const { role} = useMerchant();
  useEffect(() => {
    getApikeys();
  }, []);

  
    let geturl =''
     let generateurl =''
      if(role=='user'){
        geturl=API_URLS.merchant.apikey.getApikey
        generateurl=API_URLS.merchant.apikey.updateApikey
      }
    
      if(role=='admin'){
        geturl=API_URLS.admin.apikey.getApikey
        generateurl=API_URLS.admin.apikey.updateApikey
      }
  const getApikeys = async () => {
    try {
      const res = await apiGet(geturl);
      if (res?.success) {
        setKeys(res.data?.message || {});
      } else {
        console.error(res?.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateApikeys = async () => {
    setLoading(true);
    try {
      const res = await apiPost(generateurl);
      if (res?.data?.message?.success) {
        setGeneratedKeys({
          api_key: res.data.message.api_key,
          api_secret: res.data.message.api_secret
        });
        setOpenConfirmDialog(false);
        setOpenKeysDialog(true);
        getApikeys(); // Refresh the keys list
        showNotification('API Keys generated successfully!', 'success');
      } else {
        showNotification('Failed to generate API keys', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Error generating API keys', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    showNotification('Copied to clipboard!', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ open: true, message, type });
    setTimeout(() => setNotification({ open: false, message: '', type: 'success' }), 3000);
  };

  const handleDelete = () => {
    showNotification('Delete functionality coming soon!', 'info');
  };

  const handleCloseKeysDialog = () => {
    setOpenKeysDialog(false);
    setGeneratedKeys(null);
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2.5,
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <KeyOutlined style={{ fontSize: 20, color: '#3F51B5' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#212121' }}>
                  API Keys
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', fontSize: '0.875rem' }}>
                  Manage your application keys
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => setOpenConfirmDialog(true)}
              sx={{
                bgcolor: '#3F51B5',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(63, 81, 181, 0.2)',
                '&:hover': {
                  bgcolor: '#303F9F',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)'
                }
              }}
            >
              Generate API Keys
            </Button>
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#757575', textTransform: 'uppercase' }}>
                  API Key
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#757575', textTransform: 'uppercase' }}>
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#757575', textTransform: 'uppercase' }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys.api_key ? (
                <TableRow
                  sx={{
                    '&:hover': { bgcolor: '#fafafa' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        component="code"
                        sx={{
                          fontSize: '0.75rem',
                          color: '#424242',
                          bgcolor: '#f5f5f5',
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1.5,
                          fontFamily: 'monospace'
                        }}
                      >
                        {keys.api_key}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Active"
                      size="small"
                      icon={
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#4caf50',
                            ml: 1
                          }}
                        />
                      }
                      sx={{
                        bgcolor: '#E8F5E9',
                        color: '#2e7d32',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Copy">
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(keys.api_key)}
                          sx={{
                            color: '#757575',
                            '&:hover': {
                              bgcolor: '#E8EAF6',
                              color: '#3F51B5'
                            }
                          }}
                        >
                          <CopyOutlined style={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={handleDelete}
                          sx={{
                            color: '#757575',
                            '&:hover': {
                              bgcolor: '#FFEBEE',
                              color: '#d32f2f'
                            }
                          }}
                        >
                          <DeleteOutlined style={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                      No API keys generated yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog 
        open={openConfirmDialog} 
        onClose={() => setOpenConfirmDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#FFF3E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <WarningOutlined style={{ fontSize: 20, color: '#F57C00' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Generate API Keys
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: '#616161', lineHeight: 1.6 }}>
            Are you sure you want to generate new API keys? This action will create a new API key and secret for your application.
          </Typography>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: '#FFF3E0',
              borderRadius: 2,
              border: '1px solid #FFE0B2'
            }}
          >
            <Typography variant="body2" sx={{ color: '#E65100', fontSize: '0.813rem' }}>
              ⚠️ Make sure to copy and save your API secret immediately after generation. You won't be able to see it again.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            disabled={loading}
            sx={{
              color: '#616161',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={generateApikeys}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#3F51B5',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              '&:hover': { bgcolor: '#303F9F' }
            }}
          >
            {loading ? 'Generating...' : 'Confirm & Generate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generated Keys Display Dialog */}
      <Dialog 
        open={openKeysDialog} 
        onClose={handleCloseKeysDialog}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#E8F5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircleOutlined style={{ fontSize: 20, color: '#4CAF50' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              API Keys Generated Successfully
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#FFFDE7',
              borderRadius: 2,
              border: '1px solid #FFF59D',
              mb: 3
            }}
          >
            <Typography variant="body2" sx={{ color: '#F57F17', fontSize: '0.813rem', fontWeight: 500 }}>
              🔒 Important: Copy and save these credentials now. The API secret will not be shown again for security reasons.
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {/* API Key */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#424242' }}>
                API Key
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography
                  component="code"
                  sx={{
                    flex: 1,
                    fontSize: '0.875rem',
                    color: '#212121',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all'
                  }}
                >
                  {generatedKeys?.api_key}
                </Typography>
                <Tooltip title="Copy API Key">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(generatedKeys?.api_key)}
                    sx={{
                      color: '#757575',
                      '&:hover': {
                        bgcolor: '#E8EAF6',
                        color: '#3F51B5'
                      }
                    }}
                  >
                    <CopyOutlined style={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider />

            {/* API Secret */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#424242' }}>
                API Secret
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography
                  component="code"
                  sx={{
                    flex: 1,
                    fontSize: '0.875rem',
                    color: '#212121',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all'
                  }}
                >
                  {generatedKeys?.api_secret}
                </Typography>
                <Tooltip title="Copy API Secret">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(generatedKeys?.api_secret)}
                    sx={{
                      color: '#757575',
                      '&:hover': {
                        bgcolor: '#E8EAF6',
                        color: '#3F51B5'
                      }
                    }}
                  >
                    <CopyOutlined style={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseKeysDialog}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#3F51B5',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.2,
              borderRadius: 2,
              '&:hover': { bgcolor: '#303F9F' }
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notification.type}
          variant="filled"
          icon={<CheckCircleOutlined />}
          sx={{
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}